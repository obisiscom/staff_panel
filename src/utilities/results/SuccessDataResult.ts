import { IDataResult } from "./IDataResult";

export class SuccessDataResult<T> implements IDataResult<T> {
    data: T;
    message: string | null;
    success: boolean;

    constructor(data: T, message?: string) {
        this.data = data;
        this.success = true;
        this.message = message || null;
    }
}