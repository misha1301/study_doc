import {Request, Response, NextFunction, Router} from "express";
import * as articleController from './../controllers/articleController';
import verifyJWT from './../middlewares/verifyJWT';
import verifyRoles from './../middlewares/verifyRoles';
const router = Router();

router.param('id', (req:Request, res:Response, next:NextFunction, val:any) => {
    next();
});

router.route('/')
    .get(articleController.getAllArticles)
    .post(verifyJWT, verifyRoles("user"), articleController.createArticle);

router.use(verifyJWT);
router.use(verifyRoles("user", "admin"))

router.route('/:id')
    .get(articleController.getArticle)
    .put(articleController.updateArticle)
    .delete(articleController.deleteArticle);

module.exports = router;
