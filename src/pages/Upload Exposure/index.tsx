import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { uploadExposure, selectUploadTimestamps, deleteExposure, selectUploadMessage } from '../../redux/slices/exposure.slice';
import { Avatar, Box, Input, InputLabel, Button, Container, CssBaseline, Typography, FormControl, MenuItem, Select, List, ListItem, ListItemText } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';
import { EXPOSURE_TYPES } from '../../constants/types.constants';
import useLoginRedirect from '../../hooks/useLoginRedirect';
import { selectLoggedIn, selectUserIsDemo } from '../../redux/slices/user.slice';
import { ExposureUploadTable } from './ExposureUploadInfo.comp';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { UploadedExposureData } from '../../models/exposure.model';

const steps: string[] = [
    'Specify Type',
    'Select CSV File',
    'Confirm Inputs',
    'Submit',
];

const instructions: string[] = [
    'Identify the exposure type you want to upload',
    'Select \'Email exposure CSV\'',
    'Download the CSV file sent to your email',
    'Upload the CSV file above',
];

export function UploadExposureForm() {
    useLoginRedirect();

    const dispatch = useAppDispatch();

    const [loggedIn] = useState<boolean>(useAppSelector(selectLoggedIn));
    const uploadTimestamps: UploadedExposureData[] = useAppSelector(selectUploadTimestamps);
    const uploadMessage: string = useAppSelector(selectUploadMessage);
    const isDemo: boolean = useAppSelector(selectUserIsDemo);

    const [file, setFile] = useState<File>(null);
    const [fileName, setFileName] = useState<string>(null);
    const [error, setError] = useState<string>(null);
    const [stepNumber, setStepNumber] = useState<number>(0);
    const [exposureUploadType, setExposureUploadType] = useState<string>('');
    const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false);

    const handleExporsureUploadTypeChange = (event) => {
        let val = event.target.value;
        if (EXPOSURE_TYPES.find(({ id }) => id === val)) {
            setExposureUploadType(val);
        }
    };

    const proceedToNextStep = () => stepNumber < steps.length-1 ? setStepNumber(stepNumber + 1) : null;
    const revertStep = () => stepNumber > 0 ? setStepNumber(stepNumber - 1) : null;

    const isBackButtonDisabled = () => stepNumber === 0;

    const isNextButtonDisabled = () => {
        if (stepNumber === 0 && !EXPOSURE_TYPES.find(({ id }) => id === exposureUploadType)) return true;
        if (stepNumber === 1 && file === null) return true;
        return false;
    }

    const uploadInProgress = useAppSelector(state => state.exposure.uploadInProgress);
    const deleteInProgress = useAppSelector(state => state.exposure.deleteInProgress);
    const uploadError = useAppSelector(state => state.exposure.uploadError);
    const deleteError = useAppSelector(state => state.exposure.deleteError);

    const disableDeletion = uploadInProgress || deleteInProgress || waitingForResponse;

    const onFormSubmissionComplete = () => {
        setTimeout(() => {
            setWaitingForResponse(false);
            setFile(null);
            setFileName(null);
            setExposureUploadType('');
            if (uploadError) {
                setStepNumber(0);
            } else {
                setStepNumber(stepNumber + 1);
            }
          }, 500); // Simulated delay of extra 500ms
    }

    useEffect(() => {
        if (!waitingForResponse) return;
        if (!uploadInProgress && !uploadError && file) {
            setError(null);
            onFormSubmissionComplete();
        } else if (!uploadInProgress && uploadError && file) {
            setError(uploadError);
            onFormSubmissionComplete();
        }
    }, [uploadInProgress, uploadError]);

    const handleFileChange = (event) => {
        const file: File = event.target.files[0];
        if (!file || file.type !== 'text/csv') {
            setError('Error: Invalid file type. Please upload a .csv file.');
            setFile(null);
            setFileName(null);
        } else {
            setError(null);
            setFile(file);
            setFileName(file.name);
        }
    };

    const handleUpload = () => {
        if (loggedIn && file !== null && EXPOSURE_TYPES.find(({ id }) => id === exposureUploadType) && !isDemo) {
            // TODO: more validations here
            setWaitingForResponse(true);
            dispatch(uploadExposure({ csvFile: file, exposureType: exposureUploadType }))
        } else if (isDemo) {
            setError('Error: Cannot upload files in demo mode');
        } else {
            setError('Error: You must be logged in to upload a file');
        }
    };

    const handleDelete = (exposureType) => {
        if (!isDemo) dispatch(deleteExposure({ exposureType: exposureType }));
    }

    const resetForm = () => {
        setStepNumber(0);
        setFile(null);
        setFileName(null);
        setExposureUploadType('');
    }

    if (!loggedIn) return null;
    return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ my: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                    <Avatar sx={{ mb: 2, bgcolor: '#1976d2' }}><UploadFileIcon /></Avatar>
                    <Typography variant="h5">Upload Exposure</Typography>

                    <Box sx={{ my: 5, width: 1 }}>
                        <Stepper activeStep={stepNumber} alternativeLabel>
                            {steps.map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step> )}
                        </Stepper>
                    </Box>

                    {stepNumber === steps.length && 
                        <Box sx={{ width: 1 }}>
                            <Typography variant="h6" sx={{textAlign: 'center'}}>
                                {uploadMessage}
                            </Typography>
                            <Button
                                sx={{ width: 1, my: 5 }}
                                variant='outlined'
                                onClick={resetForm} >
                                    Upload Another File
                            </Button>
                        </Box>
                    }

                    <Box sx={{ mb: 5, width: 1, height: 60 }}>
                        {stepNumber === 0 && (
                            <FormControl sx={{ width: 1 }}>
                                <InputLabel>Exposure Type</InputLabel>
                                <Select
                                    autoWidth
                                    labelId="exposureType"
                                    value={exposureUploadType}
                                    label="Exposure Type"
                                    onChange={handleExporsureUploadTypeChange} >
                                    {EXPOSURE_TYPES.map(({ id, label }, index) =>
                                        <MenuItem key={index} value={id}>
                                            <img style={{ height: '24px', marginRight: '10px' }} src="/logos/uf-logo-small.png" alt="Underdog Fantasy" />
                                            {label + (id === '2023season' ? ' (Most Popular)' : '')}
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                            
                        )}
                        {stepNumber === 1 && (
                            <Box>
                                <Input
                                    id="file-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    sx={{display: 'none'}}
                                />
                                <label htmlFor="file-upload">
                                    <Button fullWidth variant='outlined' component="span" startIcon={<UploadFileIcon />}>
                                        Choose File
                                    </Button>
                                </label>
                                <Typography color={'grey'}>{fileName ? `File: ${fileName}` : 'No file selected'}</Typography>
                            </Box>
                        )}
                        {(stepNumber === 2 || stepNumber === 3) && (
                            <Box>
                                <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between'}}>
                                    <Typography>Exposure Type:</Typography>
                                    <Typography color={'grey'}>{exposureUploadType !== '' && EXPOSURE_TYPES.find(({ id }) => id === exposureUploadType).label}</Typography>
                                </Box>
                                <Box sx={{ mt: 1, width: 1, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography>File:</Typography>
                                    <Typography color={'grey'}>{fileName}</Typography>
                                </Box>
                            </Box>
                        )}
                    </Box>

                    {stepNumber !== steps.length &&
                        <Box sx={{ width: 1 }}>
                            <Typography color="error">{error}</Typography>
                            {steps[stepNumber] !== 'Submit' ? (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Button
                                        sx={{ width: .49 }}
                                        variant='outlined'
                                        disabled={isBackButtonDisabled()}
                                        onClick={revertStep} >
                                            Back
                                    </Button>
                                    <Button
                                        sx={{ width: .49 }}
                                        variant='contained'
                                        disabled={isNextButtonDisabled()}
                                        onClick={proceedToNextStep} >
                                            {steps[stepNumber] === 'Confirm Inputs' ? 'Confirm' : 'Next'}
                                    </Button>
                                </Box>
                            ) : (
                                <>
                                    <Box>
                                        <Button
                                            sx={{ width: 1 }}
                                            variant='contained'
                                            disabled={steps[stepNumber] !== 'Submit' || waitingForResponse || deleteInProgress || isDemo}
                                            
                                            onClick={handleUpload} >
                                            {isDemo ? 'submission disabled' : waitingForResponse ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                                        </Button>
                                    </Box>
                                    <Box sx={{ width: 1, textAlign: 'center' }} >
                                        <Button
                                            sx={{ width: 1, mt: 2 }}
                                            variant='outlined'
                                            disabled={waitingForResponse}
                                            onClick={revertStep} >
                                                Back
                                        </Button>
                                    </Box>
                                </>
                            )}
                            <Box sx={{ width: 1, my: 5 }}>
                                
                                <Accordion disableGutters sx={{backgroundColor: 'white'}}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                        <Typography>Instructions</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{backgroundColor: '#FAF9F6'}} >
                                        <Typography variant='body2' sx={{my: 1, color: 'red'}}>
                                            <span style={{fontWeight: 'bold'}}>Important: </span>Uploading a CSV file will overwrite any existing exposure for the selected exposure type.
                                        </Typography>
                                        <Typography variant='h6'>Underdog Fantasy</Typography>
                                        <List dense>
                                            <ListItem>
                                                <ListItemText primary={
                                                    <>
                                                    <span style={{fontWeight: 'bold'}}>Upcoming</span>{': Navigate to Drafts > Completed'}
                                                    <br />
                                                    <span style={{fontWeight: 'bold'}}>Active</span>{': Navigate to Live > Best Ball > NFL'}
                                                  </>
                                                } />
                                            </ListItem>
                                            {instructions.map((text, index) => (
                                                <ListItem key={index}><ListItemText primary={text} /></ListItem>
                                            ))}
                                        </List>
                                                
                                    </AccordionDetails>
                                </Accordion>

                                {uploadTimestamps &&
                                    <Accordion disableGutters sx={{backgroundColor: 'white'}}>
                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                            <Typography>Upload History</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{backgroundColor: '#FAF9F6'}} >
                                            <ExposureUploadTable uploadTimestamps={uploadTimestamps} handleDelete={handleDelete} disableDeletion={disableDeletion} isDemo={isDemo} />
                                        </AccordionDetails>
                                    </Accordion>
                                }

                            </Box>
                        </Box>
                    }
                    
                </Box>
            </Container>
    );
}