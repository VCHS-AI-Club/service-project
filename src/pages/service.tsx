import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { GetServerSideProps, NextPage } from 'next'
import { Session, unstable_getServerSession } from 'next-auth'
import { getSession, useSession } from 'next-auth/react'
import React, { useMemo, useState } from 'react'
import { InterestModal, Interests } from '../components/InterestsModal'
import { env } from '../env/client.mjs'
import { env as serverEnv } from '../env/server.mjs'
import { authOptions } from './api/auth/[...nextauth]'

type Opp = {
  name: string
  desc: string
  start: number
  end: number
  lat: number
  lon: number
  id: number
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

const ServiceCard: React.FC<{ opp: Opp }> = ({ opp: { name, desc, id } }) => {
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
    <article className='flex w-96 justify-between rounded-lg border border-gray-200  bg-white p-6 shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'>
      <div>
        <h2 className='text-gray-50'>
          {id} | {name}
        </h2>
        <p className='break-words text-gray-300'>{desc}</p>
      </div>
      <div className=' flex flex-col items-center justify-center'>
        <button
          className='text-red-500'
          onClick={() => deleteMutation.mutate({ id })}
        >
          X
        </button>
        <p className='text-green-400'>80%</p>
      </div>
    </article>
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
