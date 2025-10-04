import axios, {AxiosInstance} from "axios";

abstract class API {
    protected client: AxiosInstance;

    public constructor(protected baseUrl: string) {
        this.client = axios.create({
            url: this.baseUrl,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
}

export default API;