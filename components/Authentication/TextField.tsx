import type { FC, Dispatch, SetStateAction } from 'react';
import { useState } from 'react'

import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';

import styles from '../../styles/scss/Authentication/TextField.module.scss'


interface TextFieldProps {
    state: string;
    setState: Dispatch<SetStateAction<string>>
    id: string;
    name: string;
    placeholder: string;
    setError: any;
    error: any;
    setErrorMessages: any;
    errorMessages: any;
}

const TextField: FC<TextFieldProps> = ({ state, setState, id, name, placeholder, error, setError, setErrorMessages, errorMessages }) => {
    const [ show, setShow ] = useState(false)

    const fixError = () => {
        if(errorMessages.password === 'Email/password is incorrect') {
            setErrorMessages({ ...errorMessages, password: '', email: '' })
            setError({ ...error, email: false, password: false })
            return;
        }
        switch (name) {
            case 'Email':
                setError({ ...error, email: false })
                setErrorMessages({ ...errorMessages, email: '' })
                return;
            case 'Password':
                setError({ ...error, password: false })
                setErrorMessages({ ...errorMessages, password: '' })
                return;
            case 'Username':
                setError({ ...error, username: false })
                setErrorMessages({ ...errorMessages, username: '' })
                return;
            case 'Code':
                setError(false)
                setErrorMessages('')
                return;
            case 'NewPassword': 
                setError({ ...error, newPassword: false })
                setErrorMessages({ ...errorMessages, newPassword: '' })
                return;
            case 'ConfirmPassword': 
                setError({ ...error, confirmPassword: false })
                setErrorMessages({ ...errorMessages, confirmPassword: '' })
                return;
            case 'FEmail':
                setError(false)
                setErrorMessages('')
                return;
        }
    }

    const chooseError = () => {
        switch (name) {
            case 'Email':
                return error.email
            case 'Password':
                return error.password
            case 'Username':
                return error.username
            case 'Code':
                return error
            case 'NewPassword':
                return error.newPassword   
            case 'ConfirmPassword':
                return error.confirmPassword
            case 'FEmail':
                return error
            default: 
                return false
        }
    }

    const chooseErrorMessage = () => {
        switch (name) {
            case 'Email':
                return errorMessages.email
            case 'Password':
                return errorMessages.password
            case 'Username':
                return errorMessages.username
            case 'Code':
                return errorMessages
            case 'NewPassword':
                return errorMessages.newPassword
            case 'ConfirmPassword':
                return errorMessages.confirmPassword
            case 'FEmail':
                return errorMessages
            default: 
                return false
        }
    }

    const chooseIcon = () => {
        switch (name) {
            case 'Email':
                return <EmailOutlinedIcon />
            case 'Password':
                return (
                    <>
                        {!show ?
                            <LockOutlinedIcon style={{ cursor: 'pointer' }} onClick={() => setShow(true)} />
                        :
                            <LockOpenOutlinedIcon style={{ cursor: 'pointer' }} onClick={() => setShow(false)} />
                        }
                    </>
                )
            case 'NewPassword':
                return (
                    <>
                        {!show ?
                            <LockOutlinedIcon style={{ cursor: 'pointer' }} onClick={() => setShow(true)} />
                        :
                            <LockOpenOutlinedIcon style={{ cursor: 'pointer' }} onClick={() => setShow(false)} />
                        }
                    </>
                )
            case 'ConfirmPassword':
                return <LockOutlinedIcon />
            case 'Username':
                return <PersonOutlineOutlinedIcon />
            case 'Code':
                return <KeyOutlinedIcon />
            case 'FEmail':
                return <EmailOutlinedIcon />
        }
    }

    return (
        <div className={`${styles.input} ${chooseError() ? styles.error : ''}`}>
            <label htmlFor={id}>
                {name === 'FEmail' ? 'Email' : name} 
            </label>
            <div style={{ position: 'absolute', top: 25, left: 3 }}>
                {chooseIcon()}
            </div>
            <input type={(name === 'Password' || name === 'NewPassword' || name === 'ConfirmPassword') ? (!show ? 'password' : 'text') : 'text' } value={state} onChange={e => { setState(e.target.value); fixError() }} name={id} id={id} placeholder={placeholder ? placeholder : '' } minLength={(name === 'Password' || name === 'NewPassword' || name === 'ConfirmPassword') ? 8 : 3} maxLength={(name === 'Password' || name === 'NewPassword' || name === 'ConfirmPassword') ? 18 : 346} />               
            {chooseError() && <span className={styles.error_text}>{chooseErrorMessage()}</span>}
        </div>
    )
}

export default TextField;