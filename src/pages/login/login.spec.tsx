import {describe,expect,it} from 'vitest'
import {render, screen} from '@testing-library/react'
import Login from '.'
describe("Login Page",()=>{
    it("should render with required fields",()=>{
        // Arrange
            // render the component 
            render(<Login/>)
        // Act


        // Assert

        // getBy - throws an error
        // FindBy - Async
        // queryBy - only monitor
        expect(screen.getByText('Sign in')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
        expect(screen.getByRole('button',{name:'Log in'})).toBeInTheDocument()
        expect(screen.getByRole('checkbox',{name:'Remember me'})).toBeInTheDocument()
        expect(screen.getByText('Forgot password')).toBeInTheDocument()
    })
})