
import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login, { action as actionLogin } from './pages/Login'
import SideBare from './root/SideBare'
import Chat from './pages/Chat'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import SignUp,{action as actionSignUp} from './pages/SignUp'
import store from '../store'
import {Provider} from "react-redux"
import Profile from './pages/Profile'
import VideoChat from './pages/VideoChat'
function App() {
const queryClient=new QueryClient()
const router=createBrowserRouter([
  {path:"/",children:[
    {index:true,element:<Login/>,action:actionLogin},
    {path:"SignUp",element:<SignUp/>,action:actionSignUp},
    {path:"video",element:<VideoChat/>},
    {path:"user",element:<SideBare/>,children:[
      {path:":id",children:[
        {index:true,element:<Profile/>},
        {path:":friend",element:<Chat/>}
      ]},
      
    ]}
  ]},
])
  return <QueryClientProvider client={queryClient}>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </QueryClientProvider>
}

export default App
