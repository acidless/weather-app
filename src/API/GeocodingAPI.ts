import API from "./API";

export type Coordinates = {
    latitude: number;
    longitude: number;
}

export class GeocodingAPI extends API {
    constructor() {
        super("https://geocoding-api.open-meteo.com/v1/");
    }

    async getCityCoordinates(city: string): Promise<Coordinates> {
        const response = await this.client.get(`city?name=${city}`);
        const results = response.data.results;
        if (results && results.length > 0) {
            return {
                latitude: results[0].latitude,
                longitude: results[0].longitude,
            }
        }

        throw new Error("No city could be found.");
    }
}