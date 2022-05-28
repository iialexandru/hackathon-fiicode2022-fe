import { useState, useEffect, FC, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios'
import GoogleInput from './GoogleInput'


import styles from '../../styles/scss/LiveTracking/Container.module.scss'
import { server } from '../../config/server'


interface Data {
    name: string;
    radius: number;
    description: any;
    id: string;
}


const Child: FC<Data> = ({ name, radius, description, id }) => {
    const [ hoverMore, setHoverMore ] = useState(false)

    const [ marginTopValue, setMarginTopValue ] = useState(0)

    const [ fullExactPosition, setFullExactPosition ] = useState<any>()
    const [ location, setLocation ] = useState('')

    const ref = useRef<any>(null)
    
    useEffect(() => {
        setMarginTopValue(ref.current?.clientHeight)
    }, [hoverMore])

    return (
        <div className={styles.item} style={{ marginBottom: marginTopValue }}>
            <span>{name}</span>
            <span>{radius}</span>
            <span>
              {description}
            </span>
            <span className={styles.delete}>
                <Image style={{ zIndex: 1 }} onClick={() => setHoverMore(!hoverMore)} src={!hoverMore ? 'https://res.cloudinary.com/multimediarog/image/upload/v1653668138/HACKATHON-FIICODE/arrow-234_1_el2lt7.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1653668140/HACKATHON-FIICODE/north-arrow-235_1_wvtlfw.svg' } width={20} height={20} />
            </span>
        </div>
    )
}

export default Child;