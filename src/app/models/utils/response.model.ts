export class Response<T>  {
    ok?: boolean;
    message?: string;
    data?: Array<T> = [];
    status?: number;
    currentPage?: number;
    totalPages?: number;
}