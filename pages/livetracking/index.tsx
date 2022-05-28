import type { NextPage, GetServerSideProps } from 'next'
import axios from 'axios'
import { useState } from 'react'

import { server } from '../../config/server'
import styles from '../../styles/scss/LiveTracking/Container.module.scss'
import Child from '../../components/LiveTracking/Child'
import ChildIWatch from '../../components/LiveTracking/ChildIWatch'

interface Props {
    _myChildren: any;
    _otherChildrenIWatch: any;
}

const Notifications: NextPage<Props> = ({ _myChildren, _otherChildrenIWatch }) => {
    const [ myChildren, setMyChildren ] = useState(_myChildren)
    const [ otherChildrenIWatch, setOtherChildrenIWatch ] = useState(_otherChildrenIWatch)

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

    return (
        <div className={styles.container}>
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
  
    if(result && result.message === 'Data sent') {
      return { 
        props: {
          _myChildren: result.myChildren,
          _otherChildrenIWatch: result.otherChildrenIWatch,
        }
      }
    } else return {
      props: {
        _myChildren: [],
        _otherChildrenIWatch: [],
      }
    }
  }