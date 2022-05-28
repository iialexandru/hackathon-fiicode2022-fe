import Image from 'next/image'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import styles from '../../styles/scss/Layout/Header.module.scss'
import { server } from '../../config/server'


const Header = ({ show, showSDMQ, setActivateMenu, activateMenu }: { show: boolean, showSDMQ: boolean, setActivateMenu: any, activateMenu: boolean }) => {
    const router = useRouter()

    const logOut = async (e: any) => {
        e.preventDefault()

        const result = await axios.post(`${server}/api-hkt/miscellaneous/logout`, {}, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => console.log(err))
        
        Cookies.remove('x-access-token')
        router.reload()
    }

    return (
        <div className={styles.container}>
            <h2>
                <Image onClick={() => { if(showSDMQ) { setActivateMenu(!activateMenu) } }} src='https://res.cloudinary.com/multimediarog/image/upload/v1653643985/HACKATHON-FIICODE/maps-location-pointer-11107_czhkge.svg' width={50} height={50} />
                <span>Child Track</span>
            </h2>

            <div className={styles.logout}>
                <button onClick={e => logOut(e)}>Log Out</button>
            </div>
        </div>
    )
}

export default Header;