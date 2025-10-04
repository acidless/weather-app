import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import {GeocodingAPI} from "./API/GeocodingAPI";
import {WeatherAPI} from "./API/WeatherAPI";

dotenv.config();

const app = express();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
process.env.BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'public')));

app.get('/weather', async (req, res) => {
    const {city} = req.query;
    if (!city) {
        return res.status(400).json({error: 'City is required.'});
    }

    const geocodingAPI = new GeocodingAPI();
    const weatherAPI = new WeatherAPI();
    const coordinates = await geocodingAPI.getCityCoordinates(city as string);
    const forecast = await weatherAPI.getForecast(coordinates);
    res.json({forecast});
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});