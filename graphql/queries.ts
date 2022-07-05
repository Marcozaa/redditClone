import { gql } from "@apollo/client"

export const GET_ALL_POSTS = gql`
    query MyQuery {
        getPostList{
            body
            created_at
            id
            image
            title
            subreddit_id
            username
            comments {
                created_at
                id
                post_id
                text
                username
            }
            subreddit{
                created_at
                id
                topic
            }
            votes{
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`
export const GET_SUBREDDIT_BY_TOPIC = gql`
    query MyQuery($topic: String!) {
        getSubredditListByTopic(topic: $topic){
            id
            topic 
            created_at
        }
    }
`

export const GET_ALL_POSTS_BY_TOPIC = gql`
query MyQuery($topic: String!) {
        getPostUsingSubredditTopic(topic: $topic){
            body
            created_at
            id
            image
            title
            subreddit_id
            username
            comments {
                created_at
                id
                post_id
                text
                username
            }
            subreddit{
                created_at
                id
                topic
            }
            votes{
                created_at
                id
                post_id
                upvote
                username
            }
        }
    }
`

export const GET_POST_BY_ID = gql`
query MyQuery($id: ID!){
    getPost(id: $id){
        body
        title
        comments {
            created_at
            id
            post_id
            text
            username
        }
        created_at
        id
        image
        username
        subreddit {
            topic
        }
        votes {
            upvote
        }
    }
}
`

export const GET_VOTES_BY_POSTID = gql`
query MyQuery($post_id: ID!){
    getVotesByPostId(post_id: $post_id){
        username
        upvote
        created_at
    }
}

`