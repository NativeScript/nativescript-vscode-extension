declare namespace Webkit {
    interface Request<T> {
        id: number;
        method: string;
        params?: T;
    }

    interface Response<T> {
        id?: number;
        error?: any;
        result?: T;
    }
}