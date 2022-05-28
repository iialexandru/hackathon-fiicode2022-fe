import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { server, dev } from '../../../../config/server'
import styles from '../../../../styles/scss/Authentication/ForgotPassword.module.scss'
import useWindowSize from '../../../../utils/useWindowSize'
import TextField from '../../../../components/Authentication/TextField'


const ChangePassword: NextPage = () => {
    const router = useRouter()

    const [ width ] = useWindowSize()

    const [ newPassword, setNewPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
   
    const [ infoPage, setInfoPage ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    

    const [ error, setError ] = useState({ newPassword: false, confirmNewPassword: false })
    const [ errorMessages, setErrorMessages ] = useState({ newPassword: '', confirmNewPassword: ''})

    const changePassword = async (e: any) => {
        e.preventDefault()

        setError({
            newPassword: newPassword.length < 8 || newPassword.length > 18 || newPassword !== confirmPassword,
            confirmNewPassword: confirmPassword.length < 8 || confirmPassword.length > 18 || newPassword !== confirmPassword,
        })

        setErrorMessages({
            newPassword: newPassword.length < 8 ? 'Too short... (8chr)' : (newPassword.length > 18 ? 'Too long... (18chr)' : ''),
            confirmNewPassword: confirmPassword.length < 8 ? 'Too short... (8chr)' : (confirmPassword.length > 18 ? 'Too long... (18chr)' : (newPassword !== confirmPassword ? 'Passwords do not match' : '')) ,
        })

        if(newPassword.length < 8 || newPassword.length > 18 || newPassword !== confirmPassword || confirmPassword.length < 8 || confirmPassword.length > 18) {
            return;
        }

        setLoading(true)

        const password = newPassword
        const confirmedPassword = confirmPassword
        const result = await axios.post(`${server}/api-hkt/authentication/forgot-password/change-password/${router.query.token}`, { password, confirmedPassword }, { withCredentials: true })
                .then(res => res.data)
                .catch(err => {
                    setLoading(false)
                })
        if(result && result.message === 'Changed password') {
            setInfoPage(true)
            setLoading(false)
        } else {
            setLoading(false)
            setError({ newPassword: true, confirmNewPassword: true })
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
                            <h2>Change password</h2>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653600322/HACKATHON-FIICODE/undraw_forgot_password_re_hxwm_zr0w3f.svg' width={150} height={150} />
                            </div>

                            <div className={styles.fields_container}>
                                <TextField state={newPassword} setState={setNewPassword} id={'newPassword'} name={'NewPassword'} placeholder={'XYZ987...'} error={error} setError={setError} errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
                                <TextField state={confirmPassword} setState={setConfirmPassword} id={'confirmPassword'} name={'ConfirmPassword'} placeholder={'XYZ987...'} error={error} setError={setError} errorMessages={errorMessages} setErrorMessages={setErrorMessages} />
                                

                                <div className={styles.button}>
                                    {!loading ?
                                        <button onClick={e => changePassword(e)}>Change</button>
                                    :
                                        <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653636501/HACKATHON-FIICODE/Dual_Ring-1s-200px_erjzyv.svg' width={50} height={50} />
                                    }
                                </div>
                            </div>

                        </div>
                    :
                        <div className={styles.container}>
                            <h2>Password Changed</h2>

                            <p className={styles.info_text}>
                                You have just changed your password. Press the button below to go back to the login page
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653636144/HACKATHON-FIICODE/undraw_done_re_oak4_gbowjv.svg' width={150} height={150} />
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

export default ChangePassword;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const { req } = ctx
    const token = req.cookies['x-access-token']

    if(token) {   
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {}
        }
    }

    const result = await axios.get(`${server}/api-hkt/authentication/forgot-password/change-password/verify/${ctx.query.token}`)
                         .then(res => res.data)
                         .catch(err => console.log(err))

    if(result && result.message === 'Found request') {
        return { props: {} }
    } else {
        return {
            notFound: true
        }
    }


}