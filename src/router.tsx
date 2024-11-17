import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<Home/>
    },
    {
        path:'/auth/login',
        element:<Login/>
    }
])