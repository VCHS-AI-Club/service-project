import { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { DateTimePicker } from '@mui/x-date-pickers'
import {
  Button,
  TextField,
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import moment, { Moment } from 'moment'
import { Loader } from '@googlemaps/js-api-loader'
import { env } from '../../env/client.mjs'
import { LocationAutocomplete } from '../../components/LocationAutocomplete'

type FormData = {
  name: string
  desc: string
  isChurch: boolean
  contact: string
  website: string

  start: Moment
  end: Moment
}
type Opp = {
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

const Create: NextPage = () => {
  const { status } = useSession()
  const router = useRouter()
  if (status === 'unauthenticated') {
    router.push('/')
  }

  const { register, handleSubmit, control }: any = useForm<FormData>()

  const [loc, setLoc] = useState<{ lat: number; lon: number }>({
    lat: 0,
    lon: 0,
  })

  const [maps, setMaps] = useState<typeof google.maps | null>(null)
  const { mutate } = useMutation(async (newOpp: Opp) => {
    console.log(JSON.stringify(newOpp))
    return await fetch(env.NEXT_PUBLIC_API_URL + '/opp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOpp),
    })
  })

  const onSubmit = (data: FormData) => {
    mutate({ ...data, start: data.start.unix(), end: data.end.unix(), ...loc })
  }

  useEffect(() => {
    const loader = new Loader({
      apiKey: env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places'],
    })
    loader.load().then(() => {
      setMaps(window.google.maps)
    })
  })

  return (
    <>
      <div>
        <h1 className='text-center text-5xl font-extrabold leading-normal text-purple-700 md:text-[5rem]'>
          Create a Service Opportunity
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col content-center items-center gap-4 py-8 px-96'>
            <div className='flex flex-row justify-between gap-4'>
              <TextField label='name' {...register('name')} className='block' />
              <TextField
                label='contact'
                {...register('contact')}
                className='block'
              />
              <TextField
                label='website'
                {...register('website')}
                className='block'
              />
            </div>
            <TextField
              label='description'
              {...register('desc')}
              className='block'
              multiline
              fullWidth
            />
            <div className='flex flex-row justify-between gap-4'>
              <Controller
                name='start'
                control={control}
                defaultValue={moment()}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        className='block'
                        label='start time'
                      />
                    )}
                  />
                )}
              />
              <Controller
                name='end'
                control={control}
                defaultValue={moment()}
                render={({ field }) => (
                  <DateTimePicker
                    {...field}
                    renderInput={(props) => (
                      <TextField
                        {...props}
                        className='block'
                        label='end time'
                      />
                    )}
                  />
                )}
              />
            </div>
            {maps && <LocationAutocomplete maps={maps} setLoc={setLoc} />}{' '}
            <FormControlLabel
              label='Church hours'
              control={<MuiCheckbox {...register('isChurch')} defaultChecked />}
            />
            <Button
              className='bg-blue-500'
              type='submit'
              color='primary'
              variant='contained'
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Create
