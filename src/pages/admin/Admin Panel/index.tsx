import { Box, Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import useLoginRedirect from '../../../hooks/useLoginRedirect';
import useAdminRedirect from '../../../hooks/useAdminRedirect';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import GroupIcon from '@mui/icons-material/Group';
import { Link } from "react-router-dom";

interface LinkObj {
    name: string;
    path: string;
    icon: any;
}

export function AdminPanel() {
    useLoginRedirect();
    useAdminRedirect();

    const adminLinks: LinkObj[] = [
        { name: 'Users', path: '/admin/users', icon: <GroupIcon /> },
        { name: 'Upload ADPs', path: '/admin/uploadADPs', icon: <UploadFileIcon /> },
        { name: 'Player Name Rules', path: '/admin/replacement', icon: <EditNoteIcon /> },
        { name: 'Rookie Definitions', path: '/admin/rookies', icon: <EmojiPeopleIcon /> }
    ];

    return (
        <Container maxWidth="xs">
            <Box sx={{ width: 1 }}>
                <Typography variant="h4" align="center" sx={{ mt: 2, mb: 2 }}>
                    Admin Panel
                </Typography>
                <List>
                    {adminLinks.map(({ name, path, icon }) => (
                        <Link key={name} to={path} style={{ textDecoration: 'none' }} >
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon sx={{ color: '#1976d2' }}>{icon}</ListItemIcon>
                                    <ListItemText sx={{ color: '#1C2536' }} primary={name} />
                                </ListItemButton>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Box>
        </Container>
    );
}