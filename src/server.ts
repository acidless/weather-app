import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import {GeocodingAPI} from "./API/GeocodingAPI";
import {WeatherAPI} from "./API/WeatherAPI";
import Cache from "./Cache";

dotenv.config();

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
process.env.BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

async function main() {
    console.log("Starting the server...");
    const cache = await Cache.create();
    const geocodingAPI = new GeocodingAPI(cache);
    const weatherAPI = new WeatherAPI(cache);

    app.get('/weather', async (req, res) => {
        const {city} = req.query;
        if (!city) {
            return res.status(400).json({error: 'City is required.'});
        }

        try {
            const coordinates = await geocodingAPI.getCityCoordinates(city as string);
            const forecast = await weatherAPI.getForecast(coordinates);
            res.json(forecast);
        } catch (err) {
            res.status(500).json({success: false, error: (err as Error).message});
        }
    });

    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
}

main().catch(err => {
    console.error("Failed to start app:", err);
    process.exit(1);
});