import Article from "./../models/Article";
import APIFeatures from "../middlewares/queryMiddleware";
import catchRequest from "../utils/catchRequest";
import * as handleFactory from "./handlerFactory"

export const createArticle = catchRequest(
    async (req, res, next) => {

        console.log(req.body);
        const article = await Article.create(req.body);

        res.status(201).json({
            status: "success",
            data: article,
        });
    });

export const getAllArticles = handleFactory.getAll(Article);

export const getArticle = handleFactory.getOne(Article);

export const updateArticle = catchRequest(
    async (req, res, next) => {

        const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "success",
            data: article,
        });

    });

export const deleteArticle = handleFactory.deleteOne(Article)

export const getArticleStats = catchRequest(
    async (req, res, next) => {

        const stats = await Article.aggregate([
            {
                $match: {}
            }
        ])

    });
