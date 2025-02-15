import { useState } from 'react'
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useConfirm } from 'material-ui-confirm';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserAPI, selectCurrentUser } from '~/redux/user/userSlice';

function Profile() {
    const [anchorEl, setAnchorEl] = useState(null);
    const confirmLogout = useConfirm()
    const dispatch = useDispatch()
    const currentUser = useSelector(selectCurrentUser)

    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        confirmLogout({
            title: 'Are your sure?',
            description: 'Log out of your account',
            confirmationText: 'Confirm',
            cancellationText: 'Cancel'
        }).then(() => {
            dispatch(logoutUserAPI())
        }).catch(() => { })
    }

    return (
        <div>
            <Button
                sx={{ color: 'white' }}
                id="basic-button-profile"
                aria-controls={open ? 'basic-menu-profile' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Tooltip title="Account settings">

                    <Avatar
                        sx={{ width: 34, height: 34 }}
                        src={currentUser?.avatar}
                        alt='profile-image' />

                </Tooltip>
            </Button>
            <Menu
                id="basic-menu-profile"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-profile',
                }}
            >
                <MenuItem sx={{
                    '&:hover': { color: 'success.light' }
                }}>
                    <Avatar src={currentUser?.avatar} alt='profile' sx={{ width: 28, height: 28, mr: 2 }} /> Profile
                </MenuItem>
                <Divider />
                <MenuItem>
                    <ListItemIcon>
                        <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                </MenuItem>
                <MenuItem>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{
                    '&:hover': {
                        color: 'warning.dark', '& .logout-icon': {
                            color: 'warning.dark'
                        }
                    }
                }}>
                    <ListItemIcon>
                        <Logout fontSize="small" className='logout-icon' />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
}

export default Profile