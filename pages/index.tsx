import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Feed from '../components/Feed'
import Header from '../components/Header'
import PostBox from '../components/PostBox'
import TopCommunities from '../components/TopCommunities'

const Home: NextPage = () => {
  return (
    <div className="my-7 max-w-5xl mx-auto">
      <Head>
        <title>Reddit 2.0</title>
        <link rel="icon" href="https://bam-outfitters.com/wp-content/uploads/2018/07/Reddit-logo.png" />
      </Head>

      {/**create Post form */}
      <PostBox />

      <div className='flex '>
        {/** FEED */}
        <Feed />
        <div className='min-w-[300px] mx-5 mt-5 hidden h-fit rounded-md border border-gray-300 bg-white lg:inline sticky top-36 z-50'>
        <TopCommunities />
        </div>

      </div>
     
    </div>
  )
}

export default Home
