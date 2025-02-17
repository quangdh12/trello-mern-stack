import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import { toast } from 'react-toastify'
import CloseIcon from '@mui/icons-material/Close'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import Column from './Column/Column'
import { createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'


function ListColumn({ columns, updateTitleCard }) {
    const board = useSelector(selectCurrentActiveBoard)
    const dispatch = useDispatch()

    const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
    const toggleOpenNewColumnForm = () => {
        if (openNewColumnForm) {
            setNewColumnTitle('');
        }
        setOpenNewColumnForm(!openNewColumnForm);
    }
    const [newColumnTitle, setNewColumnTitle] = useState('')

    const addNewColumn = async () => {
        if (!newColumnTitle) {
            toast.error('Please enter title!');
            return;
        }
        const newColumnData = {
            title: newColumnTitle,
        }

        const createdColumn = await createNewColumnAPI({
            ...newColumnData,
            boardId: board._id
        });

        createdColumn.cards = [generatePlaceholderCard(createdColumn)];
        createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];

        const newBoard = cloneDeep(board);
        newBoard.columns.push(createdColumn);
        newBoard.columnOrderIds.push(createdColumn._id);

        // const newBoard = { ...board }
        // newBoard.columns = newBoard.columns.concat([createdColumn]);
        // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id]);
        dispatch(updateCurrentActiveBoard(newBoard));

        toggleOpenNewColumnForm();
        setNewColumnTitle('');
    }

    return (
        <SortableContext
            items={columns?.map((column) => column._id)}
            strategy={horizontalListSortingStrategy}>
            <Box
                sx={{
                    bgcolor: 'inherit',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    '&::-webkit-scrollbar-track': { m: 2 }
                }}
            >
                {columns?.map((column) => (
                    <Column key={column._id}
                        column={column}
                        updateTitleCard={updateTitleCard}
                    />
                ))}

                {!openNewColumnForm ?
                    <Box
                        onClick={toggleOpenNewColumnForm}
                        sx={{
                            minWidth: '250px',
                            maxWidth: '250px',
                            mx: 2,
                            borderRadius: '6px',
                            height: 'fit-content',
                            bgcolor: '#ffffff3d'
                        }}>
                        <Button
                            startIcon={<NoteAddIcon />}
                            sx={{
                                color: 'white',
                                width: '100%',
                                justifyContent: 'flex-start',
                                pl: 2.5,
                                py: 1
                            }}
                        >
                            Add new column
                        </Button>
                    </Box> :
                    <Box sx={{
                        minWidth: '250px',
                        maxWidth: '250px',
                        mx: 2,
                        p: 1,
                        borderRadius: '6px',
                        height: 'fit-content',
                        bgcolor: 'ffffff3d',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}>
                        <TextField
                            label='Enter column title...'
                            type='text'
                            size='small'
                            variant='outlined'
                            autoFocus
                            value={newColumnTitle}
                            onChange={(e) => setNewColumnTitle(e.target.value)}
                            sx={{
                                '& label': { color: 'white', },
                                '& input': { color: 'white', },
                                '& label.Mui-focused': { color: 'white' },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: 'white' },
                                    '&:hover fieldset': { borderColor: 'white' },
                                    '&.Mui-focused fieldset': { borderColor: 'white' }
                                },
                                '& .MuiOutlinedInput-input': { borderRadius: 1 }
                            }}
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Button
                                className='interceptor-loading'
                                onClick={addNewColumn}
                                variant='contained'
                                color='primary'
                                size='small'
                                sx={{
                                    boxShadow: 'none',
                                    border: '0.5 solid',
                                    borderColor: '#0077B6',
                                    '&:hover': { bgcolor: '#599AFC' }
                                }}
                            >
                                Add New Column
                            </Button>

                            <CloseIcon
                                sx={{
                                    color: '#bfbfbf',
                                    cursor: 'pointer',
                                    '&:hover': {
                                        color: '#6f6f6f'
                                    }
                                }}
                                onClick={toggleOpenNewColumnForm}
                            />
                        </Box>
                    </Box>
                }
            </Box>
        </SortableContext>

    )
}

export default ListColumn