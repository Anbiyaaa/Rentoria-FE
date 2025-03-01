import React, { useEffect, useState } from 'react'
import { AxiosInstance } from '../axiosInstance/axios'
import { Link } from 'react-router-dom'

const Users = () => {
    const [users, setUsers] = useState([])

    const FetchDataUsers = async () => {
        const response = await AxiosInstance.get('/users')
        const {data : result} = response
        setUsers(result)
        return result
    }

    useEffect(() => {
        FetchDataUsers()
    })

  return (
     <>
            <div className='mx-5'>
                <h1 className=''>Daftar User</h1>
                <ul className='mt-3 flex flex-col gap-3'>
                    {users.map((list, index) => (
                       
                            <Link key={index} to={`/user/${list.id}`} className='border-2'>
                                <li key={index}>{list.name}</li>
                                <li>{list.email}</li>
                                <li>{list.company.name}</li>
                            </Link>
                        
                    ))}
                </ul>
            </div>
        </>
  )
}

export default Users