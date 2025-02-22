import { Done, GroupAdd, NotificationsNone, NotInterested } from '@mui/icons-material';
import {
    Badge,
    Box,
    Button,
    Chip,
    Divider,
    Menu,
    MenuItem,
    Tooltip,
    Typography,
} from '@mui/material';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchInvitationAPI,
    selectCurrentNotifications,
    updateBoardInvitationAPI,
} from '~/redux/notifications/notificationsSlice';
import { BOARD_INVITATION_STATUS } from '~/utils/constants';

const Notifications = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(selectCurrentNotifications);

    useEffect(() => {
        dispatch(fetchInvitationAPI());
    }, [dispatch]);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClickNotificationIcon = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const updateBoardInvitation = (status, invitationId) => {
        dispatch(updateBoardInvitationAPI({ invitationId, status })).then((res) =>
            console.log(res)
        );
    };
    return (
        <Box>
            <Tooltip title="Notifications">
                <Badge
                    color="warning"
                    variant="dot"
                    sx={{ cursor: 'pointer' }}
                    id="basic-button-open-notification"
                    aria-controls={open ? 'basic-notification-drop-down' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClickNotificationIcon}
                >
                    <NotificationsNone sx={{ color: 'yellow' }} />
                </Badge>
            </Tooltip>

            <Menu
                sx={{ mt: 2 }}
                id="basic-notification-drop-down"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{ 'aria-labelledby': 'basic-button-open-notification' }}
            >
                {(!notifications || notifications.length === 0) && (
                    <MenuItem sx={{ minWidth: 200 }}>
                        You do not have any new notifications
                    </MenuItem>
                )}
                {notifications?.map((notification, index) => (
                    <Box key={notification._id}>
                        <MenuItem sx={{ minWidth: 200, maxWidth: 360, overflow: 'auto' }}>
                            <Box
                                sx={{
                                    minWidth: '100%',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 1,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box>
                                        <GroupAdd fontSize="small" />
                                    </Box>
                                    <Box>
                                        <strong>{notification.inviter?.displayName}</strong> had
                                        invited you to join the board{' '}
                                        <strong>{notification.board?.title}</strong>
                                    </Box>
                                </Box>

                                {notification.boardInvitation.status ===
                                    BOARD_INVITATION_STATUS.PENDING && (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                            justifyContent: 'flex-end',
                                        }}
                                    >
                                        <Button
                                            className="interceptor-loading"
                                            type="submit"
                                            variant="contained"
                                            color="info"
                                            size="small"
                                            onClick={() =>
                                                updateBoardInvitation(
                                                    BOARD_INVITATION_STATUS.ACCEPTED,
                                                    notification._id
                                                )
                                            }
                                        >
                                            Accept
                                        </Button>
                                        <Button
                                            className="interceptor-loading"
                                            type="submit"
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() =>
                                                updateBoardInvitation(
                                                    BOARD_INVITATION_STATUS.REJECTED,
                                                    notification._id
                                                )
                                            }
                                        >
                                            Reject
                                        </Button>
                                    </Box>
                                )}

                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    {notification.boardInvitation.ACCEPTED ===
                                        BOARD_INVITATION_STATUS.ACCEPTED && (
                                        <Chip
                                            icon={<Done />}
                                            label="Accepted"
                                            color="info"
                                            size="small"
                                        />
                                    )}

                                    {notification.boardInvitation.REJECTED ===
                                        BOARD_INVITATION_STATUS.REJECTED && (
                                        <Chip
                                            icon={<NotInterested />}
                                            label="Rejected"
                                            size="small"
                                        />
                                    )}
                                </Box>

                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="span" sx={{ fontSize: '13px' }}>
                                        {moment().format('llll')}
                                    </Typography>
                                </Box>
                            </Box>
                        </MenuItem>
                        {index !== notifications?.length - 1 && <Divider />}
                    </Box>
                ))}
            </Menu>
        </Box>
    );
};

export default Notifications;
