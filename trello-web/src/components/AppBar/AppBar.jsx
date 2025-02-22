import AppsIcon from '@mui/icons-material/Apps';
import HelpOutline from '@mui/icons-material/HelpOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import ModeSelect from '~/components/ModeSelect/ModeSelect';
import Profile from './Menu/Profile';
import Recent from './Menu/Recent';
import Starred from './Menu/Starred';
import Templates from './Menu/Templates';
import Workspaces from './Menu/Workspaces';
import Notifications from './Notifications/Notifications';
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard';

function AppBar() {

    return (
        <Box
            sx={{
                width: '100%',
                height: (theme) => theme.trello.appBarHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                paddingX: 2,
                overflowX: 'auto',
                '&::-webkit-scrollbar': { width: '8px', height: '8px' },
                bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#3b3b3b' : '#0032c7'),
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Link to={'/boards'}>
                    <Tooltip title="Board List">
                        <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
                    </Tooltip>
                </Link>
                <Link to={'/'}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SvgIcon
                            component={TrelloIcon}
                            fontSize="small"
                            inheritViewBox
                            sx={{ color: 'white' }}
                        />
                        <Typography
                            variant="span"
                            sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}
                        >
                            Trello
                        </Typography>
                    </Box>
                </Link>

                <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                    <Workspaces />
                    <Recent />
                    <Starred />
                    <Templates />

                    <Button
                        sx={{
                            color: 'white',
                            border: 'none',
                            '&:hover': {
                                border: 'none',
                            },
                        }}
                        variant="outlined"
                        startIcon={<LibraryAddIcon />}
                    >
                        Create
                    </Button>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
               <AutoCompleteSearchBoard />
                <ModeSelect />

                    <Notifications />

                <Tooltip title="">
                    <HelpOutline sx={{ cursor: 'pointer', color: 'white' }} />
                </Tooltip>

                <Profile />
            </Box>
        </Box>
    );
}

export default AppBar;
