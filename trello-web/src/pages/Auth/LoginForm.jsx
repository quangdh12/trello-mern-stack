import Zoom from '@mui/material/Zoom';
import { useForm } from 'react-hook-form';
import { Card as MuiCard } from '@mui/material';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import {
    EMAIL_RULE,
    EMAIL_RULE_MESSAGE,
    FIELD_REQUIRED_MESSAGE,
    PASSWORD_RULE,
    PASSWORD_RULE_MESSAGE,
} from '~/utils/validator';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { loginUserAPI } from '~/redux/user/userSlice';
import { useState } from 'react';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [searchParams] = useSearchParams();
    const [validate, setValidate] = useState(false);

    const registeredEmail = searchParams.get('registeredEmail');
    const verifiedEmail = searchParams.get('verifiedEmail');

    const submitLogin = (data) => {
        const { email, password } = data;
        setValidate(true);

        toast
            .promise(dispatch(loginUserAPI({ email, password })), {
                pending: 'Logging in...',
            })
            .then((res) => {
                if (!res.error) {
                    navigate('/');
                }
            })
            .finally(() => setValidate(false));
    };

    return (
        <form onSubmit={handleSubmit(submitLogin)}>
            <Zoom in={true} style={{ transitionDelay: '200ms' }}>
                <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
                    <Box
                        sx={{
                            margin: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                        }}
                    >
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <LockIcon />
                        </Avatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <TrelloIcon />
                        </Avatar>
                    </Box>
                    <Box
                        sx={{
                            marginTop: '1em',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            padding: '0 1em',
                        }}
                    >
                        {verifiedEmail && (
                            <Alert
                                severity="success"
                                sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}
                            >
                                Your email&nbsp;
                                <Typography
                                    variant="span"
                                    sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}
                                >
                                    gin.do@gmail.com
                                </Typography>
                                &nbsp;has been verified.
                                <br />
                                Now you can login to enjoy our services! Have a good day!
                            </Alert>
                        )}

                        {registeredEmail && (
                            <Alert
                                severity="info"
                                sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}
                            >
                                An email has been sent to&nbsp;
                                <Typography
                                    variant="span"
                                    sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}
                                >
                                    {registeredEmail}
                                </Typography>
                                <br />
                                Please check and verify email before logging in!
                            </Alert>
                        )}
                    </Box>
                    <Box sx={{ padding: '0 1em 1em 1em' }}>
                        <Box sx={{ marginTop: '1em' }}>
                            <TextField
                                autoFocus
                                fullWidth
                                label="Enter Email..."
                                type="text"
                                variant="outlined"
                                error={validate && !!errors['email']}
                                {...register('email', {
                                    required: FIELD_REQUIRED_MESSAGE,
                                    pattern: {
                                        value: EMAIL_RULE,
                                        message: EMAIL_RULE_MESSAGE,
                                    },
                                })}
                            />
                            <FieldErrorAlert errors={errors} fieldName={'email'} />
                        </Box>

                        <Box sx={{ marginTop: '1em' }}>
                            <TextField
                                fullWidth
                                label="Enter Password..."
                                type="password"
                                variant="outlined"
                                error={validate && !!errors['password']}
                                {...register('password', {
                                    required: FIELD_REQUIRED_MESSAGE,
                                    pattern: {
                                        value: PASSWORD_RULE,
                                        message: PASSWORD_RULE_MESSAGE,
                                    },
                                })}
                            />
                            <FieldErrorAlert errors={errors} fieldName={'password'} />
                        </Box>
                    </Box>
                    <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                        <Button
                            className="interceptor-loading"
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="large"
                            fullWidth
                        >
                            Login
                        </Button>
                    </CardActions>
                    <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
                        <Typography>Are you new member?</Typography>
                        <Link to={'/register'} style={{ textDecoration: 'none' }}>
                            <Typography
                                sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}
                            >
                                Create account!
                            </Typography>
                        </Link>
                    </Box>
                </MuiCard>
            </Zoom>
        </form>
    );
};

export default LoginForm;
