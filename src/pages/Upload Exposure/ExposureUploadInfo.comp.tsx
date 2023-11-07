import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { EXPOSURE_TYPES } from '../../constants/types.constants';
import { convertTimestampToDate } from '../../utils/date.utils';
import ClearIcon from '@mui/icons-material/Clear';
import { TOOLTIPS } from '../../constants/tooltips.constants';
import { ToolTip } from '../../components/ToolTip.comp';
import { UploadedExposureData } from '../../models/exposure.model';

export function ExposureUploadTable(props) {

    if (!props.uploadTimestamps) return (<></>);

    const { uploadTimestamps, handleDelete, disableDeletion, isDemo } = props;

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
                    {EXPOSURE_TYPES.map(({ id, label }, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <img style={{ height: '13px', marginRight: '5px' }} src="/logos/uf-logo-small.png" alt="Underdog Fantasy" />
                                {label}
                            </TableCell>
                            <TableCell align="center">
                                {uploadTimestamps.find((t: UploadedExposureData) => t.id === id) ?
                                    convertTimestampToDate(uploadTimestamps.find((t: UploadedExposureData) => t.id === id).timestamp) :
                                    'N/A'
                                }
                            </TableCell>
                            <TableCell align="right">
                                {uploadTimestamps.find((t: UploadedExposureData) => t.id === id) ?
                                    <ToolTip title={isDemo ? TOOLTIPS.DELETE_DISABLED : TOOLTIPS.DELETE_EXPOSURE} content={
                                        <span>
                                            <Button sx={{ color: 'red', minWidth: '20px' }} onClick={() => handleDelete(id)} disabled={disableDeletion || isDemo}>
                                                <ClearIcon />
                                            </Button>
                                        </span>
                                    }/> :
                                    <Typography sx={{ color: 'rgb(185, 185, 182)', minWidth: '20px', padding: '6px 8px' }}><ClearIcon /></Typography>
                                }
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}