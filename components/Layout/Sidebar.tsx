import Link from 'next/link'

import HomeIcon from '@mui/icons-material/Home';
import PersonPinCircleIcon from '@mui/icons-material/PersonPinCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import StarIcon from '@mui/icons-material/Star';

import styles from '../../styles/scss/Layout/Sidebar.module.scss'
import useWindowSize from '../../utils/useWindowSize'


const SideBar = ({ activateMenu }: { activateMenu: boolean }) => {

    const [ width ] = useWindowSize()

    const Item = ({ url, name, icon }: { icon: any, url: string, name: string }) => {
        return (
            
                <Link href={url}>
                    <li>{icon} <span>{name}</span></li>
                </Link>
        )
    }

    return (
        <div className={`${styles.container} ${width <= 1000 ? (activateMenu ? styles.slide_in : styles.slide_out) : ''}`}>
            <ul className={styles.list_items}>
                <Item icon={<HomeIcon style={{ color: 'rgb(50, 50, 50)'}} />} url='/' name='Home' />
                <Item icon={<PersonPinCircleIcon style={{ color: 'rgb(50, 50, 50)'}} />} url='/livetracking' name='Live Tracking' />
                <Item icon={<NotificationsIcon style={{ color: 'rgb(50, 50, 50)'}} />} url='/notifications' name='Notifications' />
                <Item icon={<StarIcon style={{ color: 'rgb(50, 50, 50)'}} />} url='/authorizations' name='Authorizations' />
                <Item icon={<HomeIcon style={{ color: 'rgb(50, 50, 50)'}} />} url='/add-child' name='Add Child' />
            </ul>
        </div>
    )
}

export default SideBar;