

const Login = () => {
    return (
        <div>
            <h1>Sign in</h1>

            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Password" />
            <label htmlFor="remember-me">Remember me</label>
            <input id="remember-me" type="checkbox" />
            <button>Log in</button>
            <a href="#">Forgot password</a>
        </div>
    )
}

export default Login