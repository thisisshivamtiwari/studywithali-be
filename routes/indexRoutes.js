import e from "express";
const route = e.Router();

import userRoutes from './userRoutes.js';
import formRoutes from './formRoutes.js';

route.use('/user', userRoutes);
route.use('/form', formRoutes);

export default route;