
import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login, { action as actionLogin } from './pages/Login'
import SideBare from './root/SideBare'
import Chat from './pages/Chat'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
function App() {
const queryClient=new QueryClient()
const router=createBrowserRouter([
  {path:"/",children:[
    {index:true,element:<Login/>,action:actionLogin},
    {path:"user",element:<SideBare/>,children:[
      {path:":id",element:<Chat/>}
    ]}
  ]},
])
  return <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
  </QueryClientProvider>
}

export default App
