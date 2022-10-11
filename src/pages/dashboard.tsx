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

export const DashboardPage: NextPage = () => {

  return <div />
  
}

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
