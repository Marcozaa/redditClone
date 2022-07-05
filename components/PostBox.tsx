import { useSession } from 'next-auth/react'
import React from 'react'
import Avatar from './Avatar'
import { FaLink } from 'react-icons/fa'
import { HiPhotograph } from 'react-icons/hi'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { ADD_POST, ADD_SUBREDDIT } from '../graphql/mutations'
import client from '../apollo-client'
import { GET_ALL_POSTS, GET_SUBREDDIT_BY_TOPIC } from '../graphql/queries'
import { storeValueIsStoreObject } from '@apollo/client/cache/inmemory/helpers'
import toast from 'react-hot-toast'
type FormData = {
    postTitle: string
    postBody: string
    postImage: string
    subreddit: string
}

type Props = {
    subreddit?: string // Optional value
}

export default function PostBox({subreddit}: Props) {
    const {data: session} = useSession()
    const [addPost] = useMutation(ADD_POST, {
        refetchQueries: [
            GET_ALL_POSTS,
            'getPostList'
        ],
    })
    const [addSubreddit] = useMutation(ADD_SUBREDDIT)
    const [imageBoxOpen, setImageBoxOpen] = useState<boolean>(false)

    const { 
        register, 
        setValue,
        handleSubmit, 
        watch, 
        formState: { errors } } 
    = useForm<FormData>();

    const onSubmit = handleSubmit(async (formData) => {
        const notification = toast.loading('Creating new post...')
        try{
            // Query subreddits by topic
            const subredditsList = await client.query({
                query: GET_SUBREDDIT_BY_TOPIC,
                variables: {
                    topic: subreddit || formData.subreddit
                }
            })
            

            const subredditExists = subredditsList.data.getSubredditListByTopic.length > 0
            
            if(!subredditExists){
                // Create subreddit
                const {data: {insertSubreddit: newSubreddit}} = await addSubreddit({
                    variables: {
                        topic: formData.subreddit
                    }
                })
            
                const image = formData.postImage || ''

                const {
                    data: {insertPost: newPost}, 
                } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: newSubreddit.id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })
            }else{
                // Use existing subreddit
                const image = formData.postImage || ''

                const {
                    data: {insertPost: newPost}, 
                } = await addPost({
                    variables: {
                        body: formData.postBody,
                        image: image,
                        subreddit_id: subredditsList.data.getSubredditListByTopic[0].id,
                        title: formData.postTitle,
                        username: session?.user?.name
                    }
                })
            }

            // reset form value
            setValue('postBody', '')
            setValue('postImage', '')
            setValue('subreddit', '')
            setValue('postTitle', '')

            toast.success('New post created!', {
                id: notification
            })
        }catch(error){
            console.log(error)
            toast.error("Something went wrong", {
                id: notification
            })
        }
    })

  return (
    <form onSubmit={onSubmit} className='sticky top-20 z-50 p-2
    bg-white border rounded-md border-gray-300'>
        <div className='flex items-center space-x-3'>
            <Avatar user={true}/>

            <input 
            {...register('postTitle', {required: true})}
            disabled={!session}
            className='flex-1 rounded-md bg-gray-50 p-2 pl-5 outline-none'
            type={'text'} 
            placeholder={
                session ? subreddit ? `Create a post in r/${subreddit}` : 'Create a post!'
            : "You need to sign in to post."} />

            <HiPhotograph 
            onClick={()=> setImageBoxOpen(!imageBoxOpen)}
            className={`h-6 text-gray-300 cursor-pointer ${imageBoxOpen && 'text-blue-300'}`} />
            <FaLink className='h-6 text-gray-300' />
        </div>

        {/*When writing post title, pop up the following*/}
        {!!watch('postTitle') && (
            <div className='flex flex-col py-2'>
                <div className='flex items-center px-2'>
                    <p className='min-w-[90px]'>Body</p>
                    <input 
                    className='m-2 flex-1 bg-blue p-2 outline-none'
                    {...register('postBody')}
                    type={'text'} 
                    placeholder='Text (optional)'/>
                </div>

                {!subreddit && (
                    <div className='flex items-center px-2'>
                        <p className='min-w-[90px]'>Subreddit</p>
                        <input 
                        className='m-2 flex-1 bg-blue p-2 outline-none'
                        {...register('subreddit', {required: true})}
                        type={'text'} 
                        placeholder='i.e. r/AskReddit'/>
                    </div>
                )}
                

                {imageBoxOpen && (
                    <div className='flex items-center px-2'>
                    <p className='min-w-[90px]'>Image URL</p>
                    <input 
                    className='m-2 flex-1 bg-blue p-2 outline-none'
                    {...register('postImage')}
                    type={'text'} 
                    placeholder='Optional...'/>
                    </div>
                    )
                }

                {/** Error handling */}
                {Object.keys(errors).length > 0 && (
                    <div className='space-y-2 p-2 text-red-500'>
                        {errors.postTitle?.type === 'required' &&(
                            <p>A post title is required</p>
                        )}

                        {errors.subreddit?.type === 'required' &&(
                            <p>A subreddit is required</p>
                        )}
                    </div>
                )}

            {!!watch('postTitle') &&
                <button className='w-full rounded-full bg-blue-400 p-2 text-white'>
                    Create post
                </button>
            }

            </div>
        )}
    </form>
  )
}
