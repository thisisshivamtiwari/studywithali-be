import { responseFun } from "../../helper/helperFunc.js";
import admissionFormModel from "../../models/admissionForm.js";

const getApplications = async (req, res) => {
    try {
        const applications = await admissionFormModel.find().sort({ createdAt: -1 });

        return responseFun(res, true, 200, 'Applications retrieved successfully', applications);
    } catch (error) {
        console.error(error);
        return responseFun(res, false, 500, "Server error");
    }
}

export default getApplications;