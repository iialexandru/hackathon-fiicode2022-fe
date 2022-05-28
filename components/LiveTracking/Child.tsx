import { useState, useEffect, FC, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import axios from 'axios'


import styles from '../../styles/scss/LiveTracking/Container.module.scss'
import { server } from '../../config/server'


interface Data {
    name: string;
    age: number;
    notification: any;
    id: string;
}


const Child: FC<Data> = ({ name, age, notification, id }) => {
    const [ hoverMore, setHoverMore ] = useState(false)

    const [ marginTopValue, setMarginTopValue ] = useState(0)
    const [ lat, setLat ] = useState(10)
    const [ lng, setLng ] = useState(10)

    const getLocation = async () => {
        const result = await axios.get(`${server}/api-hkt/child/get-geo/${id}`, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => console.log(err))
        
        if(result) {
            setLat(result.lat)
            setLng(result.lng)
        }
    }

    getLocation()

    let myLatLng: any;

    const ref = useRef<any>(null)
    
    useEffect(() => {
        setMarginTopValue(ref.current?.clientHeight)
    }, [hoverMore])

    const containerStyle = {
        width: '100%',
        height: '400px'
      };
      
      const center = useMemo(() => { return {
        lat,
        lng
      }
    }, [ lat, lng ])
      
      function MyComponent() {
        if(!center.lat || !center.lng || !center || typeof center.lat !== 'number' || typeof center.lng !== 'number') return;

        const { isLoaded } = useJsApiLoader({
          id: 'google-map-script',
          googleMapsApiKey: "AIzaSyChhnq77PKx2Ekl1HlXHnXN1ZjmkkgWUsY"
        })
      
        const [map, setMap] = useState(null)
      
        const onLoad = useCallback(function callback(map: any) {
          const bounds = new window.google.maps.LatLngBounds(center);
          map.fitBounds(bounds);
          setMap(map)
        }, [])
      
        const onUnmount = useCallback(function callback(map: any) {
          setMap(null)
        }, [])

        useEffect(() => {
            const interval = setInterval(async () => {
                myLatLng = new window.google.maps.LatLng(lat, lng); 
            }, 6000)

            return () => {
                clearInterval(interval)
            }
        }, [])

        useEffect(() => {
            const interval = setInterval(async () => {
                const result = await axios.get(`${server}/api-hkt/child/get-geo/${id}`, { withCredentials: true })
                                        .then(res => res.data)
                                        .catch(err => console.log(err))
            
                if(result) {
                    setLat(result.lat)
                    setLng(result.lng)
                }

            }, 5000)

            return () => {
                clearInterval(interval)
            }
        }, [])

        return isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={2}
              onLoad={onLoad}
              onUnmount={onUnmount}
            >
              <Marker position={{ lat: lat, lng: lng }} />
            </GoogleMap>
        ) : null
    }

    return (
        <div className={styles.item} style={{ marginBottom: marginTopValue }}>
            <span>{name}</span>
            <span>{age}</span>
            <span>{notification}</span>
            <span className={styles.delete}>
                <Image style={{ zIndex: 1 }} onClick={() => setHoverMore(!hoverMore)} src={!hoverMore ? 'https://res.cloudinary.com/multimediarog/image/upload/v1653668138/HACKATHON-FIICODE/arrow-234_1_el2lt7.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1653668140/HACKATHON-FIICODE/north-arrow-235_1_wvtlfw.svg' } width={20} height={20} />
            </span>
            {hoverMore &&
                <div className={styles.maps_container} ref={ref}>
                    <MyComponent />
                </div>
            }
        </div>
    )
}

export default Child;