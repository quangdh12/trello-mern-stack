import AppsIcon from '@mui/icons-material/Apps';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutline from '@mui/icons-material/HelpOutline';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Search from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import SvgIcon from '@mui/material/SvgIcon';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg';
import ModeSelect from '~/components/ModeSelect/ModeSelect';
import Profile from './Menu/Profile';
import Recent from './Menu/Recent';
import Starred from './Menu/Starred';
import Templates from './Menu/Templates';
import Workspaces from './Menu/Workspaces';
import { Link } from 'react-router-dom';

function AppBar() {
    const [searchValue, setSearchValue] = useState('');

    return (
        <Box sx={{
            width: '100%',
            height: (theme) => theme.trello.appBarHeight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            paddingX: 2,
            overflowX: 'auto',
            '&::-webkit-scrollbar': { width: '8px', height: '8px' },
            bgcolor: (theme) => (theme.palette.mode == 'dark' ? '#3b3b3b' : '#0032c7')
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AppsIcon sx={{ color: 'white' }} />
                <Link to={'/'}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }} />
                        <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
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
                                border: 'none'
                            }
                        }}
                        variant='outlined'
                        startIcon={<LibraryAddIcon />}
                    >
                        Create
                    </Button>
                </Box>

            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                    id='outlined-search'
                    label='Search...'
                    type='text'
                    size='small'
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <Search sx={{ color: 'white' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position='end'>
                                <CloseIcon
                                    sx={{
                                        color: searchValue ? 'white' : 'transparent',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setSearchValue('')}
                                />
                            </InputAdornment>
                        )
                    }}
                    sx={{
                        minWidth: 120,
                        maxWidth: 180,
                        '& label': { color: 'white', },
                        '& input': { color: 'white', },
                        '& label.Mui-focused': { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: 'white'
                            },
                            '&:hover fieldset': {
                                borderColor: 'white'
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: 'white'
                            }
                        }
                    }} />
                <ModeSelect />
                <Tooltip title="Notifications">
                    <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
                        <NotificationsNoneIcon sx={{ color: 'white' }} />
                    </Badge>
                </Tooltip>
                <Tooltip title="">
                    <HelpOutline sx={{ cursor: 'pointer', color: 'white' }} />
                </Tooltip>

                <Profile />
            </Box>
        </Box>
    )
}

export default AppBar