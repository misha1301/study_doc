import {Request, Response} from 'express';
const Article = require("./../models/Article");
import APIFeatures from "../middlewares/queryMiddleware";
import * as mongoose from "mongoose";

const createArticle = async (req:Request, res:Response): Promise<void> => {
  try {
    console.log(req.body);
    const article = await Article.create(req.body);

    res.status(201).json({
      status: "success",
      data: article,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getAllArticles = async (req:Request, res:Response): Promise<void> => {
  try {

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
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

const getArticle = async (req:Request, res:Response): Promise<void> => {
  try {
    const article = await Article.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: article,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

// const options = {
//     projection: {_id: 0, field1: 1},
// };
const updateArticle = async (req:Request, res:Response): Promise<void> => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: article,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};
//loh
const deleteArticle = async (req:Request, res:Response): Promise<void> => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: article,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};


const getArticleStats = async (req: Request, res: Response): Promise<void> => {
  try{
    const stats = await  Article.aggregate([
      {
        $match:{

        }
      }
    ])
  }catch(err){

  }
}

module.exports = {
  createArticle,
  getArticle,
  getAllArticles,
  updateArticle,
  deleteArticle,
};
