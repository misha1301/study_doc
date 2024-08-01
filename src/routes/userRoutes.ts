import {Router} from "express";
import * as authController from './../controllers/authController';

const router = Router();

router.route('/signup')
    .post(authController.signup);

router.route('/login')
    .post(authController.login);

router.route('/forgotPassword')
    .post(authController.forgotPassword)


module.exports = router;
