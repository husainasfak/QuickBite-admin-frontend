
import { LockOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Flex, Form, Input, Layout, Space } from "antd";
import { Logo } from "../../assets/icons";
const Login = () => {
    return (
        <div>
            {/* <h1>Sign in</h1>

            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Password" />
            <label htmlFor="remember-me">Remember me</label>
            <input id="remember-me" type="checkbox" />
            <button>Log in</button>
            <a href="#">Forgot password</a> */}

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

                        <Form initialValues={{
                            remember: true
                        }}>
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
                                <Button type="primary" htmlType="submit">Log in</Button>
                            </Form.Item>
                        </Form>

                    </Card>
                </Space>
            </Layout>
        </div>
    )
}

export default Login