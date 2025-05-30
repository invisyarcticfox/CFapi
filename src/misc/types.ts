import { Str, Num, Arr, Obj } from 'chanfana'

export const SonaArtSchema = Arr({
  artist: Str,
  artisturl: Str,
  platform: Str,
  file: Str,
  date: Str
})

export const WeatherSchema = Obj({
  coord: Obj({
    lon: Num,
    lat: Num,
  }),
  weather: Arr(
    Obj({
      id: Num,
      main: Str,
      description: Str,
      icon: Str,
    }),
  ),
  base: Str,
  main: Obj({
    temp: Num,
    feels_like: Num,
    temp_min: Num,
    temp_max: Num,
    pressure: Num,
    humidity: Num,
    sea_level: Num,
    grnd_level: Num,
  }),
  visibility: Num,
  wind: Obj({
    speed: Num,
    deg: Num,
  }),
  rain: Obj({
    '1h': Num,
  }).optional(),
  clouds: Obj({
    all: Num,
  }),
  dt: Num,
  sys: Obj({
    type: Num,
    id: Num,
    country: Str,
    sunrise: Num,
    sunset: Num,
  }),
  timezone: Num,
  id: Num,
  name: Str,
  cod: Num,
})

export const FortographySchema = Arr({
  char: Str,
  names: Arr(Str)
})

export const GetRemindersSchema = Arr({
  txt: Str,
  details: Arr(Str).optional,
  id: Str
})