import { responseFun } from "../../helper/helperFunc.js";
import admissionFormModel from "../../models/admissionForm.js";

const createApplication = async (req, res) => {
    try {
        const data = req.body;

        // Basic required validation
        if (!data.firstName || !data.lastName || !data.email) {
            return responseFun(res, false, 400, 'First name, last name and email are required');
        }

        if (!data.agreedToTerms) {
            return responseFun(res, false, 400, 'You must agree to the terms');
        }

        // Create document
        const application = await admissionFormModel.create(data);

        return responseFun(res, true, 201, 'Application submitted successfully', application);

    } catch (error) {
        console.error(error);

        return responseFun(res, false, 500, "Server error");
    }
};

export default createApplication;