import API from "./API";
import {Coordinates} from "./GeocodingAPI";
import Cache from "../Cache";

export type WeatherData = {
    time: string[];
    temperature_2m: number[];
}

export class WeatherAPI extends API {
    public constructor(cache: Cache) {
        super("https://api.open-meteo.com/v1/", cache);
    }

    public async getForecast({latitude, longitude}: Coordinates) {
        const key = `${latitude}_${longitude}`;

        const cachedWeather = await this.cache.get<WeatherData>(key);
        if(cachedWeather) {
            return cachedWeather;
        }

        const response = await this.client.get(
            `forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
        await this.cache.set(key, response.data.hourly.forecast);
        return response.data.hourly;
    }
}