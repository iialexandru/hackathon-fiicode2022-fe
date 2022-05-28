import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'

import { server, dev } from '../../../config/server'
import styles from '../../../styles/scss/Authentication/ForgotPassword.module.scss'
import useWindowSize from '../../../utils/useWindowSize'
import TextField from '../../../components/Authentication/TextField'


const ForgotPassword: NextPage = () => {
    const router = useRouter()

    const [ width ] = useWindowSize()

    const [ email, setEmail ] = useState('')   

    const [ infoPage, setInfoPage ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    

    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')

    const changePassword = async (e: any) => {
        e.preventDefault()

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        setError(email.length < 3 || !email.match(emailRegex))

        setErrorMessage(email.length < 3 ? 'Too short...' : (!email.match(emailRegex) ? 'Invalid email' : ''))

        if(email.length < 3 || !email.match(emailRegex)) return;

        setLoading(true)

        const result = await axios.post(`${server}/api-hkt/authentication/forgot-password`, { email }, { withCredentials: true })
                .then(res => res.data)
                .catch(err => {
                    setLoading(false)
                    setError(true)
                    if(err && err.response && err.response.data && err.response.data.message) {
                        setErrorMessage(err.response.data.message)
                    }
                })

        if(result && result.message === 'Sent email') {
            setInfoPage(true)
            setLoading(false)
        } else {
            setLoading(false)
            setError(true)
        }
    }

    return (
        <>
            <style jsx global>
                {`
                    body {
                        background: #DCDFFF;
                    }
                `}
            </style>
            <div style={{ position: 'relative' }}>
                <div className={styles.grid_container}>  

                    {!infoPage ?
                        <div className={styles.container}>
                            <h2>Forgot password</h2>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653600322/HACKATHON-FIICODE/undraw_forgot_password_re_hxwm_zr0w3f.svg' width={150} height={150} />
                            </div>

                            <div className={styles.fields_container}>
                                <TextField state={email} setState={setEmail} id={'femail'} name={'FEmail'} placeholder={'example@gmail.com'} error={error} setError={setError} errorMessages={errorMessage} setErrorMessages={setErrorMessage} />

                                <div className={styles.button}>
                                    {!loading ?
                                        <button onClick={e => changePassword(e)}>Send request</button>
                                    :
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653636501/HACKATHON-FIICODE/Dual_Ring-1s-200px_erjzyv.svg' width={50} height={50} />
                                    }
                                </div>
                            </div>

                            <div className={styles.links}>
                                <Link href='/authentication/login'>Remembered your password?</Link>
                            </div>

                        </div>
                    :
                        <div className={styles.container}>
                            <h2>Request received</h2>

                            <p className={styles.info_text}>
                                You have just received an email from us. Check the link inside it to change your password
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653636175/HACKATHON-FIICODE/undraw_message_sent_re_q2kl_wnemfw.svg' width={150} height={150} />
                            </div>

                            <div className={styles.fields_container}>

                                <div className={styles.button}>
                                    <button onClick={e => router.push('/authentication/login')}>Login</button>
                                </div>
                            </div>

                        </div>
                    }

                </div>
            </div>
        </>
    )
}

export default ForgotPassword;

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