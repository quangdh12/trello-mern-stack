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

function Profile() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

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
                        src='https://img.docbao.vn/images/uploads/2023/07/01/001rose-1879.jpg'
                        alt='profile-image' />

                </Tooltip>
            </Button>
            <Menu
                id="basic-menu-profile"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button-profile',
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> My account
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
                <MenuItem>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
}

export default Profile