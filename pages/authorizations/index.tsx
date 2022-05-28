import type { NextPage, GetServerSideProps } from 'next'
import { useState } from 'react'
import axios from 'axios'

import TextField from '@mui/material/TextField'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import { useRouter } from 'next/router'

import styles from '../../styles/scss/Authorizations/Container.module.scss'
import { server } from '../../config/server'
import Parent from '../../components/Home/Parent'

interface Props {
    _peopleThatWatchMyChildren: any;
    _myChildren: any;
    _invites: any;
}


const Authorizations: NextPage<Props> = ({ _peopleThatWatchMyChildren, _myChildren, _invites }) => {
    const router = useRouter()

    const [ peopleThatWatchMyChildren, setPeopleThatWatchMyChildren ] = useState(_peopleThatWatchMyChildren)
    const [ myChildren, setMyChildren ] = useState(_myChildren)
    const [ invites, setInvites ] = useState(_invites)

    const [ email, setEmail ] = useState('')
    const [ role, setRole ] = useState('')
    const [ child, setChild ] = useState('')
    const [ error, setError ] = useState(false)

    const [ loadingInvite, setLoadingInvite ] = useState(false)

    const invitePerson = async (e: any) => {
        e.preventDefault()
        setError(false)

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if(!email.match(emailRegex) || !email.length || !role.length || !child.length) {
            setError(true)
            return;
        }

        setLoadingInvite(true)
        const result = await axios.post(`${server}/api-hkt/child/invite-person`, { email, role, child }, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoadingInvite(false)
                                })

        if(result && result.message === 'Person invited') {
            setLoadingInvite(false)
            setEmail('')
            setRole('')
        } else {
            setLoadingInvite(false)
            setError(true)
        }
    }

    const acceptInvite = async (e: any, ending: string, role: string) => {
        e.preventDefault()
        setError(false)

        const result = await axios.post(`${server}/api-hkt/child/accept-invite/${ending}`, { role }, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoadingInvite(false)
                                })

        router.reload()
    }

    const rejectInvite = async (e: any, ending: string) => {
        e.preventDefault()
        setError(false)

        const result = await axios.post(`${server}/api-hkt/child/reject-invite/${ending}`, {}, { withCredentials: true })
                                .then(res => res.data)
                                .catch(err => {
                                    console.log(err)
                                    setError(true)
                                    setLoadingInvite(false)
                                })

        router.reload()
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
                    return <>
                        {parent.assignedParents.map((ap: any, i: number) => {
                            return <Parent key={i} nameChild={ap.childName} nameParent={ap.username} emailParent={ap.email} id={ap.id} childId={ap.childId} role={ap.role} />
                        })}
                    </>
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

      const SectionInvites = ({ name }: { name: string }) => {

        return (
            <div className={styles.create_auth} style={{ marginTop: 100, marginBottom: 50 }}>
                <h1>{name}</h1>

                <div className={styles.input}>
                    <div className={styles.section_container}>
                        <div className={`${styles.item} ${styles.field_names}`}>
                            <span>Email</span>
                            <span>Role</span>
                            <span>Child</span>
                            <span>Actions</span>
                        </div>
                        {invites.requests.map((invite: any, i: number) => {
                            return (
                                <div className={styles.item}>
                                    <span>{invite.email}</span>
                                    <span>{invite.role}</span>
                                    <span>{invite.childName}</span>
                                    <div style={{ display: 'flex', gap: 5 }}>
                                        <button onClick={e => acceptInvite(e, invite.id, invite.role)} style={{ background: 'green', border: '0px' }}>Accept</button>
                                        <button onClick={e => rejectInvite(e, invite.id)} style={{ background: 'red',  border: '0px' }}>Reject</button>
                                    </div>
                                </div>
                            ) 
                        })}
                    </div>
                </div>

                {invites.requests.length === 0 && 
                    <div className={styles.none}>
                        <h2>No incoming invites</h2>
                    </div>
                }
            </div>
        )
      }
    
    return (
        <div className={styles.container}>
            <SectionParents name={'Authorized People'} />

            <div className={styles.create_auth}>
                <h1>Invite People</h1>

                <div className={styles.input}>
                    <div className={styles.section_container}>
                        <div className={`${styles.item} ${styles.field_names}`}>
                            <span>Email</span>
                            <span>Role</span>
                            <span>Child</span>
                            <span>Actions</span>
                        </div>
        
                        <div className={styles.item}>
                            <TextField value={email} onChange={e => setEmail(e.target.value)} label='Email'  size='small' variant='standard' />
                            <TextField value={role} onChange={e => setRole(e.target.value)} label='Role'  size='small' variant='standard' />
                            <FormControl fullWidth>
                                <InputLabel id="child">Person</InputLabel>
                                <Select
                                    labelId="child"
                                    id="child-select"
                                    value={child}
                                    label="child"
                                    onChange={e => setChild(e.target.value)}
                                    variant='standard'
                                >
                                    {myChildren.map((child: any, i: number) => {
                                        return <MenuItem value={child._id}>{child.name}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <button onClick={e => invitePerson(e)} style={{ color: error ? 'red' : 'white' }}>Send</button>
                        </div>
                    </div>
                </div>
            </div>

            <SectionInvites name={'Incoming Invites'} />
        </div>
    )
}

export default Authorizations;


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
            destination: '/',
            permanent: false
        },
        props: {}
      }
    }

    const result2 = await axios.get(`${server}/api-hkt/child/incoming-invites`, { withCredentials: true, headers: { Cookie: ctx.req.headers.cookie || 'a' } })
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
          _peopleThatWatchMyChildren: result.peopleThatWatchMyChildren,
          _invites: result2 ? result2.invites : []
        }
      }
    } else return {
      props: {
        _myChildren: [],
        _peopleThatWatchMyChildren: [],
        _invites: []
      }
    }
  }