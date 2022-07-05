import React from 'react'
import SubredditRow from './SubredditRow'

export default function TopCommunities() {
  return (
    <div>
        <div className='p-2'>
            <h1>Top communities</h1>
        </div>
        <div>
            <SubredditRow index={1} topic={'FoodPorn'} />
            <SubredditRow index={2} topic={'news'} />
            <SubredditRow index={3} topic={'landscapes'} />
            <SubredditRow index={4} topic={'movies'} />
            <SubredditRow index={5} topic={'books'} />
            <SubredditRow index={6} topic={'cs'} />


        </div>
    </div>
  )
}
