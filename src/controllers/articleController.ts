import Article from "./../models/Article";
import APIFeatures from "../middlewares/queryMiddleware";
import catchRequest from "../utils/catchRequest";

export const createArticle = catchRequest(
    async (req, res, next) => {

        console.log(req.body);
        const article = await Article.create(req.body);

        res.status(201).json({
            status: "success",
            data: article,
        });
    });

export const getAllArticles = catchRequest(
    async (req, res, next) => {


        const articleQuery = new APIFeatures(Article.find(), req.query)
            .filter()
            .limit()
            .sort()
            .paginate();

        const articles = await articleQuery.query;

        res.status(200).json({
            status: "success",
            data: articles,
        });

    });

export const getArticle = catchRequest(
    async (req, res, next) => {

        console.log(req)
        const article = await Article.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: article,
        });

    });

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

export const deleteArticle = catchRequest(
    async (req, res, next) => {

        const article = await Article.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: "success",
            data: article,
        });

    });

export const getArticleStats = catchRequest(
    async (req, res, next) => {

        const stats = await Article.aggregate([
            {
                $match: {}
            }
        ])

    });
