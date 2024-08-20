
import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Login from './pages/Login'
function App() {
const router=createBrowserRouter([
  {path:"/",children:[
    {index:true,element:<Login/>},
    {path:"user"}
  ]},
])
  return <RouterProvider router={router}/>
}

export default App
