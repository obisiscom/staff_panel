import { IDataResult } from "./IDataResult";

export class ErrorDataResult<T> implements IDataResult<T> {
    data: T | null;
    message: string | null;
    success: boolean;

    constructor(data: T|null=null, message?: string) {
        this.data = data || null;
        this.success = false;
        this.message = message || null;
    }
}