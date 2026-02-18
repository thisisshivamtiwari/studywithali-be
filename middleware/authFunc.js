import JWT from "jsonwebtoken";
import {
    randomBytes,
    scryptSync,
    createCipheriv,
    createDecipheriv
} from 'node:crypto';
import dotenv from 'dotenv'
import userModel from "../models/userModel.js";
dotenv.config();

const tokenBlacklist = new Set();
// Use constant values for development (move to secure config in production)
const ENCRYPTION_SALT = process.env.ENCRYPTION_SALT; // 12 bytes hex
const ALGORITHM = process.env.ALGORITHM;

// Generate key only once during startup
const derivedKey = scryptSync(
    String(process.env.ENCRYPTION_KEY),
    Buffer.from(ENCRYPTION_SALT, 'hex'),
    32
);

function encrypt(text) {
    try {
        const iv = randomBytes(16);
        const cipher = createCipheriv(ALGORITHM, derivedKey, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error(`Encryption failed: ${error.message}`);
    }
}

function decrypt(text) {
    try {
        const [ivHex, encryptedText] = text.split(':');
        if (!ivHex || !encryptedText) {
            throw new Error('Invalid encryption format');
        }

        const iv = Buffer.from(ivHex, 'hex');
        const decipher = createDecipheriv(ALGORITHM, derivedKey, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.error('Decryption error details:', {
            error: error.message,
            stack: error.stack,
            code: error.code
        });
        throw new Error(`Decryption failed: ${error.message}`);
    }
}

async function signJwt(payloadData) {
    const encryptedPayload = encrypt(JSON.stringify(payloadData));
    const token = JWT.sign({ data: encryptedPayload }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_TIMEOUT_DURATION || '24h',
    });
    return { token };
}

// Add new function for token verification
async function validateToken(token) {
    try {
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, { ignoreExpiration: true });
        if (!decoded || !decoded.data) {
            return { success: false, message: "Token not found or invalid" };
        }

        if (tokenBlacklist.has(token)) {
            return { success: false, message: "Token is invalid" };
        }

        const decryptedPayload = JSON.parse(decrypt(decoded.data));
        const findUserWithAuth = await userModel
            .findOne({ email: decryptedPayload.email })
            .lean();

        const todayDate = new Date().getTime();
        if (decoded.exp < todayDate / 1000) {
            return { success: false, message: "Token expired" };
        }

        if (!findUserWithAuth) {
            return { success: false, message: "User not found" };
        }

        return { success: true, data: decryptedPayload };
    } catch (error) {
        return {
            success: false,
            message: error.message === "invalid signature"
                ? "Invalid token"
                : "Authentication failed"
        };
    }
}

// Modify existing verifyJwt to use validateToken
async function verifyJwt(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({
            success: false,
            code: 401,
            message: "Not Authorized",
        });
    }

    const result = await validateToken(authorization);
    if (!result.success) {
        return res.status(401).json({
            success: false,
            code: 401,
            message: result.message,
        });
    }

    req.authData = result.data;
    next();
}

async function invalidateToken(token) {
    tokenBlacklist.add(token);
    try {
        const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log('Valid token is now invalidated:');
    } catch (err) {
        console.log('Invalid token:', err.message);
    }
}

function extractToken(value) {
    if (!value || typeof value !== 'string') return null;
    const v = value.trim();
    return v.toLowerCase().startsWith('bearer ') ? v.slice(7).trim() : v;
}

export { signJwt, verifyJwt, validateToken, invalidateToken, extractToken }