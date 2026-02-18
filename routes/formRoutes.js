import e from "express";
const route = e.Router();

import { verifyJwt } from "../middleware/authFunc.js";
import createApplication from "../controllers/form/createApplication.js";
import getApplications from "../controllers/form/getApplications.js";

route.post('/admission', createApplication);
route.get('/applications', verifyJwt, getApplications);

export default route;