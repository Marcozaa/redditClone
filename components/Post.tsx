import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { BsArrowDown, BsArrowUp, BsChat } from 'react-icons/bs'
import Avatar from './Avatar'
import TimeAgo from 'react-timeago'
import Link from 'next/link'
import {JellyTriangle} from '@uiball/loaders'
import { BiBookmark, BiDotsHorizontal, BiGift, BiShare } from 'react-icons/bi'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_VOTE } from '../graphql/mutations'
import { type } from 'os'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { GET_VOTES_BY_POSTID } from '../graphql/queries'
type Props = {
    post: Post
}

export default function Post({post}: Props) {
    const {data: session} = useSession()
    const {data, loading } = useQuery(GET_VOTES_BY_POSTID, {
        variables: {
            post_id: post?.id
        }
    })

    useEffect(() => {
        const votes: Vote[] = data?.getVotesByPostId

        // Loop through votes and check wheter the user
        // already voted.
        const vote = votes?.find(
            vote => vote.username === session?.user?.name
            )?.upvote

        setUserVote(vote)
    }, [data])

    console.log(data)
    const [addVote] = useMutation(ADD_VOTE, {
        refetchQueries: [GET_VOTES_BY_POSTID, 'getVotesByPostId']
    })
    const [userVote, setUserVote] = useState<boolean>()

    const displayVotes = (data:any) => {
        const votes: Vote[] = data?.getVotesByPostId
        const displayNumber = votes?.reduce(
            (total,vote) => (vote.upvote ? (total += 1) : (total-=1)),
            0
        )

        if(votes?.length === 0) return 0

        if(displayNumber === 0){
            return votes[0]?.upvote ? 1 : -1
        }

        return displayNumber
    }

    if(!post) return(
        <div className='flex w-full items-center justify-center p-10'>
            <JellyTriangle size={50} color={'#ff4501'}/>
        </div>
    )

    


    // Should make a query 
    // Count(upvotes)
    // count(downvotes)
    // Upvotes - downvotes is the votes total

    async function sendVote(voteType: boolean){
        if(!session){
            toast("You need to sign in to vote!")
        }else{
        const vote = await addVote({
            variables: {
                post_id: post.id,
                upvote: voteType,
                username: session?.user?.name
            }
        })
        }
    }
  return (
    <Link href={`/post/${post.id}`}>
        <div className='flex cursor-pointer rounded-md border-gray-300
        bg-white shadow-sm hover:border hover:border-gray-600'>
            {/** votes */}
            <div className='flex flex-col items-center 
            justify-start space-y-1 rounded-l-md bg-gray-50 p-4 text-gray-400'>
                <BsArrowUp 
                onClick={()=>sendVote(true)} 
                className={`voteButtons hover:text-red-400 
                ${userVote && 'text-red-400'}`} />
                <p 
                className='text-xs font-bold text-black'>
                    {displayVotes(data)}
                </p>
                <BsArrowDown 
                onClick={()=>sendVote(false)} 
                className={`voteButtons hover:text-blue-400
                ${userVote === false && 'text-blue-400'}
                `}/>
            </div>

            {/** header */}
            <div className='p-3 pb-1 '>
                <div className='flex items-center space-x-2'>
                    {post.subreddit && (
                    <Avatar seed={post.subreddit?.topic} />
                    )}
                    <p className='text-xs text-gray-400'>
                        <Link href={`/subreddit/${post.subreddit?.topic}`}>
                        <span
                        className='font-bold text-black hover:text-blue-400'
                        >r/{post.subreddit.topic}
                        </span> 
                        </Link>
                        &nbsp; 
                        • posted by u/{post.username}
                        &nbsp; 
                    <TimeAgo date={post.created_at} />
                    </p>
                </div>
          

            {/** body */}
            <div className='py-4'>
                <h2 className='text-xl font-semibold'>{post.title}</h2>
                <p className='text-cm mt-2 font-light'>{post.body}</p>
            </div>

            <img 
            className='w-full max-w-md'
            src={post.image} />


            <div className='flex space-x-4 text-gray-400'>
                <div className='postButtons'>
                    <BsChat className='h-6 w-6'/>
                    <p className=''>{post.comments.length} Comments</p>
                </div>
                <div className='postButtons'>
                    <BiGift className='h-6 w-6'/>
                    <p className='hidden sm:inline'>Award</p>
                </div>
                <div className='postButtons'>
                    <BiShare className='h-6 w-6'/>
                    <p className='hidden sm:inline'>Share</p>
                </div>
                <div className='postButtons'>
                    <BiBookmark className='h-6 w-6'/>
                    <p className='hidden sm:inline'>Save</p>
                </div>
                <div className='postButtons'>
                    <BiDotsHorizontal className='h-6 w-6'/>
                </div>

            </div>
        </div>
    </div>
    </Link>
  )
}
