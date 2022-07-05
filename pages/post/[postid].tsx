import { useMutation, useQuery } from '@apollo/client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React from 'react'
import Post from '../../components/Post'
import { ADD_COMMENT } from '../../graphql/mutations'
import { GET_POST_BY_ID } from '../../graphql/queries'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Avatar from '../../components/Avatar'
import ReactTimeago from 'react-timeago'
type FormData = {
    commentBody: string
}
export default function PostPage() {
    const { 
        register, 
        setValue,
        handleSubmit, 
        watch, 
        formState: { errors } } 
    = useForm<FormData>();

    const router = useRouter()
    const {data: session} = useSession()
    const {loading, error, data } = useQuery(GET_POST_BY_ID, {
        variables: {
            id: router.query.postid
        }    
    })
    const [addComment] = useMutation(ADD_COMMENT, {
        refetchQueries: [GET_POST_BY_ID, 'getPost'],
    })


    const post: Post = data?.getPost


    console.log(post)
    const onSubmit = handleSubmit(async (formData) => {
        const notification = toast.loading('Creating new comment...')
        try{
        const {data: {insertComment: newComment}} = await addComment({
            variables: {
                post_id: router.query.postid,
                text: formData.commentBody,
                username: session?.user?.name
            }
        })


        toast.success("Comment created.", {
            id: notification
        })
        setValue("commentBody", '')
        }catch(error){

        toast.error("Oops. Something went wrong,", {
            id: notification
        })

        }
    })

  return (
    <div className='mx-auto my-7 max-w-5xl'>
        <div>
        <Post post={post} />
        </div>
        <div className='  rounded-b-md border border-t-0 border gray-300 bg-white p-5 pl-16'>
            <p className='text-sm'>
                Comment as &nbsp;
                <span className='text-red-500'>{session?.user?.name}</span>
            </p>

            <form onSubmit={onSubmit} className='flex flex-col items-center'>
                <div className='flex items-start w-full'><textarea className='h-24 rounded-md border border-gray-200 p-2
                pl-4 outline-none disabled:bg-gray-50 w-[90%] resize-none'
                placeholder={
                    session ? "What are your thoughts?" : "You need to sign in to comment"
                }
                {...register('commentBody')}
                /></div>
                <button 
                disabled={
                    session ? false : true
                }
                className={`bg-orange-500 
                text-white mt-5 w-[50%] 
                rounded-md h-10
                `}>Comment</button>
            </form>
        </div>

        <div className='-my-5 rounded-b-md border-t-0 border-gray-300
        bg-white py-5 px-10'>
            <hr className='py-2'/>

            {post?.comments.map(comment =>(
                <div 
                className='relative flex items-center space-x-2 space-y-5' 
                key={comment.id}
                >
                    <hr className='absolute top-10 h-16 border bg-slate-400 left-7 z-0 ' />

                    <div className='z-50'>
                        <Avatar seed={comment.username} user />
                        <p></p>
                    </div>

                    <div className='flex flex-col'>
                        <p className='py-2 text-xs text-gray-400'>
                            <span className='font-semibold text-gray-600'>{comment.username}</span>
                            &nbsp; <ReactTimeago date={comment.created_at} />
                        </p>
                        <p>
                            {comment.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}
