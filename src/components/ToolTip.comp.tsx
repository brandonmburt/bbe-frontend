import { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

export function ToolTip(props) {

    const { title, infoIcon, content } = props;
    
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <Tooltip
            open={isOpen}
            title={title}                
            placement="top"
            arrow
            disableFocusListener
            disableHoverListener
            disableTouchListener
            onClose={() => setIsOpen(false)}
        >
        
            <span
                onMouseEnter={() => setIsOpen(true)}
                onMouseLeave={() => setIsOpen(false)}
                onClick={() => setIsOpen(!isOpen)}
            >
                {infoIcon && <InfoIcon sx={{ ml: '5px', color: 'lightgrey', lineHeight: 1, verticalAlign: 'middle' }} /> }
                {!infoIcon && !!content && content}
            </span>
        </Tooltip>
    );

}