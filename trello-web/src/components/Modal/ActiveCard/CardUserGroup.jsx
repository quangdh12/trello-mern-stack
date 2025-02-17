import AddIcon from '@mui/icons-material/Add';
import { Avatar, Box, Popover, Tooltip } from '@mui/material';
import { useState } from 'react';

const CardUserGroup = ({ cardMemberIds = [] }) => {
    const [anchorPopoverElement, setAnchorPopoverElement] = useState(null);
    const isOpenPopover = Boolean(anchorPopoverElement);
    const popoverId = isOpenPopover ? 'board-all-users-popover' : undefined;

    const handleTogglePopover = (e) => {
        if (!anchorPopoverElement) setAnchorPopoverElement(e.currentTarget);
        else setAnchorPopoverElement(null);
    };

    return (
        <Box sx={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
            {[...Array(8)].map((_, index) => (
                <Tooltip title="gindo.dev" key={index}>
                    <Avatar
                        sx={{ width: 34, height: 34, cursor: 'pointer' }}
                        alt="avatar-img"
                        src=""
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
                    {[...Array(16)].map((_, index) => (
                        <Tooltip title="gindo.dev" key={index}>
                            <Avatar
                                sx={{ width: 34, height: 34, cursor: 'pointer' }}
                                alt="avatar-img"
                                src=""
                            />
                        </Tooltip>
                    ))}
                </Box>
            </Popover>
        </Box>
    );
};

export default CardUserGroup;
