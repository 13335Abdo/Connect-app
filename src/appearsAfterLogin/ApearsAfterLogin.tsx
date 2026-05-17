import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"

export default function ApearsAfterLogin({children}: { children: ReactNode }) {


    const getItem = localStorage.getItem("token")

    if (getItem) {

        return <>
        {children}
        </>
        
    }else {
        return <Navigate to={"/login"} />
    }

}
