import { createContext, useState, type ReactNode } from "react"

type AuthContextValue = {
    token: string | null;
    settoken: (token: string | null) => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext<AuthContextValue>({
    token: null,
    settoken: () => {},
})

export default function AuthContext({ children }: { children: ReactNode }) {

    const [token, settoken] = useState<string | null>(null)
    return (
        <>
            <authContext.Provider value={{ settoken, token }}>

                {children}

            </authContext.Provider>





        </>
    )
}
