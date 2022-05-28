import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react'

import TextField from '@mui/material/TextField'
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { useAuth } from '../../../../utils/useAuth'
import styles from '../../../../styles/scss/Child/QRCodeContainer.module.scss'
import { server } from '../../../../config/server'


const AcceptPage: NextPage = () => {
    const router = useRouter()
    const auth = useAuth()

    const [ name, setName ] = useState('')
    const [ age, setAge ] = useState(0)

    const [ loading, setLoading ] = useState(false)

    const [ error, setError ] = useState(false)

    const accept = async (e: any) => {
        e.preventDefault()
        setError(false)

        if(!name.length) {
            setError(true)
            return;
        }

        setLoading(true)
        const result = await axios.post(`${server}/api-hkt/add-child/create-child/${router.query.qr}`, { name, age }, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoading(false)
                                })
        
        if(result && result.message === 'Child added') {
            router.push('/')
            setLoading(false)
        } else {
            setLoading(false)
            setError(true)
        }
    } 

    
    const reject = async (e: any) => {
        e.preventDefault()

        setError(false)
        
        const result = await axios.post(`${server}/api-hkt/add-child/reject-child/${router.query.qr}`, {}, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                })
        
        if(result && result.message === 'Deleted request') {
            router.push('/')
        } else setError(true)
    } 


    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>Do you accept to track this person's movements and receive notifications about his status?</h2>
                <div className={styles.inputs}>
                    <TextField value={name} onChange={e => setName(e.target.value)} label={'Name'} variant='standard' />
                    <TextField value={age} onChange={e => setAge(parseInt(e.target.value))} label={'Age'} type='number' variant='standard' />
                </div>
                <div className={styles.buttons}>
                    {!loading ?
                    <>
                        <button onClick={e => accept(e)} style={{ borderColor: 'green', background: 'green', border: '1px solid green' }}>Accept</button>
                        <button onClick={e => reject(e)} style={{ borderColor: 'red', background: 'red', border: '1px solid red' }}>Reject</button>
                    </>
                    :
                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653636522/HACKATHON-FIICODE/Dual_Ring-1s-200px_vcmowa.svg' width={50} height={50} />
                    }
                </div>
                {error && <div style={{ color: 'red' }}>EROARE</div> }
            </div>
        </div>
    )
}

export default AcceptPage;

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const token = req.cookies['x-access-token']

    if(!token) {
        return {
            redirect: {
                destination: '/authentication/login',
                permanent: false
            },
            props: {}
        }
    }

    let redirect = false;

    const result = await axios.get(`${server}/api-hkt/miscellaneous/isAuthenticated`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            console.log(err)
                            redirect = true
                        })

    if(redirect || !result) {
        return {
            redirect: {
                permanent: false,
                destination: '/authentication/login'
            },
            props: {}
        }
    }

    let notFound = false
    const result2 = await axios.get(`${server}/api-hkt/add-child/qr-code-verify/${query.qr}`, { withCredentials: true, headers: { Cookie: req.headers.cookie || 'a' } })
                            .then(res => res.data)
                            .catch(err => {
                                if(err && err.response && err.response.data && err.response.data.message && err.response.data.message === 'Not found') {
                                    notFound = true
                                } else redirect = true
                            })

    if(notFound) {
        return {
            notFound: true,
            props: {}
        }
    }

    if(redirect) {
        return {
            redirect: {
                permanent: false,
                destination: '/authentication/login'
            },
            props: {}
        }
    } else return { props: {} }
}