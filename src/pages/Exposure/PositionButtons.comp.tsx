import { useState, useEffect } from 'react';
import { Box, Button, TextField, InputAdornment, IconButton } from '@mui/material';
import { POS_COLORS } from '../../constants/colors.constants';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

export function PositionButtons(props) {

    const positions = ['QB', 'RB', 'WR', 'TE'];

    const [selectedPositions, setSelectedPositions] = useState<string[]>(positions);
    const [showPlayerInput, setShowPlayerInput] = useState<boolean>(false);
    const [playerInput, setPlayerInput] = useState<string>('');

    const handlePositionClick = (pos: string) => {
        if (selectedPositions.length === 4) setSelectedPositions([pos]);
        else if (selectedPositions.length === 1 && selectedPositions.includes(pos)) setSelectedPositions(positions);
        else if (selectedPositions.includes(pos)) setSelectedPositions(selectedPositions.filter(p => p !== pos));
        else setSelectedPositions([...selectedPositions, pos]);
    }

    useEffect(() => {
        if (!!selectedPositions) props.handlePositionsFilterChange(selectedPositions);
    }, [selectedPositions]);

    useEffect(() => {
        props.handlePlayerFilterChange(playerInput);
    }, [playerInput]);
    
    const handleChange = (event) => setPlayerInput(event.target.value);

    const handleBlur = () => {
        if (playerInput.length === 0) setShowPlayerInput(false);
    }

    const handleClear = () => {
        setPlayerInput('');
        setShowPlayerInput(false);
    }

    return (
        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            {showPlayerInput ? (
                <TextField
                    autoFocus
                    size='small'
                    label="Player Name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={playerInput}
                    fullWidth
                    sx={{  }}
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {playerInput && (
                                    <IconButton onClick={handleClear}><ClearIcon /></IconButton>
                                )}
                            </InputAdornment>
                        ),
                      }}
                />
            ) : (
                <>
                    <Button
                        variant='contained'
                        sx={{
                            '&:hover': { bgcolor: '#e4e4e4', color: '#a0a0a0' },
                            height: '40px',
                            width: .19,
                            minWidth: 'unset',
                            fontWeight: 'bold',
                            bgcolor: '#e4e4e4',
                            color: '#a0a0a0',
                            border: '1px solid #a0a0a0'
                        }}
                        onClick={() => setShowPlayerInput(true) } >
                            <SearchIcon />
                    </Button>
                    {positions.map((pos, i) => {
                        return (
                            <Button
                                key={i}
                                variant="contained"
                                sx={{
                                    '&:hover': {
                                        color: selectedPositions.includes(pos) ? 'white' : 'rgb(107, 107, 107)',
                                        bgcolor: selectedPositions.includes(pos) ? POS_COLORS[pos] : 'rgb(216, 216, 216)'
                                    },
                                    width: .19,
                                    minWidth: 'unset',
                                    height: '40px',
                                    fontWeight: 'bold',
                                    color: selectedPositions.includes(pos) ? 'white' : 'rgb(107, 107, 107)',
                                    bgcolor: selectedPositions.includes(pos) ? POS_COLORS[pos] : 'rgb(216, 216, 216)'
                                }}
                                onClick={() => handlePositionClick(pos)} >
                                    {pos}
                            </Button>
                        )}
                    )}
                </>
            )}
        </Box>
    );
}