import { IResult } from "./IResult";

export class ErrorResult implements IResult {
    message: string | null;
    success: boolean;


    constructor(message?: string) {
        this.success = false;
        this.message = message || null;
    }
}