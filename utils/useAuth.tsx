import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { server } from '../config/server'

interface User {
    userId?: string;
    setUser?: any;
    id?: string;
    isLoggedIn?: boolean;
}


const AuthContext = React.createContext<any>({})

export function AuthProvider(props: any) {
    const [ user, setUser ] = useState<User>({ isLoggedIn: false, userId: '' })


    useEffect(() => {
        const source = axios.CancelToken.source()

        const login = async () => {
            const response = await axios.get(`${server}/api-hkt/miscellaneous/isAuthenticated`, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => err.response)    
            if(response){
                setUser({ isLoggedIn: response.isLoggedIn, userId: response.userId })
            }
        }

        login()

        return () => {
            source.cancel()
        }
    }, [])

    const isLoggedIn = user.isLoggedIn
    const id = user.userId
    const value: User = {id, isLoggedIn, setUser}
    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth(): User {
    return useContext<User>(AuthContext)
}