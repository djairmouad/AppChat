
import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from './pages/Login'
import SideBare from './root/SideBare'
import Chat from './pages/Chat'
function App() {
const router=createBrowserRouter([
  {path:"/",children:[
    {index:true,element:<Login/>},
    {path:"user",element:<SideBare/>,children:[
      {path:":id",element:<Chat/>}
    ]}
  ]},
])
  return <RouterProvider router={router}/>
}

export default App
