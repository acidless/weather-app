import axios, {AxiosInstance} from "axios";

abstract class API {
    protected client: AxiosInstance;

    public constructor(protected baseURL: string) {
        this.client = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
}

export default API;