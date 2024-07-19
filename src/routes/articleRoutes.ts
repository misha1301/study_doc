import {Request, Response, NextFunction, Router} from "express";

const router = Router();

const articleController = require('./../controllers/articleController');

router.param('id', (req:Request, res:Response, next:NextFunction, val:any) => {
    next();
});

router.route('/')
    .get(articleController.getAllArticles)
    .post(articleController.createArticle);

router.route('/:id')
    .get(articleController.getArticle)
    .put(articleController.updateArticle)
    .delete(articleController.deleteArticle);

module.exports = router;
