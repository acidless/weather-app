import { WeatherAPI } from "../../src/API/WeatherAPI";
import Cache from "../../src/Cache";
import { Coordinates } from "../../src/API/GeocodingAPI";

const mockGet = jest.fn();

const mockCache = {
    get: jest.fn(),
    set: jest.fn()
} as unknown as Cache;

jest.mock("../../src/API/API", () => {
    return class MockAPI {
        public client = { get: mockGet };
        public cache = mockCache;
        constructor() {}
    };
});

describe("WeatherAPI", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const coords: Coordinates = {
        settlement: "London",
        latitude: 51.5072,
        longitude: -0.1276
    };

    it("should return forecast from cache", async () => {
        const cachedData = {
            "04.10": {
                time: ["12:00"],
                temperature: [15]
            }
        };

        mockCache.get = jest.fn().mockResolvedValue(cachedData);

        const api = new WeatherAPI(mockCache);
        const result = await api.getForecast(coords);

        expect(result).toEqual(cachedData);
        expect(mockCache.get).toHaveBeenCalledWith("51.5072_-0.1276");
        expect(mockGet).not.toHaveBeenCalled();
    });

    it("should make request, if there is no data in cache, and save result", async () => {
        mockCache.get = jest.fn().mockResolvedValue(null);

        mockGet.mockResolvedValue({
            data: {
                hourly: {
                    time: [
                        "2025-10-10T00:00",
                        "2025-10-10T01:00"
                    ],
                    temperature_2m: [10, 11]
                }
            }
        });

        const api = new WeatherAPI(mockCache);
        const result = await api.getForecast(coords);

        expect(mockGet).toHaveBeenCalledWith(
            "forecast?latitude=51.5072&longitude=-0.1276&hourly=temperature_2m"
        );

        expect(mockCache.set).toHaveBeenCalled();

        const keys = Object.keys(result);
        expect(keys.length).toBe(1);
        expect(result[keys[0]].time.length).toBe(2);
        expect(result[keys[0]].temperature).toEqual([10, 11]);
    });

    it("should handle multiple days correctly", async () => {
        mockCache.get = jest.fn().mockResolvedValue(null);

        mockGet.mockResolvedValue({
            data: {
                hourly: {
                    time: [
                        "2025-10-10T23:00",
                        "2025-10-11T00:00"
                    ],
                    temperature_2m: [14, 12]
                }
            }
        });

        const api = new WeatherAPI(mockCache);
        const result = await api.getForecast(coords);

        expect(Object.keys(result).length).toBe(2);
        expect(result).toMatchObject({
            "10.10": expect.any(Object),
            "11.10": expect.any(Object)
        });
    });
});
