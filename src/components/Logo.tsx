import { Logo } from "../assets/icons"


const QuickBiteLogo = () => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
        }}>
            <Logo />
            <h2 style={{ marginTop: '4px' }}>Quick Bite</h2>
        </div>
    )
}

export default QuickBiteLogo