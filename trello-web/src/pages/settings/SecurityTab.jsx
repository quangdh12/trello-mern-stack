import { Lock, LockReset, Logout, Password } from '@mui/icons-material';
import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material';
import { useConfirm } from 'material-ui-confirm';
import { useForm } from 'react-hook-form';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validator';

const SecurityTab = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const confirmChangePassword = useConfirm();
    const submitChangePassword = (data) => {
        confirmChangePassword({
            title: (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Logout sx={{ color: 'warning.dark' }} /> Change Password
                </Box>
            ),
            description:
                'You have to login again after successfully changing your password. Continue?',
            confirmationText: 'Confirm',
            cancellationText: 'Cancel',
        })
            .then(() => {
                const { currentPassword, newPassword, newPasswordConfirmation } = data;
            })
            .catch(() => {});
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    maxWidth: '1200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 3,
                }}
            >
                <Box>
                    <Typography variant="h5">Security Dashboard</Typography>
                </Box>
                <form onSubmit={handleSubmit(submitChangePassword)}>
                    <Box sx={{ width: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Box>
                            <TextField
                                fullWidth
                                label="Current Password"
                                type="password"
                                variant="filled"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Password fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                {...register('currentPassword', {
                                    required: FIELD_REQUIRED_MESSAGE,
                                    pattern: {
                                        value: PASSWORD_RULE,
                                        message: PASSWORD_RULE_MESSAGE,
                                    },
                                })}
                                error={!!errors['currentPassword']}
                            />
                            <FieldErrorAlert errors={errors} fieldName={'currentPassword'} />
                        </Box>

                        <Box>
                            <TextField
                                fullWidth
                                label="New Password"
                                type="password"
                                variant="filled"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                {...register('newPassword', {
                                    required: FIELD_REQUIRED_MESSAGE,
                                    pattern: {
                                        value: PASSWORD_RULE,
                                        message: PASSWORD_RULE_MESSAGE,
                                    },
                                })}
                                error={!!errors['newPassword']}
                            />
                            <FieldErrorAlert errors={errors} fieldName={'newPassword'} />
                        </Box>

                        <Box>
                            <TextField
                                fullWidth
                                label="New Password COnfirmation"
                                type="password"
                                variant="filled"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockReset fontSize="small" />
                                        </InputAdornment>
                                    ),
                                }}
                                {...register('newPasswordConfirmation', {
                                    required: FIELD_REQUIRED_MESSAGE,
                                    pattern: {
                                        value: PASSWORD_RULE,
                                        message: PASSWORD_RULE_MESSAGE,
                                    },
                                })}
                                error={!!errors['newPasswordConfirmation']}
                            />
                            <FieldErrorAlert
                                errors={errors}
                                fieldName={'newPasswordConfirmation'}
                            />
                        </Box>

                        <Box>
                            <Button
                                className="interceptor-loading"
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                Update
                            </Button>
                        </Box>
                    </Box>
                </form>
            </Box>
        </Box>
    );
};

export default SecurityTab;
