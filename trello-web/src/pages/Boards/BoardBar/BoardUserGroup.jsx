import { Avatar, Box, Popover, Tooltip } from '@mui/material';
import { useState } from 'react';
import { LIMIT_USER_GROUP } from '~/utils/constants';

const BoardUserGroup = ({ boardUsers = [], limit = LIMIT_USER_GROUP }) => {
    const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
    const isOpenPopover = Boolean(anchorPopoverElement);
    const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined;

    const handleTogglePopover = (e) => {
        if (!anchorPopoverElement) setAnchorPopoverElement(e.currentTarget);
        else setAnchorPopoverElement(null);
    };

    return (
        <Box sx={{ display: 'flex', gap: '4px' }}>
            {boardUsers.map((user, index) => {
                if (index < limit) {
                    return (
                        <Tooltip title={user?.displayName} key={user._id}>
                            <Avatar
                                sx={{ width: 34, height: 34, cursor: 'pointer' }}
                                alt="avatar-img"
                                src={user?.avatar}
                            />
                        </Tooltip>
                    );
                }
            })}

            {boardUsers.length > limit && (
                <>
                    <Tooltip title="Show more">
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
                                color: 'white',
                                backgroundColor: '#a4b0be',
                            }}
                        >
                            +{boardUsers.length - limit}
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
                                gap: 1,
                            }}
                        >
                            {boardUsers.map((user) => (
                                <Tooltip title={user?.displayName} key={user._id}>
                                <Avatar
                                    sx={{ width: 34, height: 34, cursor: 'pointer' }}
                                    alt="avatar-img"
                                    src={user?.avatar}
                                />
                            </Tooltip>
                            ))}
                        </Box>
                    </Popover>
                </>
            )}
        </Box>
    );
};

export default BoardUserGroup;
