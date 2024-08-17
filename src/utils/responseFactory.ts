import {Response} from "express";

type TSuccessResData<ResDataType> = {
    data: ResDataType;
    accessToken?: string | null;
    results?: number | null;
}

class responseFactory{
    private _res: Response;

    constructor(res: Response) {
        this._res = res;
    }

    createSuccess(status: number, obj: TSuccessResData<any>) {
        return this._res.status(status).json({
            status: "success",
            ...obj
        })
    }

    createFail(status: number, message: string) {
        return this._res.status(status).json({
            status: "fail",
            message: message
        })
    }

    createError(message: string) {
        return this._res.status(500).json({
            status: "error",
            message: message
        })
    }

    static sendSuccess(res: Response, status: number, obj: TSuccessResData<any>){
        return new responseFactory(res).createSuccess(status, obj);
    }
    static sendFail(res: Response,status: number, message: string){
        return new responseFactory(res).createFail(status, message);
    }
    static sendError(res: Response,message: string){
        return new responseFactory(res).createError(message);
    }

}

export default responseFactory;