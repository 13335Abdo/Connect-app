import { createContext, useState } from "react"


export const authContext = createContext()

export default function AuthContext({ children }) {

    const [token, settoken] = useState(null)
    return (
        <>
            <authContext.Provider value={{ settoken, token }}>

                {children}

            </authContext.Provider>





        </>
    )
}
