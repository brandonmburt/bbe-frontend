import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { EXPOSURE_TYPES } from '../../constants/types.constants';
import { convertTimestampToDate } from '../../utils/date.utils';
import ClearIcon from '@mui/icons-material/Clear';
import { TOOLTIPS } from '../../constants/tooltips.constants';
import { ToolTip } from '../../components/ToolTip.comp';

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
                    {EXPOSURE_TYPES.map(([value, label], index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <img style={{ height: '13px', marginRight: '5px' }} src="/logos/uf-logo-small.png" alt="Underdog Fantasy" />
                                {label}
                            </TableCell>
                            <TableCell align="center">
                                {uploadTimestamps.find(timestamp => timestamp[0] === value) ?
                                    convertTimestampToDate(uploadTimestamps.find(timestamp => timestamp[0] === value)[2]) :
                                    'N/A'
                                }
                            </TableCell>
                            <TableCell align="right">
                                {uploadTimestamps.find(timestamp => timestamp[0] === value) ?
                                    <ToolTip title={isDemo ? TOOLTIPS.DELETE_DISABLED : TOOLTIPS.DELETE_EXPOSURE} content={
                                        <span>
                                            <Button sx={{ color: 'red', minWidth: '20px' }} onClick={() => handleDelete(value)} disabled={disableDeletion || isDemo}>
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