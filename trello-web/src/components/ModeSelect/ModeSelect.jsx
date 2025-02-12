import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import SettingsBrightnessOutlined from '@mui/icons-material/SettingsBrightnessOutlined';
import { useColorScheme } from '@mui/material';

function ModeSelect() {
    const { mode, setMode } = useColorScheme();

    const handleChange = (event) => {
        const selectedMode = event.target.value;
        setMode(selectedMode);
    };

    return (
        <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel
                id="label-select-light-dark-mode"
                sx={{
                    color: 'white',
                    '&.Mui-focused': { color: 'white' },
                }}

            >
                Mode
            </InputLabel>
            <Select
                labelId="label-select-light-dark-mode"
                id="select-light-dark-mode"
                value={mode}
                label="Mode"
                onChange={handleChange}
                sx={{
                    color: 'white',
                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                    '.MuiSvgIcon-root': { color: 'white' }
                }}
            >
                <MenuItem value="light">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LightModeOutlined fontSize='small' />
                        Light
                    </Box>
                </MenuItem>
                <MenuItem value="dark">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DarkModeOutlined fontSize='small' />
                        Dark
                    </Box>
                </MenuItem>
                <MenuItem value="system">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SettingsBrightnessOutlined fontSize='small' />
                        System
                    </Box>
                </MenuItem>
            </Select>
        </FormControl>
    );
}

export default ModeSelect;