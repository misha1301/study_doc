import {Request, Response, NextFunction, Router} from "express";
import * as articleController from './../controllers/articleController';
import verifyJWT from './../middlewares/verifyJWT';

const router = Router();

router.param('id', (req:Request, res:Response, next:NextFunction, val:any) => {
    next();
});

router.route('/')
    .get(articleController.getAllArticles)
    .post(articleController.createArticle);

router.use(verifyJWT);

router.route('/:id')
    .get(articleController.getArticle)
    .put(articleController.updateArticle)
    .delete(articleController.deleteArticle);

module.exports = router;
