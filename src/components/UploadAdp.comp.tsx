import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { uploadADPs } from '../redux/slices/adps.slice';
import { EXPOSURE_TYPES } from '../constants/types.constants';
import { FormControl, InputLabel, Select, MenuItem, Box, Container, CssBaseline } from '@mui/material';
import useLoginRedirect from '../hooks/useLoginRedirect';
import { selectLoggedIn, selectUserIsAdmin } from '../redux/slices/user.slice';

export function UploadAdp() {
    useLoginRedirect();

    const [loggedIn] = useState<boolean>(useAppSelector(selectLoggedIn));
    const [file, setFile] = useState(null);
    const [exposureUploadType, setExposureUploadType] = useState<string>('');

    const dispatch = useAppDispatch();

    const isLoggedIn = useAppSelector(selectLoggedIn);
    const isAdmin = useAppSelector(selectUserIsAdmin);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (isLoggedIn && file !== null) {
            dispatch(uploadADPs({ csvFile: file, exposureType: exposureUploadType }))
        } else {
            console.log('You must be logged in to upload a file')
        }
    };

    const handleExporsureUploadTypeChange = (event) => {
        let val = event.target.value;
        if (EXPOSURE_TYPES.find(([value, ]) => value === val)) {
            setExposureUploadType(event.target.value);
        }
    };

    if (!loggedIn || !isAdmin) return null;
    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <h2>ADP UPLOAD</h2>
                <Box sx={{ my: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                    
                    <Box sx={{ mt: 1, width: 1 }}>
                        <FormControl sx={{ width: 1 }}>
                            <InputLabel>Exposure Type</InputLabel>
                            <Select
                                autoWidth
                                labelId="exposureType"
                                value={exposureUploadType}
                                label="Exposure Type"
                                onChange={handleExporsureUploadTypeChange} >
                                {EXPOSURE_TYPES.map(([value, label], index) =>
                                    <MenuItem key={index} value={value}>{label}</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ my: 1, width: 1 }}>
                        <input type="file" onChange={handleFileChange} />
                    </Box>

                    <Box sx={{ mt: 1, width: 1 }}>
                        <button onClick={handleUpload}>UploadADP</button>
                    </Box>
                   
                </Box>
            </Container>
        </>
    );
}