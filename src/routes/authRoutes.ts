import {Router} from "express";
import * as authController from './../controllers/authController';
import {validateDto} from "../middlewares/validateDto";
import {changePwdDto, loginDto, signUpDto} from "../dto/authDto";
import verifyJWT from "../middlewares/verifyJWT";


const router = Router();

router.route('/signup')
    .post(validateDto(signUpDto), authController.signup);

router.route('/login')
    .post(validateDto(loginDto), authController.login);

// router.route('/forgotPassword')
//     .post(authController.forgotPassword)

router.route('/refreshToken')
    .get(authController.refreshToken)

router.route('/logout')
    .get(authController.logout);

router.use(verifyJWT);

router.route('/changePassword')
    .put(validateDto(changePwdDto), authController.changePassword)


module.exports = router;
