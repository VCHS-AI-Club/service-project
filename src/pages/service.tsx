import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetServerSideProps, NextPage } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { getSession, useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useMemo, useState } from 'react'
import { InterestModal, Interests } from '../components/InterestsModal'
import { env } from '../env/client.mjs'
import { env as serverEnv } from '../env/server.mjs'
import { authOptions } from './api/auth/[...nextauth]'

type Opp = {
  id: string
  name: string
  desc: string
  isChurch: boolean
  contact: string
  website: string

  lat: number
  lon: number
  start: number
  end: number
}

const Service: NextPage<{ interests: Interests | null }> = ({ interests }) => {
  const { data: session } = useSession()
  const queryClient = useQueryClient()
  if (!session) {
    return <div>Please Sign In</div>
  }

  const {
    isLoading,
    error,
    data: opps,
  } = useQuery<Opp[], Error>(['opps'], async (): Promise<Opp[]> => {
    const res = await fetch(env.NEXT_PUBLIC_API_URL + '/opps')
    const arr = (await res.json()) as Opp[]
    return arr
  })

  const { mutate: mutateOpps } = useMutation(
    (oppPost: { name: string; desc: string }) => {
      return fetch(env.NEXT_PUBLIC_API_URL + '/opps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(oppPost),
      })
    },
    { onSuccess: () => queryClient.invalidateQueries(['opps']) }
  )

  const { data: ints } = useQuery<Interests | null, Error>(
    ['interests'],
    async (): Promise<Interests> => {
      const res = await fetch(
        env.NEXT_PUBLIC_API_URL + `/users/${session?.user?.id}`
      )
      const ints = (await res.json()) as Interests
      return ints
    },
    { initialData: interests }
  )

  const [interestsModalOpen, setInterestsModalOpen] = useState(ints === null)
  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>error</div>}
      <h1 className='text-center text-5xl font-extrabold leading-normal text-purple-300 md:text-[5rem]'>
        Service
      </h1>
      <div className='flex flex-col items-center gap-4 px-32'>
        {opps?.map((opp) => (
          <ServiceCard opp={opp} key={opp.id} />
        ))}
        <button
          onClick={() => queryClient.invalidateQueries(['opps'])}
          className='rounded bg-purple-300'
        >
          Re-Fetch
        </button>
      </div>
      <InterestModal
        session={session}
        interests={interests}
        open={interestsModalOpen}
        setOpen={setInterestsModalOpen}
      />
      <button onClick={() => setInterestsModalOpen(true)}>
        Update Interests
      </button>
    </>
  )
}

const ServiceCard: React.FC<{ opp: Opp }> = ({ opp }) => {
  const queryClient = useQueryClient()
  const deleteMutation = useMutation(
    (del: { id: number }) => {
      return fetch(env.NEXT_PUBLIC_API_URL + `/opps/${del.id}`, {
        method: 'DELETE',
      })
    },
    {
      onSuccess: () => queryClient.invalidateQueries(['opps']),
    }
  )
  return (
    <>
      <article className='max-w-sm overflow-hidden rounded shadow-lg'>
        <div className='px-6 py-4'>
          <div className='mb-2 text-xl font-bold'>{opp.name}</div>
          <p className='text-base text-gray-700'>{opp.desc}</p>
          <Link href={`https://maps.google.com/maps/@${opp.lat},${opp.lon}`}>
            <a target='_blank'>Google Maps</a>
          </Link>
          <p>
            {new Date(opp.start).toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p>
            {new Date(opp.end).toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p>{opp.contact}</p>
          <Link href={opp.website}>Website</Link>

          <span
            className={
              'mr-2 mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 ' +
              (opp.isChurch ? 'bg-blue-200' : 'bg-green-200')
            }
          >
            {opp.isChurch ? 'Church' : 'Organization'}
          </span>
        </div>
        <div className='px-6 pt-4 pb-2'>
          <span className='mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700'>
            #photography
          </span>
          <span className='mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700'>
            #travel
          </span>
          <span className='mr-2 mb-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700'>
            #winter
          </span>
        </div>
      </article>
    </>
  )
}

export default Service

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  )

  let interests: Interests | null = null
  try {
    const res = await fetch(serverEnv.API_URL + `/users/${session?.user?.id}`)
    interests = (await res.json()) as Interests
  } catch (err) {
    console.log(err)
  }
  return { props: { session, interests } }
}
