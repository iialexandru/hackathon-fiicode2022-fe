import { useState, useEffect, FC, useRef } from 'react'
import Image from 'next/image'

import styles from '../../styles/scss/Notifications/Container.module.scss'

import getYear from 'date-fns/getYear'
import getMonth from 'date-fns/getMonth'
import getDay from 'date-fns/getDay'

interface Data {
    name: string;
    age: number;
    notification: any;
    id: string;
    notifications: any;
}

const Child: FC<Data> = ({ name, age, notification, id, notifications }) => {
    const [ hoverMore, setHoverMore ] = useState(false)
    const [ _notifications, setNotifications ] = useState<any>([])

    const [ marginTopValue, setMarginTopValue ] = useState(0)

    const ref = useRef<any>(null)
    
    useEffect(() => {
        setMarginTopValue(ref.current?.clientHeight)
    }, [hoverMore])

    useEffect(() => {
        if(_notifications.length === 0) {
            notifications.forEach((notif: any) => {
                _notifications.unshift(notif)
            })
        }
    }, [])

    return (
        <div className={styles.item} style={{ marginBottom: marginTopValue }}>
            <span>{name}</span>
            <span>{age}</span>
            <span>{notification}</span>
            <span className={styles.delete}>
                <Image style={{ zIndex: 1 }} onClick={() => setHoverMore(!hoverMore)} src={!hoverMore ? 'https://res.cloudinary.com/multimediarog/image/upload/v1653668138/HACKATHON-FIICODE/arrow-234_1_el2lt7.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1653668140/HACKATHON-FIICODE/north-arrow-235_1_wvtlfw.svg' } width={20} height={20} />
            </span>
            {hoverMore &&
                <div className={styles.notifications_container} ref={ref}>
                    {_notifications.map((notification: any, i: number) => {
                        
                        return (
                            <div key={i} className={styles.notification}>
                                {i + 1}. {notification.text} <p style={{ margin: 0, color: 'rgb(100, 100, 100)'}}>Hour: {new Date(notification.createdAt).getHours()}:{new Date(notification.createdAt).getMinutes()} Date: {getYear(new Date(notification.createdAt))}/{getMonth(new Date(notification.createdAt))}/{getDay(new Date(notification.createdAt))}</p>
                            </div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

export default Child;