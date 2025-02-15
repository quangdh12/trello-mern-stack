import { Box } from '@mui/material';
import { Navigate, useLocation } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';

const Auth = () => {
    const location = useLocation();
    const currentUser = useSelector(selectCurrentUser)

    const isLogin = location.pathname === '/login';
    const isRegister = location.pathname === '/register'

    if (currentUser) {
        return <Navigate to={'/'} replace={true} />
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                alignItems: 'center',
                justifyContent: 'flex-start',
                background: 'url("src/assets/auth/login-register-bg.jpg")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                objectFit: 'cover',
                backgroundPosition: 'center',
                boxShadow: 'inset 0 0 0 2000px rgba(0, 0, 0, 0.2)',
            }}
        >
            {isLogin && <LoginForm />}
            {isRegister && <RegisterForm />}
        </Box>
    );
};

export default Auth;
