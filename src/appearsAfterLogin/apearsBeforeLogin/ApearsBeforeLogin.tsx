import { Navigate } from 'react-router-dom'

export default function ApearsBeforeLogin({children}) {

     const getItem = localStorage.getItem("token")

    if (!getItem) {

        return <>
        {children}
        </>
        
    }else {
        return <Navigate to={"/"} />
    }
  
}
