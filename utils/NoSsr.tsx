import { Fragment, useEffect, useState } from 'react'


const NoSSR = ({children, fallback} : {children: any, fallback: any}) => {
  
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  return <Fragment>{loading ? children : fallback}</Fragment>
}

export default NoSSR;