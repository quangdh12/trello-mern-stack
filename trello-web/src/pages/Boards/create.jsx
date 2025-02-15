import { Abc, Cancel, DescriptionOutlined, LibraryAdd } from '@mui/icons-material';
import {
    Box,
    Button,
    FormControlLabel,
    InputAdornment,
    Modal,
    Radio,
    RadioGroup,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import { BOARDS_TYPE } from '~/utils/constants';
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validator';
import { SidebarItem } from '.';

const SidebarCreateBoardModal = () => {
    const {
        register,
        control,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [validate, setValidate] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleCloseModal = () => {
        setIsOpen(false);
        reset();
    };

    const handleOpenModal = () => setIsOpen(true);

    const submitCreateNewBoard = (data) => {};

    return (
        <>
            <SidebarItem onClick={handleOpenModal}>
                <LibraryAdd fontSize="small" />
                Create a new board
            </SidebarItem>

            <Modal
                open={isOpen}
                aria-labelled-by="modal-modal-title"
                aria-describedbu="modal-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 600,
                        bgcolor: 'white',
                        boxShadow: 24,
                        borderRadius: '8px',
                        border: 'none',
                        outline: 0,
                        padding: '20px 30px',
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? '#1A2027' : 'white',
                    }}
                >
                    <Box
                        sx={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}
                    >
                        <Cancel
                            color="error"
                            sx={{ '&:hover': { color: 'error.light' } }}
                            onClick={handleCloseModal}
                        />
                    </Box>
                    <Box
                        id="modal-modal-title"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                        <LibraryAdd />
                        <Typography variant="h6" component="h2">
                            Create a new board
                        </Typography>
                    </Box>
                    <Box id="modal-modal-description" sx={{ my: 2 }}>
                        <form onSubmit={handleSubmit(submitCreateNewBoard)}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box>
                                    <TextField
                                        fullWidth
                                        label="Title"
                                        type="text"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Abc fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        {...register('title', {
                                            required: FIELD_REQUIRED_MESSAGE,
                                            minLength: {
                                                value: 3,
                                                message: 'Min Length is 3 characters',
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: 'Max Length is 50 characters',
                                            },
                                        })}
                                        error={validate && !!errors['title']}
                                    />
                                    <FieldErrorAlert errors={errors} fieldName={'title'} />
                                </Box>

                                <Box>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        type="text"
                                        variant="outlined"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <DescriptionOutlined fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        {...register('description', {
                                            required: FIELD_REQUIRED_MESSAGE,
                                            minLength: {
                                                value: 3,
                                                message: 'Min Length is 3 characters',
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: 'Max Length is 50 characters',
                                            },
                                        })}
                                        error={validate && !!errors['description']}
                                    />
                                    <FieldErrorAlert errors={errors} fieldName={'description'} />
                                </Box>

                                <Controller
                                    name="type"
                                    defaultValue={BOARDS_TYPE.PUBLIC}
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup
                                            {...field}
                                            row
                                            onChange={(event, value) => field.onChange(value)}
                                            value={field.value}
                                        >
                                            <FormControlLabel
                                                value={BOARDS_TYPE.PUBLIC}
                                                control={<Radio size="small" />}
                                                label="Public"
                                                labelPlacement="start"
                                            />
                                            <FormControlLabel
                                                value={BOARDS_TYPE.PRIVATE}
                                                control={<Radio size="small" />}
                                                label="Private"
                                                labelPlacement="start"
                                            />
                                        </RadioGroup>
                                    )}
                                />

                                <Box
                                    sx={{
                                        alignSelf: 'flex-end',
                                    }}
                                >
                                    <Button
                                        className="interceptor-loading"
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                    >
                                        Create
                                    </Button>
                                </Box>
                            </Box>
                        </form>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default SidebarCreateBoardModal;
