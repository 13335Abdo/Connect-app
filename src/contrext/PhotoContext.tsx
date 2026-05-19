import { createContext, useState, type ReactNode } from "react"


type UserContextValue = {
    profilePicture: unknown;
    setprofilePicture: (profilePicture: unknown) => void;
};


export const profilephotoContext = createContext<UserContextValue>({
    profilePicture: null,
    setprofilePicture: () => { },
})

export default function PhotoContext({ children }: { children: ReactNode }) {


    const [profilePicture, setprofilePicture] = useState<unknown>(null)


    return (
        <profilephotoContext.Provider value={{profilePicture , setprofilePicture}}>
            {children}
        </profilephotoContext.Provider>
    )
}
