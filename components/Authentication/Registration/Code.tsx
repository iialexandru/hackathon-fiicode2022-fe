import type { FC, Dispatch, SetStateAction } from 'react'
import { useState } from 'react';
import axios from 'axios'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Cookies from 'js-cookie'

import { server, dev } from '../../../config/server'
import styles from '../../../styles/scss/Authentication/Code.module.scss'
import useWindowSize from '../../../utils/useWindowSize'
import TextField from '../TextField'

const Code: FC = () => {
    const router = useRouter()

    const [ width ] = useWindowSize()

    const [ code, setCode ] = useState('')
    const [ error, setError ] = useState(false)
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ loading, setLoading ] = useState(false)
    

    const submitCode = async (e: any) => {
        e.preventDefault()

        setLoading(true)
        const codeValue = code

        setErrorMessage(code.length !== 6 ? 'Too shor (6 digits code)' : '')

        if(code.length !== 6) {
            setError(true)
            setLoading(false)
            return;
        }

        const result = await axios.post(`${server}/api-hkt/authentication/register/code`, { codeValue }, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => {
                            setError(true)
                            if(err && err.response && err.response.data && err.response.data.message) {
                                setErrorMessage(err.response.data.message)
                            }
                        })
        
        if(result && result.message === 'User created') {
            Cookies.remove('values-id')
            Cookies.set('x-access-token', result.token, { expires: 30, sameSite: dev ? 'lax' : 'none', secure: !dev })
            router.reload()
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
                    <div className={styles.container}>
                        <h2>Enter code</h2>

                        <div className={styles.info_text}>
                            <p>You have just received an email. Please verify it and enter the code within it below</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <Image src='https://res.cloudinary.com/multimediarog/image/upload/v1653599598/HACKATHON-FIICODE/undraw_personal_email_re_4lx7_qbdtvg.svg' width={200} height={200} />
                        </div>

                        <div className={styles.fields_container}>
                            <TextField state={code} setState={setCode} id={'code'} name={'Code'} placeholder={'374081'} error={error} setError={setError} errorMessages={errorMessage} setErrorMessages={setErrorMessage} />
                            

                            <div className={styles.button}>
                                <button onClick={e => submitCode(e)}>Send</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Code;