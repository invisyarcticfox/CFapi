import { fromHono } from "chanfana";
import { Hono } from "hono";
import { SonaArtRoute } from "endpoints/sonaart";
import { WeatherRoute } from "endpoints/weather";
import { FortographyRoute } from "endpoints/fortography";
import { GetRemindersRoute, DeleteReminderRoute, AddReminderRoute } from "endpoints/reminders";

const app = new Hono();

const api = fromHono(app, {
	docs_url: "/",
});

api.get("/sonaart", SonaArtRoute)
api.get("/fortography", FortographyRoute)
api.get("/weather", WeatherRoute)

api.get("/reminders", GetRemindersRoute)
api.post("/reminders", AddReminderRoute)
api.delete("/reminders", DeleteReminderRoute)

export default app;