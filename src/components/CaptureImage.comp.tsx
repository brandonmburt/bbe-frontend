import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useScreenshot } from 'use-react-screenshot'
import ShareIcon from '@mui/icons-material/Share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip } from '@mui/material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '75%', md: '50%' },
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    pb: 2,
};  

export default function CaptureImage(props) {

    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState<string>(null);
    const [disableCopy, setDisableCopy] = useState<boolean>(false);
    const [disableDownload, setDisableDownload] = useState<boolean>(false);

    const handleOpen = () => {
        getImage();
        setOpen(true);
    }
    const handleClose = () => {
        setMessage(null);
        setOpen(false);
    }

    const [image, takeScreenshot] = useScreenshot();
    const getImage = () => takeScreenshot(compRef.current);

    const copyImage = () => {
        setDisableCopy(true);
        fetch(image)
            .then((res) => res.blob())
            .then((blob) => {
                const clipboardItem = new ClipboardItem({ 'image/png': blob });
                navigator.clipboard.write([clipboardItem]);
            }).then(() => {
                setMessage('Image Copied to Clipboard');
                setTimeout(() => {
                    setDisableCopy(false);
                    setMessage(null)
                }, 2000);
            })
    }

    const downloadImage = () => {
        setDisableDownload(true);
        fetch(image)
            .then((res) => res.blob())
            .then((blob) => {
                // Create a Blob URL
                const blobUrl = URL.createObjectURL(blob);
                // Create a download link
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'captured_section.png';
                link.click();
                // Revoke the Blob URL to free up resources
                URL.revokeObjectURL(blobUrl);
            }).then(() => {
                setMessage('Image Downloaded');
                setTimeout(() => {
                    setDisableDownload(false);
                    setMessage(null)
                }, 2000);
            });
    }

    if (!props || !props.compRef) return (null);
    const { compRef } = props;

    return (
    <Box sx={{ display: 'flex' }}>
        <Tooltip title={'Share'} placement='top'>
            <Button onClick={handleOpen}><ShareIcon /></Button>
        </Tooltip>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            >
           
            <Box sx={style}>
                {image && <>
                    <img src={image} height={'50%'} width={'100%'} alt={'Screenshot'} />
                    <Box sx={{ width: 1, display: 'flex', justifyContent: 'right'}}>
                        <Tooltip title={'Copy'} placement='top'>
                            <Button sx={{ mr: 1 }} variant='outlined' onClick={copyImage} disabled={disableCopy}><ContentCopyIcon /></Button>
                        </Tooltip>
                        <Tooltip title={'Download'} placement='top'>
                            <Button variant='contained' onClick={downloadImage} disabled={disableDownload} ><DownloadIcon /></Button>
                        </Tooltip>
                    </Box>
                    <Box sx={{ width: 1, mr: 1, textAlign: 'right', height: 15}}>
                        <Typography variant='caption'>{message}</Typography>
                    </Box>
                </>}
            </Box>
        </Modal>
    </Box>
    );

}