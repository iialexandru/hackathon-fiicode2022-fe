import { useState, FC } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/router'

import styles from '../../styles/scss/Home/Container.module.scss'
import { server } from '../../config/server'

interface Parent {
    nameChild: string;
    nameParent: string;
    emailParent: string;
    id: string;
    childId: string;
    role: string;
}

const Parent: FC<Parent> = ({ nameChild, nameParent, emailParent, id, childId, role }) => {
    const router = useRouter()
    const [ hoverDelete, setHoverDelete ] = useState(false)

    const deleteSupervision = async (e: any) => {
        e.preventDefault()

        const result = await axios.post(`${server}/api-hkt/child/remove-parent-supervision/${childId}/${id}`, {}, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => console.log(err))

        router.reload()
    }

    return (
        <div className={styles.item}>
            <span>{nameChild}</span>
            <span>{nameParent} &#40;{role}&#41;</span>
            <span>{emailParent}</span>
            <span className={styles.delete}>
                <Image onClick={e => deleteSupervision(e)} style={{ zIndex: 1 }} onMouseEnter={() => setHoverDelete(true)} onMouseLeave={() => setHoverDelete(false)}src={!hoverDelete ? 'https://res.cloudinary.com/multimediarog/image/upload/v1653645718/HACKATHON-FIICODE/delete-10402_cpqnfc.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1653645715/HACKATHON-FIICODE/delete-10403_ietme5.svg' } width={20} height={20} />
            </span>
        </div>
    )
}

export default Parent;