import Link from 'next/link'

type Opp = {
  name: string
  desc: string
  start: number
  end: number
  lat: number
  lon: number
  id: number
}
export const ServiceOpp = (opp: Opp) => {
  return (
    <article>
      <h3>{opp.name}</h3>
      <p>{opp.desc}</p>

      <div>
        {new Date(opp.start)} | {new Date(opp.end)}
      </div>

      <Link href={`https://maps.google.com/@${opp.lat},${opp.lon}`}>
        Google Maps
      </Link>
    </article>
  )
}
