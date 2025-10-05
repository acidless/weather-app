/**
 * @jest-environment jsdom
 */
const fs = require("fs");
const path = require("path");

function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0));
}

describe("Frontend app.js", () => {
    let appJs;

    beforeAll(() => {
        appJs = fs.readFileSync(path.join(process.cwd(), "public/app.js"), "utf-8");
    });

    beforeEach(() => {
        document.body.innerHTML = `
      <form class="get-weather-form">
        <input name="settlement" />
        <button type="submit">Get Weather</button>
      </form>
      <section class="weather-chart">
        <canvas></canvas>
        <div class="weather-chart__days"></div>
      </section>
    `;

        global.Chart = jest.fn().mockImplementation(() => ({
            destroy: jest.fn(),
        }));

        global.alert = jest.fn();
        global.fetch = jest.fn();
    });

    it("should draw chart on success", async () => {
        global.fetch.mockResolvedValue({
            status: 200,
            json: async () => ({
                settlement: "Moscow",
                weather: {
                    "05.10": {
                        time: ["10:00", "11:00"],
                        temperature: [10, 12],
                    },
                },
            }),
        });

        eval(appJs);

        document.dispatchEvent(new Event("DOMContentLoaded"));

        await flushPromises();

        expect(global.fetch).toHaveBeenCalledWith("/weather?city=Moscow");
        expect(global.Chart).toHaveBeenCalled();
    });

    it("should show alert on error", async () => {
        global.fetch.mockResolvedValue({
            status: 500,
            json: async () => ({ error: "Server error" }),
        });

        eval(appJs);
        document.dispatchEvent(new Event("DOMContentLoaded"));

        await flushPromises();

        expect(global.alert).toHaveBeenCalledWith("Server error");
    });
});
