import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme } from "antd"
import { Link, Navigate } from "react-router-dom"
import { createUser, getUsers, updateUser } from "../../http/api"
import { CreateUserType, FieldData, User } from "../../types"
import { useAuthStore } from "../../store"
import UsersFilter from "./UsersFilter"
import { Plus } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import UserForm from "./forms/UserForm"
import { PER_PAGE } from "../../constants"
import { LoadingOutlined } from "@ant-design/icons"
import { debounce } from "lodash"


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
    {
        title: 'Restaurant',
        dataIndex: 'tenant',
        key: 'tenant',
        render: (_text: string, record: User) => {
            return (
                <div>
                    {record?.tenant?.name}
                </div>
            )
        }
    },
];
const Users = () => {
    const [currentEditUser, setCurrentEditUser] = useState<User | null>(null)

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

    const deboundedQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }))
        }, 500)
    }, [])

    const onFilterChange = (changedValue: FieldData[]) => {
        const changedFilterFields = changedValue.map((item) => ({ [item.name[0]]: item.value })).reduce((acc, item) => ({ ...acc, ...item }), {})

        if ('q' in changedFilterFields) {
            deboundedQUpdate(changedFilterFields.q)
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields, currentPage: 1 }))
        }

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
    const { mutate: updateUserMutation } = useMutation({
        mutationKey: ['updateUser'],
        mutationFn: async (data: CreateUserType) => updateUser(data, currentEditUser!.id).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['getUsers'] });
            return;
        },
    });

    const onHandleSubmit = async () => {

        const isEditMode = !!currentEditUser;
        await form.validateFields();
        if (isEditMode) {
            await updateUserMutation(form.getFieldsValue());
        } else {
            await userMutate(form.getFieldsValue());
        }


        form.resetFields();
        setCurrentEditUser(null)
        setDrawerOpen(false);
    };


    const [filterForm] = Form.useForm()


    // Edit mode
    useEffect(() => {
        if (currentEditUser) {
            setDrawerOpen(true)
            form.setFieldsValue({ ...currentEditUser, tenantId: currentEditUser.tenant?.id })
        }
    }, [currentEditUser, form])

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
                        columns={[...columns, {
                            title: 'Actions',
                            render: (_: string, record: User) => {
                                console.log(record)
                                return (
                                    <Space>
                                        <Button type="link" onClick={() => {
                                            setCurrentEditUser(record)
                                        }}>Edit</Button>
                                    </Space>
                                )
                            }
                        }]}
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
                title={currentEditUser ? 'Update User' : 'Add User'}
                width={720}
                destroyOnClose={true}
                open={drawerOpen}
                onClose={() => {
                    form.resetFields();
                    setDrawerOpen(false);
                    setCurrentEditUser(null)
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
                    <UserForm isEditMode={!!currentEditUser} />
                </Form>
            </Drawer>
        </>
    )
}

export default Users