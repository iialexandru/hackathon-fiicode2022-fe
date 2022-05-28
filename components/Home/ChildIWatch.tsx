import { useState, FC } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import axios from 'axios'

import { server } from '../../config/server'
import styles from '../../styles/scss/Home/Container.module.scss'


interface Data {
    name: string;
    parent: string;
    email: any;
    id: string;
}

const ChildIWatch: FC<Data> = ({ name, parent, email, id }) => {
    const [ hoverDelete, setHoverDelete ] = useState(false)

    const router = useRouter()

    const deleteSupervision = async (e: any) => {
        e.preventDefault()

        const result = await axios.post(`${server}/api-hkt/child/remove-child-supervision/${id}`, {}, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => console.log(err))

        router.reload()
    }

    return (
        <div className={styles.item}>
            <span>{name}</span>
            <span>{parent}</span>
            <span>{email}</span>
            <span className={styles.delete}>
                <Image onClick={e => deleteSupervision(e)} style={{ zIndex: 1 }} onMouseEnter={() => setHoverDelete(true)} onMouseLeave={() => setHoverDelete(false)}src={!hoverDelete ? 'https://res.cloudinary.com/multimediarog/image/upload/v1653645718/HACKATHON-FIICODE/delete-10402_cpqnfc.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1653645715/HACKATHON-FIICODE/delete-10403_ietme5.svg' } width={20} height={20} />
            </span>
        </div>
    )
}

export default ChildIWatch;