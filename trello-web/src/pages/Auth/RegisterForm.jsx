import Zoom from '@mui/material/Zoom';
import { useForm } from 'react-hook-form';
import { Card as MuiCard } from '@mui/material'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LockIcon from '@mui/icons-material/Lock';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE, PASSWORD_CONFIRMATION_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validator';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import { Link, useNavigate } from 'react-router-dom';
import { registerUserAPI } from '~/apis';
import { toast } from 'react-toastify';
import { useState } from 'react';

const RegisterForm = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const [validate, setValidate] = useState(false)

    const submitRegister = (data) => {
        const { email, password } = data
        setValidate(true)
        toast.promise(registerUserAPI({ email, password }).then((user) => navigate(`/login?registeredEmail=${user.email}`)), { pending: 'Waiting for registration...' }).finally(() => setValidate(false))
    }

    return (<form onSubmit={handleSubmit(submitRegister)}>
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
            <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
                <Box sx={{
                    margin: '1em',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: 1
                }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
                    <Avatar sx={{ bgcolor: 'primary.main' }}><TrelloIcon /></Avatar>
                </Box>

                <Box sx={{ padding: '0 1em 1em 1em' }}>
                    <Box sx={{ marginTop: '1em' }}>
                        <TextField
                            autoFocus
                            fullWidth
                            label="Enter Email..."
                            type='text'
                            variant='outlined'
                            error={validate &&!!errors['email']}
                            {...register('email', {
                                required: FIELD_REQUIRED_MESSAGE,
                                pattern: {
                                    value: EMAIL_RULE,
                                    message: EMAIL_RULE_MESSAGE
                                }
                            })}
                        />
                        <FieldErrorAlert errors={errors} fieldName={'email'} />
                    </Box>

                    <Box sx={{ marginTop: '1em' }}>
                        <TextField
                            fullWidth
                            label="Enter Password..."
                            type='password'
                            variant='outlined'
                            error={validate && !!errors['password']}
                            {...register('password', {
                                required: FIELD_REQUIRED_MESSAGE,
                                pattern: {
                                    value: PASSWORD_RULE,
                                    message: PASSWORD_RULE_MESSAGE
                                },
                            })}
                        />
                        <FieldErrorAlert errors={errors} fieldName={'password'} />
                    </Box>

                    <Box sx={{ marginTop: '1em' }}>
                        <TextField
                            fullWidth
                            label="Enter Password Confirmation..."
                            type='password'
                            variant='outlined'
                            error={validate && !!errors['passwordConfirmation']}
                            {...register('passwordConfirmation', {
                                validate: (value) => {
                                    if (value === watch('password')) {
                                        return true
                                    } else {
                                        return PASSWORD_CONFIRMATION_MESSAGE
                                    }
                                }
                            })}
                        />
                        <FieldErrorAlert errors={errors} fieldName={'passwordConfirmation'} />
                    </Box>

                </Box>
                <CardActions sx={{ padding: '0 1em 1em 1em' }}>
                    <Button className='interceptor-loading' type='submit' variant='contained' color='primary' size='large' fullWidth>
                        Register
                    </Button>
                </CardActions>
                <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
                    <Typography>Already have an account?</Typography>
                    <Link to={'/login'} style={{ textDecoration: 'none' }}>
                        <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>
                            Log in!
                        </Typography>
                    </Link>
                </Box>
            </MuiCard>
        </Zoom>
    </form>);
}

export default RegisterForm;