import { responseFun } from "../../helper/helperFunc.js";
import { signJwt } from "../../middleware/authFunc.js";
import userModel from "../../models/userModel.js";
import bcrypt from "bcrypt"

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return responseFun(res, false, 400, 'Email/Phone & Password Required .');
        }

        const findUser = await userModel.findOne({ $or: [{ email: email }, { phoneNumber: email }] });

        if (!findUser) {
            return responseFun(res, false, 404, 'You are not registered with us .');
        }

        const validatePassword = await bcrypt.compare(password, findUser.password);

        if (!validatePassword) {
            return responseFun(res, false, 401, 'Invalid Credential ');
        }

        const token = await signJwt({
            userId: findUser?.userId,
            name: findUser?.name,
            phoneNumber: findUser?.phoneNumber,
            email: findUser?.email,
        });

        return responseFun(res, true, 200, 'Login Successfully', {
            userId: findUser?.userId,
            name: findUser?.name,
            phoneNumber: findUser?.phoneNumber,
            email: findUser?.email,
            ...token
        });

    } catch (error) {
        console.log('error: ', error);
        return responseFun(res, false, 500, error.message);
    }
}

export default login;