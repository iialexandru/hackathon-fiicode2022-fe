import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import { useState } from 'react'
import Geocode from "react-geocode";
import Image from 'next/image'

import { server } from '../../config/server'
import styles from '../../styles/scss/LiveTracking/Container.module.scss'
import Child from '../../components/LiveTracking/Child'
import ChildIWatch from '../../components/LiveTracking/ChildIWatch'
import GoogleInput from '../../components/LiveTracking/GoogleInput'
import TextField from '@mui/material/TextField'
import { useRouter } from 'next/router'

interface Props {
    _myChildren: any;
    _otherChildrenIWatch: any;
    _fences: any;
}

const Notifications: NextPage<Props> = ({ _myChildren, _otherChildrenIWatch, _fences }) => {
    const [ myChildren, setMyChildren ] = useState(_myChildren)
    const [ otherChildrenIWatch, setOtherChildrenIWatch ] = useState(_otherChildrenIWatch)
    const [ fences, setFences ] = useState(_fences)
    const router = useRouter()

    Geocode.setApiKey('AIzaSyC8OO5kEbqdGpEb_61WlsCnRUS_NHX94CE')
    Geocode.setLanguage('en')
    Geocode.setRegion('ro')

    const [ fullExactPosition, setFullExactPosition ] = useState<any>()
    const [ name, setName ] = useState('')
    const [ radius, setRadius ] = useState(0)
    const [ pName, setPName ] = useState('')
    const [ error, setError ] = useState(false)

    const SectionChildren = ({ name }: { name: string }) => {

        return (
          <div className={styles.section}>
              <h1>{name} <span>	&#40;{myChildren.length}&#41;</span></h1>
    
              <div className={styles.section_container}>
                  <div className={`${styles.item} ${styles.field_names}`}>
                    <span>Name</span>
                    <span>Age</span>
                    <span>Latest Notification</span>
                    <span>Actions</span>
                  </div>
    
                  {myChildren.map((child: any, i: number) => {
                      return <Child key={i} name={child.name} age={child.age} notification={child.notifications[child.notifications.length - 1] ? child.notifications[child.notifications.length - 1].text : ''} id={child._id} />
                  })}
    
              </div>
    
              {myChildren.length === 0 && 
                <div className={styles.none}>
                  <h2>No person is tracked</h2>
                </div>
              }
          </div>
        )
      }

      const SectionOtherChildren = ({ name }: { name: string }) => {

        return (
          <div className={styles.section}>
              <h1>{name} <span>	&#40;{otherChildrenIWatch.length}&#41;</span></h1>
    
              <div className={styles.section_container}>
                  <div className={`${styles.item} ${styles.field_names}`}>
                    <span>Child</span>
                    <span>Username</span>
                    <span>Email</span>
                    <span>Actions</span>
                  </div>
    
                  {otherChildrenIWatch.map((child: any, i: number) => {
                    return <ChildIWatch key={i} name={child.name} parent={child.parentName} email={child.parentEmail} id={child._id} />
                  })}
              </div>
    
              {otherChildrenIWatch.length === 0 && 
                <div className={styles.none}>
                  <h2>No person was assigned</h2>
                </div>
              }
          </div>
        )
      }

      const createFence = async (e: any) => {
        e.preventDefault()
        setError(false)

        if(!fullExactPosition || (fullExactPosition.address_components && fullExactPosition.address_components.length <= 0) || !fullExactPosition.address_components) {
            setError(true)
            return;
        }

        let error = false;
        Geocode.fromAddress(name).then(
            async (response) => {
              const { lat, lng } = response.results[0].geometry.location;

              const location = name;
              const result = await axios.post(`${server}/api-hkt/child/create-fence`, { lat, lng, radius, pName, location  }, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => console.log(err))
    
            router.reload()
            },
            (error) => {
              console.error(error);
              setError(true)
              error = true
            }
          );
          if(error) {
              setError(true)
              return;
            }
            
      }

      const deleteFence = async (e: any, name: string) => {
        e.preventDefault()

        const result = await axios.post(`${server}/api-hkt/child/remove-fence/${name}`, {}, { withCredentials: true })
                        .then(res => res.data)
                        .catch(err => console.log(err))

        router.reload()
      }

    return (
        <div className={styles.container}>
            <div className={styles.section}>
                <h1>Add restriction</h1>

                <div className={styles.create_fence}>
                    <div className={styles.section_container}>
                        <div className={`${styles.item} ${styles.field_names}`}>
                            <span>Location</span>
                            <span>Radius M</span>
                            <span>Name</span>
                            <span>Actions</span>
                        </div>
        
                        <div className={styles.item}>
                            <GoogleInput setName={setName} setFullExactPosition={setFullExactPosition} />
                            <TextField value={radius} onChange={e => setRadius(parseInt(e.target.value))} label='Radius'  size='small' variant='standard' type='number' />
                            <TextField value={pName} onChange={e => setPName(e.target.value)} label='PName'  size='small' variant='standard' />
                            <button onClick={e => createFence(e)} style={{ color: error ? 'red' : 'white' }}>Send</button>
                        </div>

                        {fences.map((fence: any, i: number) => {

                            const [ hoverDelete, setHoverDelete ] = useState(false)
                            return (
                                <>
                                    {fence.fences.map((sm: any, i: number) => {
                                        return (
                                            <div className={styles.item}>
                                                <span>{sm.location}</span>
                                                <span>{sm.radius}</span>
                                                <span>{sm.name}</span>
                                                <Image onClick={e => deleteFence(e, sm.name)} style={{ zIndex: 1 }} onMouseEnter={() => setHoverDelete(true)} onMouseLeave={() => setHoverDelete(false)}src={!hoverDelete ? 'https://res.cloudinary.com/multimediarog/image/upload/v1653645718/HACKATHON-FIICODE/delete-10402_cpqnfc.svg' : 'https://res.cloudinary.com/multimediarog/image/upload/v1653645715/HACKATHON-FIICODE/delete-10403_ietme5.svg' } width={50} height={50} />
                                            </div>
                                        )
                                    })}
                                </>
                            )
                        })}
                    </div>
                </div>
            </div>

            <SectionChildren name={'Children'} />
            <SectionOtherChildren name={'Assigned Children'} />
        </div>
    )
}

export default Notifications;

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    const token = ctx.req.cookies['x-access-token']
  
    if(!token){
        return {
            redirect: {
                destination: '/authentication/login',
                permanent: false
            },
            props: {}
        }
    }
  
    let redirect = false
    const result = await axios.get(`${server}/api-hkt/child/get-notifications`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                                .then(res => res.data)
                                .catch(err => {
                                  redirect = true
                                  console.log(err)
                                })
    if(redirect) {
      return {
          redirect: {
            destination: '/',
            permanent: false
        },
        props: {}
      }
    }

    const result2 = await axios.get(`${server}/api-hkt/child/get-fences`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                        .then(res => res.data)
                        .catch(err => {
                            redirect = true
                            console.log(err)
                        })

    if(redirect) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
            props: {}
        }
    }

    if(result && result.message === 'Data sent') {
      return { 
        props: {
          _myChildren: result.myChildren,
          _otherChildrenIWatch: result.otherChildrenIWatch,
          _fences: result2.fences
        }
      }
    } else return {
      props: {
        _myChildren: [],
        _otherChildrenIWatch: [],
        _fences: []
      }
    }
  }