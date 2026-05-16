import { Toast } from "@heroui/react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import AddFriends from "./AddFriends/AddFriends"
import ApearsAfterLogin from "./appearsAfterLogin/ApearsAfterLogin"
import ApearsBeforeLogin from "./appearsAfterLogin/apearsBeforeLogin/ApearsBeforeLogin"
import Login from "./auth/Login"
import Signup from "./auth/Signup"
import AuthContext from "./contrext/AuthContext"
import UserContext from "./contrext/UserContext"
import Home from "./Home/Home"
import Layout from "./layout/Layout"
import MyProfile from "./MyProfile/MyProfile"
import Notifications from "./Notifications/Notifications"


import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import ChangePassword from "./changePassword/ChangePassword"

const queryClient = new QueryClient()

function App() {
  const router = createBrowserRouter([{
    path: "", element: <Layout />, children: [
      { path: "", element: <ApearsAfterLogin>  <Home />  </ApearsAfterLogin> },
      { path: "/signup", element: <ApearsBeforeLogin> <Signup /> </ApearsBeforeLogin> },
      { path: "/login", element: <ApearsBeforeLogin> <Login /> </ApearsBeforeLogin> },
      { path: "/addFriends", element: <ApearsAfterLogin>  <AddFriends />  </ApearsAfterLogin> },
      { path: "/notifications", element: <ApearsAfterLogin>  <Notifications />  </ApearsAfterLogin> },
      { path: "/myProfile", element: <ApearsAfterLogin>  <MyProfile />  </ApearsAfterLogin> },
      { path: "/change-password", element: <ApearsAfterLogin>  <ChangePassword />  </ApearsAfterLogin> },
    ]
  }])




  return (
    <>
      <AuthContext>
        <UserContext>
          <QueryClientProvider client={queryClient}>

            <Toast.Provider placement="top" />


            <RouterProvider router={router} />
            
          </QueryClientProvider>
        </UserContext>

      </AuthContext>


    </>
  )
}

export default App
