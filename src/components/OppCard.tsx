import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { deleteOppAsc, updateOppRating } from '../api'
import { env } from '../env/client.mjs'

export type Opp = {
  id: number
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
export type RateableOpp = Opp & { rating: number | null }

export const OppCardBase: React.FC<{
  opp: Opp
  children?: React.ReactNode
}> = ({ opp, children }) => {
  return (
    <>
      <article className='max-w-sm overflow-hidden rounded shadow-lg'>
        <div className='px-6 py-4'>
          <div className='flex flex-row justify-between'>
            <div className='mb-2 text-xl font-bold'>{opp.name}</div>
            {children}
          </div>
          <p className='text-base text-gray-700'>{opp.desc}</p>
          <Link href={`https://maps.google.com/maps/@${opp.lat},${opp.lon}`}>
            <a target='_blank'>Google Maps</a>
          </Link>
          <p>
            {new Date(opp.start * 1000).toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
            {}
          </p>
          <p>
            {new Date(opp.end * 1000).toLocaleDateString('en-us', {
              weekday: 'long',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p>{opp.contact}</p>
          {opp.website && <Link href={opp.website}>Website</Link>}

          <div
            className={
              'mr-2 mb-2 inline-block rounded-full px-3 py-1 text-sm font-semibold text-gray-700 ' +
              (opp.isChurch ? 'bg-blue-200' : 'bg-green-200')
            }
          >
            {opp.isChurch ? 'Church' : 'Organization'}
          </div>
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

const Star: React.FC<{ title: string; on?: boolean; onClick: () => void }> = ({
  title,
  on,
  onClick,
}) => {
  return (
    <svg
      aria-hidden='true'
      className={'h-5 w-5 ' + (on ? 'text-yellow-400' : 'text-gray-500')}
      fill='currentColor'
      viewBox='0 0 20 20'
      xmlns='http://www.w3.org/2000/svg'
      onClick={() => onClick()}
    >
      <title>{title}</title>
      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
    </svg>
  )
}
const Rater: React.FC<{ oppId: number; rating: number }> = ({
  oppId,
  rating,
}) => {
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient()

  const { mutate: rateOpp } = useMutation(
    ['rateable opps'],
    (rating: number) => updateOppRating(rating, oppId, user?.id),
    {
      onMutate: async (newRating) => {
        console.log('onMutate', oppId)
        await queryClient.cancelQueries(["rateable opps"])

        const prevOpps = queryClient.getQueryData<RateableOpp[]>(["rateable opps"])
        console.log("prev", prevOpps);

        if (prevOpps) {
          const updatedOpps = prevOpps.map(opp => (opp.id === oppId ? { ...opp, rating: newRating } : opp))
          console.log("updated", updatedOpps);


          queryClient.setQueryData<RateableOpp[]>(["rateable opps"], updatedOpps)
          console.log(
            "asdf", queryClient.getQueryData(["rateable opps"]));

        }

        return { prevOpps }
      },
      onError: (err, vars, ctx) => {
        if (ctx?.prevOpps) {
          queryClient.setQueryData<RateableOpp[]>(["rateable opps"], ctx.prevOpps)
        }
      },
      onSettled: async () => {
        queryClient.invalidateQueries(['rateable opps'])
        console.log('onSettled', oppId)
      },
    }
  )

  return (
    <div className='flex items-center'>
      <Star onClick={() => rateOpp(1)} on={rating >= 1} title='First star' />
      <Star onClick={() => rateOpp(2)} on={rating >= 2} title='Second star' />
      <Star onClick={() => rateOpp(3)} on={rating >= 3} title='Third star' />
      <Star onClick={() => rateOpp(4)} on={rating >= 4} title='Fourth star' />
      <Star onClick={() => rateOpp(5)} on={rating >= 5} title='Fifth star' />
    </div>
  )
}

export const RateableOppCard: React.FC<{ opp: RateableOpp }> = ({ opp }) => {
  return (
    <OppCardBase opp={opp}>
      <Rater oppId={opp.id} rating={opp.rating || 0} />
    </OppCardBase>
  )
}

export const AddableOppCard: React.FC<{ opp: Opp }> = ({ opp }) => {
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient();

  const { mutate: addOpp } = useMutation(['opps'], async (oppId: number) => {
    console.log('mutating opp', JSON.stringify({ user_id: user?.id, opp_id: oppId }), oppId)
    return await fetch(env.NEXT_PUBLIC_API_URL + `/user/opp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user?.id, opp_id: oppId }),
    })
  }, {
    onSettled: async () => {
      console.log("invalidated");

      await queryClient.invalidateQueries(["inverse opps"])
    }
  })

  console.log("Card: opp.id", opp);


  return (
    <OppCardBase opp={opp}>
      <div
        onClick={() => addOpp(opp.id)}
        className='cursor-pointer rounded-full bg-pink-300 p-4'
      >
        add
      </div>
    </OppCardBase>
  )
}

export const RemoveableOppCard: React.FC<{ opp: Opp }> = ({ opp }) => {
  const { data: session } = useSession()
  const user = session?.user
  const queryClient = useQueryClient()
  // TODO: Update api route
  const { mutate: removeOpp } = useMutation(
    ['rateable opps'],
    async () => {
      console.log('deleting opp asc', opp.id)
      return deleteOppAsc(opp.id, user?.id)
    },
    {
      onSettled: async () => {
        await queryClient.invalidateQueries(["rateable opps"])
      }
    }
  )

  return (
    <OppCardBase opp={opp}>
      <div
        onClick={() => removeOpp()}
        className='cursor-pointer rounded-full bg-pink-300 p-4'
      >
        remove
      </div>
    </OppCardBase>
  )
}

export const EditableOppCard: React.FC<{ opp: Opp }> = ({ opp }) => {
  // TODO: Make edit page for opps
  return <div>{JSON.stringify(opp)}</div>
}
