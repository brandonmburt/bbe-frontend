import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { EXPOSURE_TYPES } from '../../constants/types.constants';
import { convertTimestampToDate } from '../../utils/date.utils';
import ClearIcon from '@mui/icons-material/Clear';

export function ExposureUploadTable(props) {


    if (!props.uploadTimestamps) return (<></>);

    const { uploadTimestamps, handleDelete, disableDeletion } = props;

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Exposure Type</TableCell>
                        <TableCell align="center">Last Upload Date</TableCell>
                        <TableCell align='right'>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {EXPOSURE_TYPES.map(([value, label], index) => (
                        <TableRow key={index}>
                            <TableCell>{label}</TableCell>
                            <TableCell align="center">
                                {uploadTimestamps.find(timestamp => timestamp[0] === value) ?
                                    convertTimestampToDate(uploadTimestamps.find(timestamp => timestamp[0] === value)[2]) :
                                    'N/A'
                                }
                            </TableCell>
                            <TableCell align="right">
                                {uploadTimestamps.find(timestamp => timestamp[0] === value) ?
                                    <Button sx={{ color: 'red', minWidth: '20px' }} onClick={() => handleDelete(value)} disabled={disableDeletion}>
                                        <ClearIcon />
                                    </Button> :
                                    <Typography sx={{ color: 'grey', minWidth: '20px', padding: '6px 8px' }}><ClearIcon /></Typography>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}