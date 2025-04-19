import { Str, Num } from "chanfana";
import { z } from "zod";

export const SonaArtSchema = z.object({
	artist: Str(),
	artisturl: Str(),
	platform: Str(),
	file: Str(),
	date: Str(),
	dateUnix: Num(),
})

export const WeatherSchema = z.object({
  coord: z.object({
    lon: Num(),
    lat: Num(),
  }),
  weather: z.array(
    z.object({
      id: Num(),
      main: Str(),
      description: Str(),
      icon: Str(),
    }),
  ),
  base: Str(),
  main: z.object({
    temp: Num(),
    feels_like: Num(),
    temp_min: Num(),
    temp_max: Num(),
    pressure: Num(),
    humidity: Num(),
    sea_level: Num(),
    grnd_level: Num(),
  }),
  visibility: Num(),
  wind: z.object({
    speed: Num(),
    deg: Num(),
  }),
  rain: z
    .object({
      '1h': Num(),
    })
    .optional(),
  clouds: z.object({
    all: Num(),
  }),
  dt: Num(),
  sys: z.object({
    type: Num(),
    id: Num(),
    country: Str(),
    sunrise: Num(),
    sunset: Num(),
  }),
  timezone: Num(),
  id: Num(),
  name: Str(),
  cod: Num(),
});
