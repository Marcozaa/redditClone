import Link from 'next/link'
import React from 'react'
import {  BiChevronUp } from 'react-icons/bi'
import Avatar from './Avatar'


type Props = {
    index: number,
    topic: string 
}
export default function SubredditRow({index, topic}: Props) {
  return (

    <div className='flex items-start justify-between p-2 space-x-2 border-t last:rounded-b'>
      <div className='flex items-center w-[40%] justify-evenly '>
        <BiChevronUp color='gray'/>
        <p>{index}</p>
        <Avatar seed={topic}/>
      </div>
      <div>
        <h1>r/{topic}</h1>
      </div>
      <div>
        <Link href={`/subreddit/${topic}`}>
          <div className='text-white px-3 cursor-pointer rounded-full bg-blue-600 flex items-center justify-center'>
            View
          </div>
        </Link>
      </div>
    </div>

  )
}
