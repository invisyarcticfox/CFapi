import { Str, Num, Arr, Obj, Bool } from 'chanfana'


export const SonaArtSchema = Arr({
  artist: Str,
  artisturl: Str,
  file: Str,
  date: Str,
  fraeky: Bool
})

export const WeatherSchema = Obj({
  coord: { lon: Num, lat: Num },
  weather: Arr({
    id: Num,
    main: Str,
    description: Str,
    icon: Str
  }),
  base: Str,
  main: {
    temp: Num,
    feels_like: Num,
    temp_min: Num,
    temp_max: Num,
    pressure: Num,
    humidity: Num,
    sea_level: Num,
    grnd_level: Num
  },
  visibility: Num,
  wind: {
    speed: Num,
    deg: Num,
    gust: Num
  },
  rain: { '1h': Num },
  clouds: { all: Num },
  dt: Num,
  sys: {
    type: Num,
    id: Num,
    country: Str,
    sunrise: Num,
    sunset: Num
  },
  timezone: Num,
  id: Num,
  name: Str,
  cod: Num
})

export const RemindersSchema = Arr({
  txt: Str,
  details: Arr(Str).optional,
  id: Str
})

export const LetterboxdSchema = Obj({
  items: Arr({
    creator: Str,
    title: Str,
    link: Str,
    pubDate: Str,
    "dc:creator": Str,
    content: Str,
    contentSnippet: Str,
    guid: Str,
    isoDate: Str
  }),
  feedUrl: Str,
  paginationLinks: { self: Str },
  title: Str,
  description: Str,
  link: Str
})