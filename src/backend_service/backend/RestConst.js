export const BACKEND_SERVER = "";
export const BACKEND_URL = BACKEND_SERVER;


export class Method{
    static GET = "get"
    static POST = "post"
    static PUT = "put"
    static DELETE  = "delete"    
}

export const Status = {
    Success: 200,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 404,
    ServerError: 500
}

export const AccessToken = {
    name: "access-token"
}

