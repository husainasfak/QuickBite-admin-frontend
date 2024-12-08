import { Breadcrumb } from "antd"
import { Link } from "react-router-dom"

const Users = () => {
    return (
        <>
            <Breadcrumb 
            items={[{ title: <Link to='/'>Dashboard</Link> }, { title: 'Users' }]} />
        </>
    )
}

export default Users