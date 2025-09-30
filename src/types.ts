import type { Context } from 'hono'

export type AppContext = Context<{ Bindings: Env }>
export type HandleArgs = [AppContext]


export type SonaArt = {
  artist: string
  artisturl: string
  file: string
  date: string
  freaky?: boolean
}

export type Reminders = {
  txt: string
  details?: Array<string>
  id: string
}

export type Jetspotter = {
  reg: {
    type: string
    operator: string
    seenCount: number
    lastSeen: string
  }
}