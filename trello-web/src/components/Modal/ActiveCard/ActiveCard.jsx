import CreditCardIcon from '@mui/icons-material/CreditCard';
import CancelIcon from '@mui/icons-material/Cancel';
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded';
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';

import { Box, Divider, Modal, Stack, styled, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { singleFileValidator } from '~/utils/validator';
import ToggleFocusInput from '~/components/Form/ToggleFocusInput';
import Grid from '@mui/material/Unstable_Grid2';
import CardUserGroup from './CardUserGroup';
import CardDescriptionMdEditor from './CardDescriptionMdEditor';
import CardActivitySection from './CardActivitySection';
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput';
import { useDispatch, useSelector } from 'react-redux';
import {
    clearAndHideCurrentActiveCard,
    selectCurrentActiveCard,
    selectIsShowModalActiveCard,
    updateCurrentActiveCard,
} from '~/redux/activeCard/activeCardSlice';
import { updateCardDetailsAPI } from '~/apis';
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice';
import { selectCurrentUser } from '~/redux/user/userSlice';
import { CARD_MEMBER_ACTIONS } from '~/utils/constants';

const SidebarItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    cursor: 'pointer',
    fontsize: '14px',
    fontWeight: 600,
    color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
    backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
    padding: '10px',
    borderRadius: '4px',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#33485d' : theme.palette.grey[300],
        '&:active': {
            color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
            backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff',
        },
    },
}));

const ActiveCard = () => {
    const dispatch = useDispatch();
    const activeCard = useSelector(selectCurrentActiveCard);
    const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard);
    const currentUser = useSelector(selectCurrentUser);

    const handleCloseModal = () => {
        dispatch(clearAndHideCurrentActiveCard());
    };

    const callApiUpdateCard = async (updateData) => {
        const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData);
        dispatch(updateCurrentActiveCard(updatedCard));

        dispatch(updateCardInBoard(updatedCard));
        return updatedCard;
    };

    const onUpdateCardTitle = (newTitle) => {
        callApiUpdateCard({ title: newTitle.trim() });
    };

    const onUpdateCardDescription = (newDescription) => {
        callApiUpdateCard({ description: newDescription });
    };

    const handleUploadCardCover = (e) => {
        const error = singleFileValidator(e.target?.files[0]);
        if (error) {
            toast.error(error);
            return;
        }

        let reqData = new FormData();
        reqData.append('cardCover', e.target?.files[0]);

        toast.promise(
            callApiUpdateCard(reqData).finally(() => (e.target.value = '')),
            {
                pending: 'Uploading...',
            }
        );
    };

    const onAddCardComment = async (commentToAdd) => {
        await callApiUpdateCard({ commentToAdd });
    };

    const onUpdateCardMembers = async (incomingMemberInfo) => {
        callApiUpdateCard({ incomingMemberInfo });
    };

    return (
        <Modal
            disableScrollLock
            open={isShowModalActiveCard}
            onClose={handleCloseModal}
            sx={{ overflow: 'auto' }}
        >
            <Box
                sx={{
                    position: 'relative',
                    width: 900,
                    maxWidth: 900,
                    bgcolor: 'white',
                    boxShadow: 24,
                    borderRadius: '8px',
                    border: 'none',
                    outline: 0,
                    padding: '40px 20px 20px',
                    margin: '50px auto',
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1a2027' : '#fff',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '12px',
                        right: '10px',
                        cursor: 'pointer',
                    }}
                >
                    <CancelIcon
                        color="error"
                        sx={{ '&:hover': { color: 'error.light' } }}
                        onClick={handleCloseModal}
                    />
                </Box>

                {activeCard?.cover && (
                    <Box sx={{ mb: 4 }}>
                        <img
                            style={{
                                width: '100%',
                                height: '320px',
                                borderRadius: '6px',
                                objectFit: 'cover',
                            }}
                            src={`${activeCard?.cover}`}
                            alt="card-cover"
                        />
                    </Box>
                )}

                <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CreditCardIcon />

                    <ToggleFocusInput
                        inputFontSize="22px"
                        value={`${activeCard?.title}`}
                        onChangedValued={onUpdateCardTitle}
                    />
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid sx={12} sm={9}>
                        <Box sx={{ mb: 3 }}>
                            <Typography sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                                Members
                            </Typography>

                            <CardUserGroup
                                cardMemberIds={activeCard?.memberIds}
                                onUpdateCardMembers={onUpdateCardMembers}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <SubjectRoundedIcon />
                                <Typography
                                    variant="span"
                                    sx={{ fontWeight: 600, fontsize: '20px' }}
                                >
                                    Description
                                </Typography>
                            </Box>

                            <CardDescriptionMdEditor
                                description={activeCard?.description}
                                onUpdateDescription={onUpdateCardDescription}
                            />
                        </Box>

                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <DvrOutlinedIcon />
                                <Typography
                                    variant="span"
                                    sx={{ fontWeight: 600, fontsize: '20px' }}
                                >
                                    Activity
                                </Typography>
                            </Box>

                            <CardActivitySection
                                cardComments={activeCard?.comments}
                                onAddCardComment={onAddCardComment}
                            />
                        </Box>
                    </Grid>

                    <Grid sx={12} sm={3}>
                        <Typography sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                            Add To Card
                        </Typography>
                        <Stack direction={'column'} spacing={1}>
                            {!activeCard?.memberIds?.includes(currentUser._id) && (
                                <SidebarItem
                                    className="active"
                                    onClick={() =>
                                        onUpdateCardMembers({
                                            userId: currentUser._id,
                                            action: CARD_MEMBER_ACTIONS.ADD,
                                        })
                                    }
                                >
                                    <PersonOutlineOutlinedIcon fontSize="small" />
                                    Join
                                </SidebarItem>
                            )}

                            <SidebarItem className="active" component={'label'}>
                                <ImageOutlinedIcon fontSize="small" />
                                Cover
                                <VisuallyHiddenInput type="file" onChange={handleUploadCardCover} />
                            </SidebarItem>

                            <SidebarItem>
                                <AttachFileOutlinedIcon fontSize="small" />
                                Attachment
                            </SidebarItem>
                            <SidebarItem>
                                <LocalOfferOutlinedIcon fontSize="small" />
                                Labels
                            </SidebarItem>
                            <SidebarItem>
                                <TaskAltOutlinedIcon fontSize="small" />
                                Checklist
                            </SidebarItem>
                            <SidebarItem>
                                <WatchLaterOutlinedIcon fontSize="small" />
                                Dates
                            </SidebarItem>
                            <SidebarItem>
                                <AutoFixHighOutlinedIcon fontSize="small" />
                                Custom Fields
                            </SidebarItem>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                            Power-Ups
                        </Typography>
                        <Stack direction={'column'} spacing={1}>
                            <SidebarItem>
                                <AspectRatioOutlinedIcon fontSize="small" />
                                Card Size
                            </SidebarItem>
                            <SidebarItem>
                                <AddToDriveOutlinedIcon fontSize="small" />
                                Google Drive
                            </SidebarItem>
                            <SidebarItem>
                                <AddOutlinedIcon fontSize="small" />
                                Add Power-Ups
                            </SidebarItem>
                        </Stack>

                        <Divider sx={{ my: 2 }} />

                        <Typography sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
                            Actions
                        </Typography>
                        <Stack direction={'column'} spacing={1}>
                            <SidebarItem>
                                <ArrowForwardOutlinedIcon fontSize="small" />
                                Move
                            </SidebarItem>
                            <SidebarItem>
                                <ContentCopyOutlinedIcon fontSize="small" />
                                Copy
                            </SidebarItem>
                            <SidebarItem>
                                <AutoAwesomeOutlinedIcon fontSize="small" />
                                Make Template
                            </SidebarItem>
                            <SidebarItem>
                                <ArchiveOutlinedIcon fontSize="small" />
                                Archive
                            </SidebarItem>
                            <SidebarItem>
                                <ShareOutlinedIcon fontSize="small" />
                                Share
                            </SidebarItem>
                        </Stack>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default ActiveCard;
