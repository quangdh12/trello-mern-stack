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
import { useState } from 'react';
import { BOARD_INVITATION_STATUS } from '~/utils/constants';

const Notifications = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClickNotificationIcon = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const updateBoardInvitation = (status) => {};
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
                {[...Array(0)].length === 0 && (
                    <MenuItem sx={{ minWidth: 200 }}>
                        You do not have any new notifications
                    </MenuItem>
                )}
                {[...Array(6)].map((_, index) => (
                    <Box key={index}>
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
                                        <strong>Gin Do</strong> had invited you to join the board{' '}
                                        <strong>MERN Stack Advanced</strong>
                                    </Box>
                                </Box>
                            </Box>

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
                                    color="success"
                                    size="small"
                                    onClick={() =>
                                        updateBoardInvitation(BOARD_INVITATION_STATUS.ACCEPTED)
                                    }
                                >
                                    Accept
                                </Button>
                                <Button
                                    className="interceptor-loading"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    size="small"
                                    onClick={() =>
                                        updateBoardInvitation(BOARD_INVITATION_STATUS.REJECTED)
                                    }
                                >
                                    Reject
                                </Button>
                            </Box>

                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <Chip
                                    icon={<Done />}
                                    label="Accepted"
                                    color="success"
                                    size="small"
                                />
                                <Chip icon={<NotInterested />} label="Rejected" size="small" />
                            </Box>

                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="span" sx={{ fontSize: '13px' }}>
                                    {moment().format('llll')}
                                </Typography>
                            </Box>
                        </MenuItem>
                        {index !== ([...Array(6)].length - 1 && <Divider />)}
                    </Box>
                ))}
            </Menu>
        </Box>
    );
};

export default Notifications;
