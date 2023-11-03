import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

export function ToolTip(props) {

    const { title, infoIcon, content } = props;
    
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <Tooltip
            open={isOpen}
            title={title}
            placement="top"
            arrow
            onOpen={handleOpen}
            onClose={handleClose}
        >
            <span
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
                onTouchStart={handleOpen}
            >
                {infoIcon && <InfoIcon sx={{ ml: '5px', color: 'lightgrey', lineHeight: 1, verticalAlign: 'middle' }} /> }
                {!infoIcon && !!content && content}
            </span>
        </Tooltip>
    );

}