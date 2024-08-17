import Article from "./../models/Article";
import catchRequest from "../utils/catchRequest";
import * as handleFactory from "./handlerFactory"

export const createArticle = handleFactory.createOne(Article);
export const getAllArticles = handleFactory.getAll(Article);
export const getArticle = handleFactory.getOne(Article);
export const updateArticle = handleFactory.updateOne(Article);
export const deleteArticle = handleFactory.deleteOne(Article)

export const getArticleStats = catchRequest(
    async (req, res, next) => {

        const stats = await Article.aggregate([
            {
                $match: {}
            }
        ])

    });
