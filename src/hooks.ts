import { Interests } from './components/InterestsModal'
import { Opp } from './components/SereviceOpp'
import { env } from './env/client.mjs'

export const useOpps = async (): Promise<Opp[]> => {
  const res = await fetch(env.NEXT_PUBLIC_API_URL + '/opp')
  const arr = (await res.json()) as Opp[]
  return arr
}

export const useInterests = async (user_id?: string): Promise<Interests> => {
  const res = await fetch(env.NEXT_PUBLIC_API_URL + `/user/${user_id}`)
  const ints = (await res.json()) as Interests
  return ints
}
