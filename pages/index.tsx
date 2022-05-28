import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react'
import Image from 'next/image'
import axios from 'axios'

import styles from '../styles/scss/Home/Container.module.scss'
import Child from '../components/Home/Child'
import ChildIWatch from '../components/Home/ChildIWatch'
import Parent from '../components/Home/Parent'
import { server } from '../config/server'

interface Children {
  _myChildren: any;
  _otherChildrenIWatch: any;
  _peopleThatWatchMyChildren: any;
}

const Home: NextPage<Children> = ({ _myChildren, _otherChildrenIWatch, _peopleThatWatchMyChildren }) => {

  const [ myChildren, setMyChildren ] = useState(_myChildren)
  const [ otherChildrenIWatch, setOtherChildrenIWatch ] = useState(_otherChildrenIWatch)
  const [ peopleThatWatchMyChildren, setPeopleThatWatchMyChildren ] = useState(_peopleThatWatchMyChildren)

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

  const SectionParents = ({ name }: { name: string }) => {
    let total = 0
    peopleThatWatchMyChildren.map((parent: any) => parent.assignedParents.map((ap: any) => total++))
    
    return (
      <div className={styles.section}>
          <h1>{name} <span>	&#40;{total}&#41; </span></h1>

          <div className={styles.section_container}>
              <div className={`${styles.item} ${styles.field_names}`}>
                <span>Child</span>
                <span>Username</span>
                <span>Email</span>
                <span>Actions</span>
              </div>

              {peopleThatWatchMyChildren.map((parent: any, i: any) => {
                return(
                <>
                  {parent.assignedParents.map((ap: any, i: number) => {
                    return <Parent key={i} nameChild={ap.childName} nameParent={ap.username} emailParent={ap.email} id={ap.id} childId={ap.childId} role={ap.role} />
                  })}
                </>
                )
              })}
          </div>
          {peopleThatWatchMyChildren.length === 0 && 
            <div className={styles.none}>
              <h2>No person was assigned</h2>
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
      <SectionParents name={'Authorized People'} />
      <SectionOtherChildren name={'Assigned Children'} />
    </div>
  )
}

export default Home;

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
  const result = await axios.get(`${server}/api-hkt/data-homepage`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
                              .then(res => res.data)
                              .catch(err => {
                                redirect = true
                                console.log(err)
                              })

  if(redirect) {
    return {
        redirect: {
          destination: '/authentication/login',
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
        _peopleThatWatchMyChildren: result.peopleThatWatchMyChildren
      }
    }
  } else return {
    props: {
      _myChildren: [],
      _otherChildrenIWatch: [],
      _peopleThatWatchMyChildren: []
    }
  }
}