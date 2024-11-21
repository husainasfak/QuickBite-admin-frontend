import { Navigate, NavLink, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"
import { Layout, Menu, theme } from "antd"
import { HomeOutlined, ProductOutlined, ShopOutlined, SmileOutlined, UserOutlined } from "@ant-design/icons"
import { useState } from "react"
import QuickBiteLogo from "../components/Logo"


const items = [
    {
        key: '/',
        icon: <HomeOutlined />,
        label: <NavLink to='/'>Home</NavLink>
    },
    {
        key: '/users',
        icon: <UserOutlined />,
        label: <NavLink to='/users'>Users</NavLink>
    },
    {
        key: '/restaurants',
        icon: <ShopOutlined />,
        label: <NavLink to='/restaurants'>Restaurants</NavLink>
    },
    {
        key: '/products',
        icon: <ProductOutlined />,
        label: <NavLink to='/products'>Products</NavLink>
    },
    {
        key: '/promos',
        icon: <SmileOutlined />,
        label: <NavLink to='/promos'>Promos</NavLink>
    },
]

const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuthStore()
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    if (user === null) {
        return <Navigate to="/auth/login" replace={true} />
    }
    return <Layout style={{ minHeight: '100vh' }}>
        <Layout.Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light" style={{ padding: '20px 0' }}>

            <QuickBiteLogo />

            <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} style={{ marginTop: '16px' }} />
        </Layout.Sider>
        <Layout>
            <Layout.Header style={{ padding: 0, background: colorBgContainer }} />
            <Layout.Content style={{ margin: '16px' }}>
                <Outlet />
            </Layout.Content>
            <Layout.Footer style={{ textAlign: 'center' }}>
                QUICK BITE ADMIN
            </Layout.Footer>
        </Layout>
    </Layout>
}

export default Dashboard