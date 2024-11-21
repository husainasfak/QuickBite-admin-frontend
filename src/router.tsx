import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/login";
import Dashboard from "./layout/Dashboard";
import Auth from "./layout/Auth";
import Root from "./layout/Root";

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '',
                element: <Dashboard />,
                children: [
                    {
                        path: '',
                        element: <Home />
                    },
                ]
            },
            {
                path: '/auth',
                element: <Auth />,
                children: [
                    {
                        path: 'login',
                        element: <Login />
                    }
                ]
            }
        ]
    }


])