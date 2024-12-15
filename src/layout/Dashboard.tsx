import { Navigate, NavLink, Outlet } from "react-router-dom"
import { useAuthStore } from "../store"
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, MenuProps, Space, theme } from "antd"
import { BellFilled, HomeOutlined, ProductOutlined, ShopOutlined, SmileOutlined, UserOutlined } from "@ant-design/icons"
import { useState } from "react"
import QuickBiteLogo from "../components/Logo"
import { logout } from "../http/api"

const getMenuItems = (role: string) => {
    const baseItems = [
        {
            key: '/',
            icon: <HomeOutlined />,
            label: <NavLink to="/">Home</NavLink>,
        },

        {
            key: '/products',
            icon: <ProductOutlined />,
            label: <NavLink to="/products">Products</NavLink>,
        },
        {
            key: '/orders',
            icon: <ProductOutlined />,
            label: <NavLink to="/orders">Orders</NavLink>,
        },
        {
            key: '/promos',
            icon: <SmileOutlined />,
            label: <NavLink to="/promos">Promos</NavLink>,
        },
    ];

    if (role === 'admin') {
        const menus = [...baseItems];
        menus.splice(1, 0, {
            key: '/users',
            icon: <UserOutlined />,
            label: <NavLink to="/users">Users</NavLink>,
        });
        menus.splice(2, 0, {
            key: '/restaurants',
            icon: <ShopOutlined />,
            label: <NavLink to="/restaurants">Restaurants</NavLink>,
        });

        return menus;
    }

    return baseItems;
};




const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout: logoutFromStore } = useAuthStore()

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    if (user === null) {
        return <Navigate to="/auth/login" replace={true} />
    }

    const logoutUser = async () => {
        await logout()
        logoutFromStore()

    }

    // const { mutate } = useMutation({
    //     mutationKey: ['logout-'],
    //     mutationFn: logoutUser,
    //     onSuccess: async () => {
    //         logoutFromStore()
    //     }
    // })


    const dropDownItems: MenuProps['items'] = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Logout',
            onClick: () => logoutUser()
        },
    ]

    return <Layout style={{ minHeight: '100vh' }}>
        <Layout.Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} theme="light" style={{ padding: '20px 0' }}>

            <QuickBiteLogo />

            <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={getMenuItems(user.role)} style={{ marginTop: '16px' }} />
        </Layout.Sider>
        <Layout>
            <Layout.Header style={{ padding: '0 20px', background: colorBgContainer }}>
                <Flex gap="middle" align="start" justify="space-between">
                    <Badge text='ADMIN' status="success" />
                    <Space size={16}>
                        <Badge dot={true}>
                            <BellFilled />
                        </Badge>
                        <Dropdown menu={{ items: dropDownItems }}>
                            <a onClick={(e) => e.preventDefault()}>
                                <Space>
                                    <Avatar style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>U</Avatar>
                                </Space>
                            </a>
                        </Dropdown>
                    </Space>
                </Flex>
            </Layout.Header>
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