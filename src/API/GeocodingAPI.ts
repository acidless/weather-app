import API from "./API";
import Cache from "../Cache";

export type Coordinates = {
    settlement: string;
    latitude: number;
    longitude: number;
}

export class GeocodingAPI extends API {
    public constructor(cache: Cache) {
        super("https://geocoding-api.open-meteo.com/v1/", cache);
    }

    public async getCityCoordinates(city: string): Promise<Coordinates> {
        const cachedCoordinates = await this.cache.get<Coordinates>(city);
        if(cachedCoordinates) {
            return cachedCoordinates;
        }

        const response = await this.client.get(`/search?name=${city}`);
        const results = response.data.results;
        if (results && results.length > 0) {
            const coordinates = {
                settlement: results[0].name,
                latitude: results[0].latitude,
                longitude: results[0].longitude,
            };
            await this.cache.set(city, coordinates);

            return coordinates;
        }

        throw new Error("No city could be found.");
    }
}