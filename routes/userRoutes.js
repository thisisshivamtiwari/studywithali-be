import e from "express";
const route = e.Router();

import signUp from '../controllers/user/signUp.js'
import login from '../controllers/user/login.js'

route.post('/signUp', signUp);
route.post('/login', login);

export default route;