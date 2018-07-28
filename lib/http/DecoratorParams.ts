export type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
export type DecoratorParams = {
    method?: HttpMethod;
    url?: string;
};
