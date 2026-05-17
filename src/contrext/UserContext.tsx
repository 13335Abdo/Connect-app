import { createContext, useState, type ReactNode } from "react"

type UserContextValue = {
    userData: unknown;
    setuserData: (userData: unknown) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const userContex = createContext<UserContextValue>({
    userData: null,
    setuserData: () => {},
})

export default function UserContext({ children }: { children: ReactNode }) {

    const [userData, setuserData] = useState<unknown>(null)
    return (
        <>
            <userContex.Provider value={{ setuserData, userData }}>

                {children}

            </userContex.Provider>





        </>
    )
}
