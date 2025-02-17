import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AddCardIcon from '@mui/icons-material/AddCard';
import CloseIcon from '@mui/icons-material/Close';
import Cloud from '@mui/icons-material/Cloud';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import { clone, cloneDeep } from 'lodash';
import { useConfirm } from 'material-ui-confirm';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis';
import ToggleFocusInput from '~/components/Form/ToggleFocusInput';
import {
    selectCurrentActiveBoard,
    updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import ListCard from './ListCard/ListCard';

function Column({ column, updateTitleCard }) {
    const board = useSelector(selectCurrentActiveBoard);
    const dispatch = useDispatch();

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: column._id,
        data: { ...column },
    });

    const dndKitColumnStyles = {
        transform: CSS.Translate.toString(transform),
        transition,
        height: '100%',
        opacity: isDragging ? 0.5 : undefined,
        // touchAction: 'none'
    };

    const orderedCards = column?.cards;

    const [openNewCardForm, setOpenNewCardForm] = useState(false);
    const toggleOpenNewCardForm = () => {
        if (openNewCardForm) {
            setNewCardTitle('');
        }
        setOpenNewCardForm(!openNewCardForm);
    };

    const [newCardTitle, setNewCardTitle] = useState('');

    const addNewCard = async () => {
        if (!newCardTitle) {
            toast.error('Please enter title!', { position: 'bottom-right' });
            return;
        }

        const newCardData = {
            title: newCardTitle,
            columnId: column._id,
        };

        const createdCard = await createNewCardAPI({
            ...newCardData,
            boardId: board._id,
        });

        const newBoard = cloneDeep(board);
        const columnToUpdate = newBoard.columns.find(
            (column) => column._id === createdCard.columnId
        );
        if (columnToUpdate) {
            if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
                columnToUpdate.cards = [createdCard];
                columnToUpdate.cardOrderIds = [createdCard._id];
            } else {
                columnToUpdate.cards.push(createdCard);
                columnToUpdate.cardOrderIds.push(createdCard._id);
            }
        }
        dispatch(updateCurrentActiveBoard(newBoard));

        toggleOpenNewCardForm();
        setNewCardTitle('');
    };

    const onUpdateColumTitle = (newTitle) => {
        updateColumnDetailsAPI(column._id, {
            title: newTitle,
        }).then(() => {
            const newBoard = cloneDeep(board)
            const columnToUpdate = newBoard.columns.find(c => column._id === c._id)
            if (columnToUpdate) {
                columnToUpdate.title = newTitle
            }

            dispatch(updateCurrentActiveBoard(newBoard))
        });
    };

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const confirmDeleteColumn = useConfirm();
    const handleDeleteColumn = async () => {
        confirmDeleteColumn({
            title: 'Delete Column',
            description:
                'This action will permanently delete your Column and its Cards! Are you sure?',
        })
            .then(() => {
                const newBoard = { ...board };
                newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id);
                newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
                    (_id) => _id !== column._id
                );
                dispatch(updateCurrentActiveBoard(newBoard));

                deleteColumnDetailsAPI(column._id).then((res) => {
                    toast.success(res?.deleteResult);
                });
            })
            .catch(() => {});
    };

    return (
        <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
            <Box
                {...listeners}
                sx={{
                    minWidth: '300px',
                    maxWidth: '300px',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
                    ml: 2,
                    borderRadius: '6px',
                    maxHeight: (theme) =>
                        `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} + 10px)`,
                    height: 'fit-content',
                }}
            >
                {/* Box Column Header*/}
                <Box
                    sx={{
                        height: (theme) => theme.trello.columnHeaderHeight,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <ToggleFocusInput
                        value={column?.title}
                        onChangedValued={onUpdateColumTitle}
                        data-no-dnd="true"
                    />
                    <Box>
                        <Tooltip title="More options">
                            <ExpandMoreIcon
                                id="basic-button-dropdown"
                                aria-controls={open ? 'basic-menu-dropdown' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                sx={{ cursor: 'pointer' }}
                            />
                        </Tooltip>
                        <Menu
                            id="basic-menu-dropdown"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            onClick={handleClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button-dropdown',
                            }}
                        >
                            <MenuItem
                                onClick={toggleOpenNewCardForm}
                                sx={{
                                    '&:hover': { color: 'success.light' },
                                    '&.add-card-icon': { color: 'success.light' },
                                }}
                            >
                                <ListItemIcon>
                                    <AddCardIcon fontSize="small" className="add-card-icon" />
                                </ListItemIcon>
                                <ListItemText>Add new card</ListItemText>
                            </MenuItem>

                            <MenuItem>
                                <ListItemIcon>
                                    <EditIcon fontSize="small" className="edit-title-icon" />
                                </ListItemIcon>
                                <ListItemText>Edit title</ListItemText>
                            </MenuItem>

                            <MenuItem>
                                <ListItemIcon>
                                    <ContentCopy fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Copy</ListItemText>
                            </MenuItem>

                            <MenuItem>
                                <ListItemIcon>
                                    <ContentPaste fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Paste</ListItemText>
                            </MenuItem>

                            <Divider />

                            <MenuItem
                                onClick={handleDeleteColumn}
                                sx={{
                                    '&:hover': { color: 'warning.dark' },
                                    '&.delete-forever-icon': { color: 'warning.dark' },
                                }}
                            >
                                <ListItemIcon>
                                    <DeleteForeverIcon
                                        fontSize="small"
                                        className="delete-forever-icon"
                                    />
                                </ListItemIcon>
                                <ListItemText>Delete this column</ListItemText>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <Cloud fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Archive this column</ListItemText>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>

                <ListCard
                    cards={orderedCards}
                    updateTitleCard={updateTitleCard}
                />

                {/* Box Column Footer*/}
                <Box
                    sx={{
                        height: (theme) => theme.trello.columnHeaderHeight,
                        p: 2,
                    }}
                >
                    {!openNewCardForm ? (
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>
                                Add new card
                            </Button>
                            <Tooltip title="Drag to move">
                                <DragHandleIcon sx={{ cursor: 'pointer' }} />
                            </Tooltip>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                height: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 1,
                            }}
                        >
                            <TextField
                                label="Enter title..."
                                type="text"
                                size="small"
                                variant="outlined"
                                autoFocus
                                data-no-dnd="true"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                sx={{
                                    '& label': { color: 'white' },
                                    '& input': {
                                        color: (theme) => theme.palette.primary.main,
                                        bgcolor: (theme) =>
                                            theme.palette.mode === 'dark' ? '#333643' : 'white',
                                    },
                                    '& label.Mui-focused': {
                                        color: (theme) => theme.palette.primary.main,
                                    },
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: (theme) => theme.palette.primary.main,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: (theme) => theme.palette.primary.main,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: (theme) => theme.palette.primary.main,
                                        },
                                    },
                                    '& .MuiOutlinedInput-input': { borderRadius: 1 },
                                }}
                            />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Button
                                    className="interceptor-loading"
                                    onClick={addNewCard}
                                    variant="contained"
                                    color="primary"
                                    data-no-dnd="true"
                                    size="small"
                                    sx={{
                                        boxShadow: 'none',
                                        border: '0.5 solid',
                                        borderColor: '#0077B6',
                                        '&:hover': { bgcolor: '#599AFC' },
                                    }}
                                >
                                    Add
                                </Button>

                                <CloseIcon
                                    sx={{
                                        color: '#bfbfbf',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            color: '#6f6f6f',
                                        },
                                    }}
                                    onClick={toggleOpenNewCardForm}
                                />
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>
        </div>
    );
}

export default Column;
