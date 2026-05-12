import { createContext, useState } from "react"


export const userContex = createContext()

export default function UserContext({ children }) {

    const [userData, setuserData] = useState(null)
    return (
        <>
            <userContex.Provider value={{ setuserData, userData }}>

                {children}

            </userContex.Provider>





        </>
    )
}
