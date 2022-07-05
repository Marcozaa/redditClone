
import React from 'react'
import Image from 'next/image'
import {AiFillHome, AiOutlinePlus,AiOutlineVideoCamera,AiOutlineMenu} from 'react-icons/ai'
import {BiChevronDown, BiSearch} from 'react-icons/bi'
import {BiWorld} from 'react-icons/bi'
import {HiOutlineSparkles} from 'react-icons/hi'
import {FaRegBell} from 'react-icons/fa'
import {BsChatDots} from 'react-icons/bs'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
export default function Header() {
    const { data: session } = useSession()
  return (
    <div className='sticky top-0 flex bg-white px-4 py-2 shadow-sm'>
        <div className='relative h-10 w-20 flex-shrink-0 cursor-pointer'>
            <Image 
            objectFit='contain'
            layout="fill"
            src="https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Reddit_logo_new.svg/2560px-Reddit_logo_new.svg.png"
            />
        </div>

        <div className='mx-7 flex items-center xl:min-w-[300px]'>
            <AiFillHome className='h-5 w-5' />
            <p className='flex-1 ml-2 lg:inline hidden'>Home</p>
            <BiChevronDown className='h-5 w-5' />
        </div>

        <form className='flex flex-1 items-center space-x-2 
        rounded-sm border border-gray-200 bg-gray-100 px-3 py-1'>
            <BiSearch className='h-6 w-6 text-gray-400'/>
            <input className='flex-1 bg-transparent outline-none' type="text" placeholder='Search reddit' />
            <button type='submit' hidden />
        </form>


        <div className='flex items-center space-x-2 
        text-gray-500 hidden lg:inline-flex'>
            <BiWorld className='h-7 2-6 lg:w-9 cursor-pointer rounded-sm lg:p-1 
        lg:hover:bg-gray-100'/>
            <AiOutlineVideoCamera className='h-7 2-6 lg:w-9 cursor-pointer rounded-sm lg:p-1 
        lg:hover:bg-gray-100'/>
            <HiOutlineSparkles className='h-7 2-6 lg:w-9 cursor-pointer rounded-sm lg:p-1 
        lg:hover:bg-gray-100'/>
            <hr className='h-10 border border-gray-100' />
            <AiOutlinePlus className='h-7 2-6 lg:w-9 cursor-pointer rounded-sm lg:p-1 
        lg:hover:bg-gray-100'/>
            <BsChatDots className='h-7 2-6 lg:w-9 cursor-pointer rounded-sm lg:p-1 
        lg:hover:bg-gray-100'/>
            <FaRegBell className='h-7 2-6 lg:w-9 cursor-pointer rounded-sm lg:p-1 
        lg:hover:bg-gray-100'/>
        </div>
        <div className='ml-5 flex items-center lg:hidden'>
            <AiOutlineMenu className='h-7 2-6 lg:w-9 cursor-pointer rounded-sm lg:p-1 
        lg:hover:bg-gray-100'/>
        </div>

        {session ? (
        <div 
        onClick={() => signOut()}
        className='hidden lg:flex space-x-2 items-center border-gray-100 p-2 cursor-pointer'>
            <div className='relative h-5 w-5 flex-shrink-0'>
                <Image 
                objectFit='contain'
                src='https://cdn-icons-png.flaticon.com/512/52/52053.png'
                alt='' 
                layout='fill'
                />
            </div>
            <div className='flex-1 text-xs'>
                <p className='truncate'>{session?.user?.name}</p>
                <p className='text-gray-400'>1 Karma</p>
            </div>

            <BiChevronDown />
        </div>
        ):
        (
        <div 
        onClick={() => signIn()}
        className='hidden lg:flex space-x-2 items-center border-gray-100 p-2 cursor-pointer'>
            <div className='relative h-5 w-5 flex-shrink-0'>
                <Image 
                objectFit='contain'
                src='https://cdn-icons-png.flaticon.com/512/52/52053.png'
                alt='' 
                layout='fill'
                />
            </div>
            <p className='text-gray-400'>Sign In</p>
        </div>
        )}
        
    </div>
  )
}
