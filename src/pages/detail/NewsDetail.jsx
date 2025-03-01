import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const NewsDetail = () => {
    const { id } = useParams()

    const [post, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const FetchDataPosts = async () => {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
        const hasil = await response.json()
        setPosts(hasil)
        setIsLoading(false)
        return hasil
    }

    useEffect(() => {
        FetchDataPosts()
    })

    if (isLoading) {
        return <h1>Loading....... </h1>
    }

    return (
        <>
            <h1>{post.title}</h1>
        </>
    )
}

export default NewsDetail