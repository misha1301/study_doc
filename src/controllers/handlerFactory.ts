import {Model} from "mongoose";
import catchRequest from "../utils/catchRequest";
import AppError from "../utils/AppError";
import APIFeatures from "../middlewares/queryMiddleware";
import Article from "../models/Article";


export const deleteOne = (Model: Model<any>) => catchRequest(
    async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc)
            return next(new AppError("errors:query.NO_DOCUMENT_FOUND", 404));

        res.status(204).json({
            status: "success",
            data: null
        });
    });

export const getOne = (Model: Model<any>) => catchRequest(
    async (req, res, next) => {
        const doc = await Model.findById(req.params.id);

        if (!doc)
            return next(new AppError("errors:query.NO_DOCUMENT_FOUND", 404));

        res.status(200).json({
            status: "success",
            data: doc
        });
    });

export const getAll = (Model: Model<any>) => catchRequest(
    async (req, res, next) => {

        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .limit()
            .sort()
            .paginate();

        const doc = await features.query;

        res.status(200).json({
            status: "success",
            results: doc.length,
            data: doc,
        });
    }
)