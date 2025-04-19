import { fromHono } from "chanfana";
import { Hono } from "hono";
import { SonaArtRoute } from "endpoints/sonaart";
import { WeatherRoute } from "endpoints/weather";

const app = new Hono();

const api = fromHono(app, {
	docs_url: "/",
});

api.get("/sonaart", SonaArtRoute)
api.get("/weather", WeatherRoute)

export default app;
