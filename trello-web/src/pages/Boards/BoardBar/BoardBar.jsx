import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import { capitalizeFirstLetter } from '~/utils/formatters';
import BoardUserGroup from './BoardUserGroup';
import { LIMIT_USER_GROUP } from '~/utils/constants';

const MENU_STYLES = {
    color: 'white',
    bgcolor: 'transparent',
    border: 'none',
    paddingX: '5px',
    borderRadius: '4px',
    '.MuiSvgIcon-root': {
        color: 'white',
    },
    '&:hover': {
        bgcolor: 'primary.50',
    },
};

function BoardBar(props) {
    const { board } = props;

    return (
        <Box
            sx={{
                width: '100%',
                height: (theme) => theme.trello.boardBarHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                paddingX: 2,
                overflowX: 'auto',
                '&::-webkit-scrollbar': { width: '8px', height: '8px' },
                bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#565656' : '#0055c5'),
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip sx={MENU_STYLES} icon={<DashboardIcon />} label={board?.title} clickable />

                <Chip
                    sx={MENU_STYLES}
                    icon={<VpnLockIcon />}
                    label={capitalizeFirstLetter(board?.type)}
                    clickable
                />

                <Chip
                    sx={MENU_STYLES}
                    icon={<AddToDriveIcon />}
                    label="Add to Google Drive"
                    clickable
                />

                <Chip sx={MENU_STYLES} icon={<BoltIcon />} label="Automation" clickable />

                <Chip sx={MENU_STYLES} icon={<FilterListIcon />} label="Filters" clickable />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    variant="outlined"
                    startIcon={<PersonAddIcon />}
                    sx={{
                        color: 'white',
                        borderColor: 'white',
                        '&:hover': {
                            borderColor: 'white',
                        },
                    }}
                >
                    Invite
                </Button>

                <BoardUserGroup boardUsers={[]} limit={LIMIT_USER_GROUP} />
            </Box>
        </Box>
    );
}

export default BoardBar;
