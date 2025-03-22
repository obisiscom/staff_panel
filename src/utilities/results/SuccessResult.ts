import { IResult } from "./IResult";

export class SuccessResult implements IResult {
    message: string | null;
    success: boolean;


    constructor(message?: string) {
        this.success = true;
        this.message = message || null;
    }
}