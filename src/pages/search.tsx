import { useQuery, useQueryClient } from '@tanstack/react-query'
import { NextPage } from 'next'
import React from 'react'

type Opp = {
  name: string
  desc: string
  id: number
}

const getOpps = async () => {
  console.log('Fetching')
  try {
    const res = await fetch('http://localhost:8000/items', { mode: 'no-cors' })
    console.log('fetch', await res.json())
    return await res.json()
  } catch (e) {
    console.error(e)
    return []
  }
}

const Search: NextPage = () => {
  const [otherData, setData] = React.useState({})
  // const queryClient = useQueryClient()
  // const { isLoading, error, data } = useQuery<Opp[], Error>(['opps'], getOpps)
  // console.log('data', data)

  React.useEffect(() => {
    const f = async () => {
      const res = await fetch('http://localhost:8000/items')
      const data = await res.json()
      console.log('data', data)
      setData(data)
    }
    f()
  }, [])

  return (
    <>
      {/* {isLoading && <div>Loading...</div>}
      {error && <div>error</div>}
      {data?.map((opp) => (
        <div>{opp.name}</div>
      ))}
      <button
        onClick={() => queryClient.invalidateQueries()}
        className='bg-purple-500 rounded'
      >
        Re-Fetch
      </button> */}
      <pre>{JSON.stringify(otherData)}</pre>
      <p>asdf</p>
    </>
  )
}

export default Search
