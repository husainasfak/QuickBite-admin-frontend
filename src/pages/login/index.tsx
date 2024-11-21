
import { LockOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { Logo } from "../../assets/icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Credentials } from "../../types";
import { login, logout, self } from "../../http/api";
import { useAuthStore } from "../../store";
import { usePermission } from "../../hooks/usePermission";

const loginUser = async (userData: Credentials) => {
    const { data } = await login(userData)

    return data
}
const logoutUser = async () => {
    const { data } = await logout()

    return data
}
const getSelf = async () => {
    const { data } = await self()
    return data;
}
const Login = () => {
    const { isAllowed } = usePermission()
    const { setUser, logout: logoutFromStore } = useAuthStore()
    const { refetch } = useQuery({
        queryKey: ['self'],
        queryFn: getSelf,
        enabled: false
    })

    const logout = useMutation({
        mutationKey: ['logout'],
        mutationFn: logoutUser,
        onSuccess: async () => {
            logoutFromStore()
        }
    })

    const { mutate, isPending, isError, error } = useMutation({
        mutationKey: ['login'],
        mutationFn: loginUser,
        onSuccess: async () => {
            const selfDataPromise = await refetch();

            if (!isAllowed(selfDataPromise.data)) {
                logout.mutate();
                return;
            }

            setUser(selfDataPromise.data)
        }
    })
    return (

        <Layout style={{
            height: '100vh',
            display: 'grid',
            placeItems: 'center'
        }}>
            <Space direction="vertical" align="center" size={'large'}>
                <Layout.Content style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}>
                        <Logo />
                        <h2 style={{ marginTop: '4px' }}>Quick Bite</h2>
                    </div>
                </Layout.Content>

                <Card title={<Space style={{
                    width: '100%',
                    fontSize: '16px',
                    justifyContent: 'center'
                }}>
                    <LockOutlined />
                    Sign in
                </Space>}
                    style={{ width: '350px' }}
                >

                    {
                        isError && (
                            <Alert type="error" message={error.message} style={{ marginBottom: '16px' }} />
                        )
                    }

                    <Form initialValues={{
                        remember: true
                    }}
                        onFinish={(values) => {
                            mutate({ email: values.username, password: values.password })
                        }}
                    >
                        <Form.Item name="username" rules={[
                            {
                                required: true,
                                message: 'Please input your username'
                            },
                            {
                                type: 'email',
                                message: 'Email is not valid'
                            }
                        ]}>
                            <Input placeholder="Username" />
                        </Form.Item>
                        <Form.Item name="password" rules={[
                            {
                                required: true,
                                message: 'Please input your password'
                            },
                        ]}>
                            <Input.Password placeholder="Password" />
                        </Form.Item>
                        <Flex justify="space-between">
                            <Form.Item name="remember" valuePropName="checked">
                                <Checkbox>
                                    Remember me
                                </Checkbox>

                            </Form.Item>
                            <a className="forgot-password">Forgot password</a>
                        </Flex>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={isPending}>Log in</Button>
                        </Form.Item>
                    </Form>

                </Card>
            </Space>
        </Layout>

    )
}

export default Login