import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from '../../../styles/scss/Authentication/Register.module.scss'
import TextField from '../../../components/Authentication/TextField'
import { server, dev } from '../../../config/server'
import NoSSR from '../../../utils/NoSSR'
import useWindowSize from '../../../utils/useWindowSize'
import Code from '../../../components/Authentication/Registration/Code'


const Register: NextPage = () => {
    const router = useRouter()

    const [ width ] = useWindowSize()
    const [ codeStatus, setCodeStatus ] = useState(false)

    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ username, setUsername ] = useState('')

    const [ loading, setLoading ] = useState(false)

    const [ error, setError ] = useState({ email: false, password: false, username: false })
    const [ errorMessages, setErrorMessages ] = useState({ email: '', password: '', username: '' })
    const [ fullError, setFullError ] = useState(false)

    const onClickRegister = async (e: any) => {
        e.preventDefault()

        setFullError(false)
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        const usernameRegex = /^[A-Za-z]\w*$/

        setError({
            ...error,
            email: email.length < 3 || !email.match(emailRegex),
            password: password.length < 8,
            username: username.length < 3 || !username.match(usernameRegex)
        })

        setErrorMessages({
            ...errorMessages,
            email: email.length < 3 ? 'Too short... (3chr)' : (!email.match(emailRegex) ? 'Invalid email' : ''),
            password: password.length < 8 ? 'Too short... (8chr)' : '',
            username: username.length < 3 ? 'Too short... (3chr)' : (!username.match(usernameRegex) ? 'Invalid username' : '')
        })

        if(email.length < 3 || !email.match(emailRegex) || password.length < 8 || username.length < 3 || !username.match(usernameRegex)) {
            return;
        }

        setLoading(true)

        const user = { email, password, username }
        const result = await axios.post(`${server}/api-hkt/authentication/register`, user, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    if(err && err.response && err.response.data.type && err.response.data.type === 'email') {
                                        setError({ ...error, email: true })
                                        setErrorMessages({
                                            ...errorMessages,
                                            email: err.response.data.message
                                        })
                                    } else if(err && err.response && err.response.data.type && err.response.data.type === 'username') {
                                        setError({ ...error, username: true })
                                        setErrorMessages({
                                            ...errorMessages,
                                            username: 'Username already taken'
                                        })
                                    } else if(err && err.response && err.response.data.type && err.response.data.type === 'all') {
                                        setError({ ...error, email: true, password: true })
                                        setErrorMessages({
                                            ...errorMessages,
                                            email: '',
                                            password: err.response.data.message
                                        })
                                    } else setFullError(true)
                                    setLoading(false)
                                })
        if(result && result.message) {
            Cookies.set('values-id', result.token, { expires: (1 * 1440) * 15, sameSite: dev ? 'lax' : 'none', secure: !dev })
            setCodeStatus(true)
            setLoading(false)
        } else {
            setFullError(true)
            setLoading(false)
        }
    }


    return (
        <NoSSR fallback={<div style={{ height: '100vh' }}></div>}>
            <style jsx global>
                {`
                    body {
                        background: #DCDFFF;
                    }
                `}
            </style>
            {!codeStatus ?
                    <div style={{ position: 'relative' }}>
                        <div className={styles.grid_container}>  
                            {width >= 830 &&
                                <div className={styles.container_image}>
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653596871/HACKATHON-FIICODE/undraw_details_8k13_lfly8f.svg' width={300} height={300} />
                                </div>
                            }

                            <div className={styles.container}>
                                <h2>Register</h2>

                                {(width < 830) && 
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653596871/HACKATHON-FIICODE/undraw_details_8k13_lfly8f.svg' width={100} height={100} />
                                    </div>
                                }

                                <div className={styles.fields_container}>
                                    <TextField state={username} setState={setUsername} id={'username'} name={'Username'} placeholder={'ABCD'} error={error} setError={setError} errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
                                    <TextField state={email} setState={setEmail} id={'email'} name={'Email'} placeholder={'example@gmail.com'} error={error} setError={setError} errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
                                    <TextField state={password} setState={setPassword} id={'password'} name={'Password'} placeholder={'abc123...'} error={error} setError={setError} errorMessages={errorMessages} setErrorMessages={setErrorMessages} />

                                    <div className={styles.button}>
                                        {!loading ?
                                            <button onClick={e => onClickRegister(e)}>Create an account</button>
                                        :
                                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653636501/HACKATHON-FIICODE/Dual_Ring-1s-200px_erjzyv.svg' width={50} height={50} />
                                        }
                                    </div>
                                </div>

                                <div className={styles.links}>
                                    <Link href='/authentication/forgot-password'>Forgot password?</Link>
                                    <Link href='/authentication/login'>Already have an account?</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                :
                    <Code />
                }
        </NoSSR>
    )
}

export default Register;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const token = req.cookies['x-access-token']

    if(!token) {
        return { props: {} }
    } else {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {}
        }
    }
}