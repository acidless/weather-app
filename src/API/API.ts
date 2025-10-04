import axios, {AxiosInstance} from "axios";
import Cache from "../Cache";

abstract class API {
    protected client: AxiosInstance;

    public constructor(protected baseURL: string, protected cache: Cache) {
        this.client = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            }
        });
    }
}

export default API;