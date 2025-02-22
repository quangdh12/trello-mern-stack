import { Search } from '@mui/icons-material';
import { Autocomplete, CircularProgress, InputAdornment, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';

const AutoCompleteSearchBoard = () => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [boards, setBoards] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setBoards(null);
        }
    }, [open]);

    const handleInputChangeSearch = (e) => {
        const searchValue = e.target?.value;
        if (!searchValue) return;

        const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`;
    };

    const handleSelectedBoard = (e, selectedBoard) => {};

    return (
        <Autocomplete
            sx={{ width: 220 }}
            id="asynchronous-search-board"
            noOptionsText={!boards ? 'Type to search board...' : 'No board found!'}
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            getOptionLabel={(board) => board.title}
            options={boards || []}
            loading={loading}
            onInputChange={handleInputChangeSearch}
            onChange={handleSelectedBoard}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Type to search..."
                    size="small"
                    InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: 'white' }} />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress sx={{ color: 'white' }} size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                    sx={{
                        '& label': { color: 'white' },
                        '& input': { color: 'white' },
                        '& label.Mui-focused': { color: 'white' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'white' },
                            '&:hover fieldset': { borderColor: 'white' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        '.MuiSvgIcon-root': { color: 'white' },
                    }}
                ></TextField>
            )}
        />
    );
};

export default AutoCompleteSearchBoard;
