import {GeocodingAPI} from "../../src/API/GeocodingAPI";
import Cache from "../../src/Cache";

const mockGet = jest.fn();

const mockCache = {
    get: jest.fn(),
    set: jest.fn()
} as unknown as Cache;

jest.mock("../../src/API/API", () => {
    return class MockAPI {
        public client = {get: mockGet};
        public cache = mockCache;

        constructor() {}
    };
});

describe("GeocodingAPI", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return coordinates from cache", async () => {
        const cached = {settlement: "London", latitude: 51.5072, longitude: -0.1276};
        mockCache.get = jest.fn().mockResolvedValue(cached);

        const api = new GeocodingAPI(mockCache);
        const coords = await api.getCityCoordinates("London");

        expect(coords).toEqual(cached);
        expect(mockCache.get).toHaveBeenCalledWith("London");
        expect(mockGet).not.toHaveBeenCalled();
    });

    it("should make request and put response in cache", async () => {
        mockCache.get = jest.fn().mockResolvedValue(null);
        mockGet.mockResolvedValue({
            data: {
                results: [
                    {name: "Paris", latitude: 48.8566, longitude: 2.3522}
                ]
            }
        });

        const api = new GeocodingAPI(mockCache);
        const coords = await api.getCityCoordinates("Paris");

        expect(coords).toEqual({
            settlement: "Paris",
            latitude: 48.8566,
            longitude: 2.3522
        });
        expect(mockGet).toHaveBeenCalledWith("/search?name=Paris");
        expect(mockCache.set).toHaveBeenCalledWith("Paris", coords);
    });

    it("should throw exception if settlement was not found", async () => {
        mockCache.get = jest.fn().mockResolvedValue(null);
        mockGet.mockResolvedValue({data: {results: []}});

        const api = new GeocodingAPI(mockCache);

        await expect(api.getCityCoordinates("UnknownCity")).rejects.toThrow("No city could be found.");
    });
});