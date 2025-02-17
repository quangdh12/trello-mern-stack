import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AttachmentIcon from '@mui/icons-material/Attachment';
import CommentIcon from '@mui/icons-material/Comment';
import GroupIcon from '@mui/icons-material/Group';
import { Box, ClickAwayListener, Card as MuiCard, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateCurrentActiveCard } from '~/redux/activeCard/activeCardSlice';

function Card({ card, updateTitleCard }) {
    const dispatch = useDispatch();

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card._id,
        data: { ...card },
    });

    const dndKitCardStyles = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : undefined,
        border: isDragging ? '1px solid #0077B6' : undefined,
        borderRadius: '4px',
        // touchAction: 'none'
    };

    const shouldShowCardActions = () => {
        return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length;
    };

    const [newCardTitle, setNewCardTitle] = useState(card?.title);
    const [editTitleCardForm, setEditTitleCardForm] = useState(false);


    const updateCard = async () => {
        if (!newCardTitle) {
            toast.error('Please enter title!', { position: 'top-center' });
            return;
        }

        const newColumnData = {
            title: newCardTitle,
            cardId: card._id,
            columnId: card.columnId,
        };
        await updateTitleCard(newColumnData);

        setEditTitleCardForm(false);
        setNewCardTitle(card?.title);
    };

    const setActiveCard = () => {
        dispatch(updateCurrentActiveCard(card));
    };

    return (
        <MuiCard
            ref={setNodeRef}
            style={dndKitCardStyles}
            {...attributes}
            {...listeners}
            sx={{
                cursor: 'pointer',
                boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
                overflow: 'unset',
                display: card?.FE_PlaceholderCard ? 'none' : 'block',
                border: '1px solid transparent',
                '&:hover': { borderColor: (theme) => theme.palette.primary.main },
                // overflow: card?.FE_PlaceholderCard ? 'hidden' : 'unset'
                // height: card?.FE_PlaceholderCard ? '0px' : 'unset'
            }}
            onClick={setActiveCard}
        >
            {card?.cover && <CardMedia sx={{ height: 140 }} image={card.cover} />}
            <CardContent
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.5,
                    '&:last-child': { p: 1.5 },
                }}
            >
                {editTitleCardForm ? (
                    <ClickAwayListener onClickAway={() => setEditTitleCardForm(false)}>
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
                                type="text"
                                size="small"
                                variant="outlined"
                                autoFocus
                                data-no-dnd="true"
                                value={newCardTitle}
                                onChange={(e) => setNewCardTitle(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Escape') {
                                        setEditTitleCardForm(false);
                                    }
                                    if (e.key === 'Enter') {
                                        updateCard();
                                    }
                                }}
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
                                    onClick={updateCard}
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
                                    Update
                                </Button>
                            </Box>
                        </Box>
                    </ClickAwayListener>
                ) : (
                    <>
                        <Typography>{card?.title}</Typography>
                    </>
                )}
            </CardContent>

            {shouldShowCardActions() && (
                <CardActions sx={{ p: '0 4px 8px 4px' }}>
                    {!!card?.memberIds?.length && (
                        <Button size="small" startIcon={<GroupIcon />}>
                            {card.memberIds.length}
                        </Button>
                    )}

                    {!!card?.comments?.length && (
                        <Button size="small" startIcon={<CommentIcon />}>
                            {card.comments.length}
                        </Button>
                    )}

                    {!!card?.attachments?.length && (
                        <Button size="small" startIcon={<AttachmentIcon />}>
                            {card.attachments.length}
                        </Button>
                    )}
                </CardActions>
            )}
        </MuiCard>
    );
}

export default Card;
