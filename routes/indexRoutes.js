import e from "express";
const route = e.Router();

import userRoutes from './userRoutes.js';

route.use('/user', userRoutes);

export default route;