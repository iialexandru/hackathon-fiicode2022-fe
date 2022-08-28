import type { NextPage, GetServerSideProps } from 'next'
import { useState, } from 'react'
import { useRouter } from 'next/router'

import styles from '../../styles/scss/Child/Container.module.scss'
// import {NoSSR} from '../../utils/NoSSR'
import { QrReader } from "react-qr-reader";
import {client} from '../../config/server'


const ChildRequest: NextPage = () => {
    const router = useRouter()
    const [data, setData] = useState("Not Found");

    const handleScan = async (scanData: any) => {
        if (scanData && scanData !== "") {
          setData(scanData)
          router.push(`${client}/child-request/decide/${scanData}`)
        }
      };

    return (
        // <NoSSR fallback={<div style={{ height: '100vh' }}></div>}>
            <div className={styles.container}>   

                <div className={styles.scanner}>
                    <h2>Scan the QR code with the scanner below</h2>
                    <QrReader
                        constraints={{ advanced: [] }}
                        scanDelay={200}
                        onResult={(result: any, error) => { if(result) handleScan(result.text) } }
                    />
                </div>
            </div>
        // </NoSSR>
    )
}

export default ChildRequest;

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
    } else return { props: {} }
  }