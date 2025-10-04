import API from "./API";
import {Coordinates} from "./GeocodingAPI";

class WeatherAPI extends API {
    public constructor() {
        super("https://api.open-meteo.com/v1/");
    }

    async getForecast({latitude, longitude}: Coordinates) {
        const response = await this.client.get(
            `forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
        return response.data;
    }
}