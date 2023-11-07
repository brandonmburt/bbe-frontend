import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { uploadADPs } from '../../../redux/slices/adps.slice';
import { EXPOSURE_TYPES } from '../../../constants/types.constants';
import { FormControl, InputLabel, Select, MenuItem, Box, Container, CssBaseline } from '@mui/material';
import useLoginRedirect from '../../../hooks/useLoginRedirect';
import useAdminRedirect from '../../../hooks/useAdminRedirect';

export function UploadAdp() {
    useLoginRedirect();
    useAdminRedirect();

    const [file, setFile] = useState(null);
    const [exposureUploadType, setExposureUploadType] = useState<string>('');

    const dispatch = useAppDispatch();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (file !== null && exposureUploadType !== '') {
            dispatch(uploadADPs({ csvFile: file, exposureType: exposureUploadType }))
        }
    };

    const handleExporsureUploadTypeChange = (event) => {
        let val = event.target.value;
        if (EXPOSURE_TYPES.find(({ id }) => id === val)) {
            setExposureUploadType(val);
        }
    };

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
                                {EXPOSURE_TYPES.map(({ id, label }, index) =>
                                    <MenuItem key={index} value={id}>{label}</MenuItem>
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