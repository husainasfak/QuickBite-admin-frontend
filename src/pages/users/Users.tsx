import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme } from "antd"
import { Link, Navigate } from "react-router-dom"
import { createUser, getUsers } from "../../http/api"
import { CreateUserType, FieldData, User } from "../../types"
import { useAuthStore } from "../../store"
import UsersFilter from "./UsersFilter"
import { Plus } from "lucide-react"
import { useState } from "react"
import UserForm from "./forms/UserForm"
import { PER_PAGE } from "../../constants"
import { LoadingOutlined } from "@ant-design/icons"


const columns = [

    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {
            return (
                <Link to={`/users/${record.id}`}>{record.firstName} {record.lastName}</Link>
            )
        }
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (_text: string) => {
            return (
                <div style={{ textTransform: 'uppercase' }}>{_text}</div>
            )
        }
    },
];
const Users = () => {
    const queryClient = useQueryClient()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const { user } = useAuthStore();
    if (user?.role !== 'admin') {
        return <Navigate to='/' replace={true} />
    }


    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });

    const { data: users, isFetching } = useQuery({
        queryKey: ['getUsers', queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            );

            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString();
            return getUsers(queryString).then((res) => res.data);
        },
        placeholderData: keepPreviousData
    })



    const onFilterChange = (changedValue: FieldData[]) => {
        const changedFilterFields = changedValue.map((item) => ({ [item.name[0]]: item.value })).reduce((acc, item) => ({ ...acc, ...item }), {})

        setQueryParams((prev) => ({ ...prev, ...changedFilterFields }))
    }



    const {
        token: { colorBgLayout },
    } = theme.useToken();


    const [form] = Form.useForm()

    const { mutate: userMutate } = useMutation({
        mutationKey: ['createUser'],
        mutationFn: async (data: CreateUserType) => createUser(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['getUsers'] });
            return;
        },
    });

    const onHandleSubmit = async () => {
        await form.validateFields();
        await userMutate(form.getFieldsValue());
        // const isEditMode = !!currentEditingUser;
        // if (isEditMode) {
        //     await updateUserMutation(form.getFieldsValue());
        // } else {
        //     
        // }
        form.resetFields();
        // setCurrentEditingUser(null);
        setDrawerOpen(false);
    };


    const [filterForm] = Form.useForm()

    return (
        <>

            <Space direction="vertical" size={'large'} style={{ width: '100%' }}>
                <Flex justify="space-between">
                    <Breadcrumb
                        items={[{ title: <Link to='/'>Dashboard</Link> }, { title: 'Users' }]} />

                    {
                        isFetching && <div>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
                        </div>
                    }
                </Flex>
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <UsersFilter>
                        <Button type="primary" icon={<Plus />} onClick={() => {
                            setDrawerOpen(true);
                        }}>
                            Add User
                        </Button>
                    </UsersFilter>
                </Form>



                {
                    users && <Table
                        columns={columns}
                        dataSource={users?.data}
                        rowKey={'id'}
                        pagination={{
                            total: users?.total,
                            pageSize: queryParams.perPage,
                            current: queryParams.currentPage,
                            onChange: (page) => {
                                setQueryParams((prev) => {
                                    return {
                                        ...prev,
                                        currentPage: page,
                                    };
                                });
                            },
                            showTotal: (total: number, range: number[]) => {
                                return `Showing ${range[0]}-${range[1]} of ${total} items`;
                            },
                        }}
                    />
                }
            </Space>


            <Drawer
                title={'Add User'}
                width={720}
                destroyOnClose={true}
                open={drawerOpen}
                onClose={() => {
                    form.resetFields();
                    setDrawerOpen(false);
                }}
                styles={{ body: { backgroundColor: colorBgLayout } }}
                extra={
                    <Space>
                        <Button
                            onClick={() => {
                                form.resetFields();
                                setDrawerOpen(false);
                            }}>
                            Cancel
                        </Button>
                        <Button type="primary" onClick={onHandleSubmit}>
                            Submit
                        </Button>
                    </Space>
                }>
                <Form layout="vertical" form={form}>
                    <UserForm />
                </Form>
            </Drawer>
        </>
    )
}

export default Users