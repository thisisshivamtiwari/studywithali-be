import { responseFun, generateRandomString } from "../../helper/helperFunc.js";
import { signJwt } from "../../middleware/authFunc.js";
import bcrypt from 'bcrypt'
import userModel from "../../models/userModel.js";

const signUp = async (req, res) => {
    try {
        const { name, email, phoneNumber, password, } = req.body;

        if (!email || !name || !phoneNumber || !password) {
            return responseFun(res, false, 400, 'All fields are required .');
        }

        let findUser = await userModel.findOne({ email });

        if (findUser) {
            return responseFun(res, false, 400, 'This email/phone number is already registered. Please log in instead 🙂.');
        }

        const hassedPassword = await bcrypt.hash(password, 12);

        findUser = await userModel.create({
            userId: generateRandomString(),
            name,
            email,
            phoneNumber,
            password: hassedPassword,
        });

        const token = await signJwt({
            userId: findUser?.userId,
            name: findUser?.name,
            phoneNumber: findUser?.phoneNumber,
            email: findUser?.email,
        });

        return responseFun(res, true, 200, 'Account Created Successfully 😊', {
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

export default signUp;