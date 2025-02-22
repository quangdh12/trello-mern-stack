import { CheckCircle } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Avatar, Badge, Box, Popover, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice';
import { CARD_MEMBER_ACTIONS } from '~/utils/constants';

const CardUserGroup = ({ cardMemberIds = [], onUpdateCardMembers }) => {
    const board = useSelector(selectCurrentActiveBoard);

    const cardMembers = board?.allUsers?.filter((user) => cardMemberIds.includes(user._id));

    const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
    const isOpenPopover = Boolean(anchorPopoverElement);
    const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined;

    const handleTogglePopover = (e) => {
        if (!anchorPopoverElement) setAnchorPopoverElement(e.currentTarget);
        else setAnchorPopoverElement(null);
    };

    const handleUpdateCardMembers = (user) => {
        const incomingMemberInfo = {
            userId: user._id,

            action: cardMemberIds.includes(user._id)
                ? CARD_MEMBER_ACTIONS.REMOVE
                : CARD_MEMBER_ACTIONS.ADD,
        };

        onUpdateCardMembers(incomingMemberInfo)
    };

    return (
        <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {cardMembers.map((user) => (
                <Tooltip title={user?.displayName} key={user._id}>
                    <Avatar
                        sx={{ width: 34, height: 34, cursor: 'pointer' }}
                        alt="avatar-img"
                        src={user?.avatar}
                    />
                </Tooltip>
            ))}

            <Tooltip title="Add new member">
                <Box
                    aria-describedby={popoverId}
                    onClick={handleTogglePopover}
                    sx={{
                        width: 36,
                        height: 36,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 500,
                        borderRadius: '50%',
                        color: (theme) => (theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d'),
                        bgcolor: (theme) =>
                            theme.palette.mode === 'dark' ? '#2f3542' : theme.palette.grey[200],
                        '&:hover': {
                            color: (theme) =>
                                theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
                            bgcolor: (theme) =>
                                theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff',
                        },
                    }}
                >
                    <AddIcon fontSize="small" />
                </Box>
            </Tooltip>
            <Popover
                id={popoverId}
                open={isOpenPopover}
                anchorEl={anchorPopoverElement}
                onClose={handleTogglePopover}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Box
                    sx={{
                        p: 2,
                        maxWidth: '235px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1.5,
                    }}
                >
                    {board?.allUsers?.map((user) => (
                        <Tooltip title={user?.displayName} key={user._id}>
                            <Badge
                                sx={{ cursor: 'pointer' }}
                                overlap="rectangular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    cardMemberIds.includes(user._id) ? (
                                        <CheckCircle fontSize="small" sx={{ color: '#27ae60' }} />
                                    ) : null
                                }
                                onClick={() => handleUpdateCardMembers(user)}
                            >
                                <Avatar
                                    sx={{ width: 34, height: 34, cursor: 'pointer' }}
                                    alt="avatar-img"
                                    src={user?.avatar}
                                />
                            </Badge>
                        </Tooltip>
                    ))}
                </Box>
            </Popover>
        </Box>
    );
};

export default CardUserGroup;
