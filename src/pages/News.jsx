import React, { use, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AxiosInstance } from '../axiosInstance/axios'

const News = () => {

    const [post, setPost] = useState([])

    const FetchDataPosts = async () => {
        const response = await AxiosInstance.get('/posts')
        const {data : result} = response
        setPost(result)
        return result
    }

    useEffect(() => {
        FetchDataPosts()
    })

    return (
        <>
            <div className='mx-5'>
                <h1 className=''>Berita terbaru kami</h1>
                <ul className='mt-3 flex flex-col gap-3'>
                    {post.map((list, index) => (
                       
                            <Link key={index} to={`/news/${list.id}`} className='border-2'>
                                <li key={index}>{list.title}</li>
                                <li>{list.body}</li>
                            </Link>
                        
                    ))}
                </ul>
            </div>
        </>
    )
}

export default News