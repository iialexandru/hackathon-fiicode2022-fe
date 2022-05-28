import { Fragment, useEffect, useState } from 'react'

interface HydrationProps { 
    children: any;
    fallback: any;
}

const NoSSR = ({children, fallback} : HydrationProps) => {
  
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  return <Fragment>{loading ? children : fallback}</Fragment>
}

export default NoSSR;