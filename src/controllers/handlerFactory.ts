import {Model} from "mongoose";
import catchRequest from "../utils/catchRequest";
import AppError from "../utils/AppError";
import APIFeatures from "../middlewares/queryMiddleware";
import responseFactory from "../utils/responseFactory";
import Article from "../models/Article";


export const createOne = (Model: Model<any>) => catchRequest(
    async (req, res, next) => {

        const doc = await Model.create(req.body);

        responseFactory
            .sendSuccess(res, 201, {data: doc});
    });

export const deleteOne = (Model: Model<any>) => catchRequest(
    async (req, res, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc)
            return next(new AppError("errors:query.NO_DOCUMENT_FOUND", 404));

        responseFactory
            .sendSuccess(res, 204, {data: null});
    });

export const getOne = (Model: Model<any>) => catchRequest(
    async (req, res, next) => {
        const doc = await Model.findById(req.params.id);

        if (!doc)
            return next(new AppError("errors:query.NO_DOCUMENT_FOUND", 404));

        responseFactory
            .sendSuccess(res, 200, {data: doc});
    });

export const getAll = (Model: Model<any>) => catchRequest(
    async (req, res, next) => {

        const features = new APIFeatures(Model.find(), req.query)
            .filter()
            .limit()
            .sort()
            .paginate();

        const doc = await features.query;

        responseFactory
            .sendSuccess(res, 200, {results: doc.length, data: doc});
    }
)

export const updateOne = (Model: Model<any>) =>catchRequest(
    async (req, res, next) => {

        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!doc)
            return next(new AppError("errors:query.NO_DOCUMENT_FOUND", 404));

        responseFactory
            .sendSuccess(res, 200, {data: doc});
    });