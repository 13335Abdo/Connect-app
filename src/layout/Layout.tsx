import { Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useContext } from "react";
import { authContext } from "../contrext/AuthContext";
// import Navbar from "../Navbar/Navbar";
// import Footer from "../Footer/Footer";

export default function Layout() {

    const { token, settoken } = useContext(authContext)

    const getItem = localStorage.getItem("token")

    if (getItem) {
        
        settoken(getItem)

    }



    return (
        <>

            {token ? <Navbar /> : ""}



            <Outlet />


            {/* <Footer /> */}

        </>
    )
}
