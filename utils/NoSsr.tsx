import { useEffect, useState } from 'react'

const NoSSR = ({children, fallback} : {children: any, fallback: any}) => {
  
  const [ loading, setLoading ] = useState(false)

  useEffect(() => {
    setLoading(true)
  }, [])

  return <>{loading ? children : fallback}</>
}

export default NoSSR;