    import API from "./API";
    import {Coordinates} from "./GeocodingAPI";
    import Cache from "../Cache";

    export type WeatherData = {
        time: string[];
        temperature: number[];
    }

    export type WeatherResponse = { [key: string]: WeatherData };


    export class WeatherAPI extends API {
        public constructor(cache: Cache) {
            super("https://api.open-meteo.com/v1/", cache);
        }

        public async getForecast({latitude, longitude}: Coordinates) {
            const key = `${latitude}_${longitude}`;

            const cachedWeather = await this.cache.get<WeatherResponse>(key);
            if (cachedWeather) {
                return cachedWeather;
            }

            const response = await this.client.get(
                `forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m`);
            const forecast = response.data.hourly;

            const resultWeatherData: WeatherResponse = {};
            forecast.time.forEach((time: string, i: number) => {
                const d = new Date(time);
                const date = d.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                });

                if (!resultWeatherData[date]) {
                    resultWeatherData[date] = {time: [], temperature: []};
                }

                resultWeatherData[date].time.push(d.toLocaleString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit"
                }));
                resultWeatherData[date].temperature.push(forecast.temperature_2m[i]);
            });


            await this.cache.set(key, resultWeatherData);
            return resultWeatherData;
        }
    }