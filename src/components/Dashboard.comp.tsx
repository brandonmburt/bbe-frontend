import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Outlet, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import HomeIcon from '@mui/icons-material/Home';
import ExposureIcon from '@mui/icons-material/Exposure';
import GroupsIcon from '@mui/icons-material/Groups';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditNoteIcon from '@mui/icons-material/EditNote';
import StickyFooter from './StickyFooter.comp';
import { EXPOSURE_TYPES } from '../constants/types.constants';
import { selectLoggedIn, selectUserIsAdmin, selectShouldRenderApp } from '../redux/slices/user.slice';
import { FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import { selectExposureType, setExposureType, selectUserUploadedTypes, selectUploadTimestamps } from '../redux/slices/exposure.slice';
import useFetchData from '../hooks/useFetchData';
import useToken from '../hooks/useToken';
import { convertTimestampToDate } from '../utils/date.utils';

const drawerWidth = 200;

interface LinkObj {
    name: string;
    path: string;
    icon: any;
}

// Dark: backgroundColor: '#1C2536', Off White: backgroundColor: '#FAF9F6'
// Light Blue: '#1976d2'
export default function Dashboard() {
    useToken();
    useFetchData();

    const dispatch = useAppDispatch();

    const isAdmin = useAppSelector<boolean>(selectUserIsAdmin);
    const isLoggedIn = useAppSelector<boolean>(selectLoggedIn);
    const exposureType = useAppSelector<string>(selectExposureType);
    const shouldRenderApp = useAppSelector<boolean>(selectShouldRenderApp);
    const userUploadedTypes = useAppSelector<string[]>(selectUserUploadedTypes);
    const uploadTimestamps: string[] = useAppSelector(selectUploadTimestamps);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [selectedLink, setSelectedLink] = useState<string>('');

    useEffect(() => {
        setSelectedLink(isLoggedIn ? 'Home' : 'Sign In');
    }, [isLoggedIn]);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleExporsureUploadTypeChange = (event) => {
        let val = event.target.value;
        if (EXPOSURE_TYPES.find(([value,]) => value === val)) {
            dispatch(setExposureType(val))
        }
        setMobileOpen(false);
    };

    const exposureDropdown = exposureType && (
        <Box sx={{ mt: 2, mb: 1 }}>
            <FormControl sx={{ maxWidth: '200px', p: '0px 10px' }}>
                <InputLabel sx={{ color: '#FAF9F6', pl: 1}}>Exposure Type</InputLabel>
                <Select
                    sx={{ color: '#FAF9F6', height: '60px', wordWrap: 'break-word',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' },
                        '& .MuiSelect-icon': { color: '#1976d2' }
                    }}
                    autoWidth
                    variant='outlined'
                    labelId="exposureType"
                    value={exposureType}
                    label="Exposure Type"
                    onChange={handleExporsureUploadTypeChange} >
                    {EXPOSURE_TYPES.map(([value, label], index) =>
                        <MenuItem key={index} disabled={userUploadedTypes.find(x => x[0] === value) === undefined} value={value}>
                            <img style={{ height: '24px', marginRight: '10px' }} src="/logos/uf-logo-small.png" alt="Underdog Fantasy" />
                            {label}
                            {userUploadedTypes.find(x => x[0] === value) !== undefined && (
                                <span style={{ marginLeft: '5px', color: 'grey', fontSize: '12px' }}>{userUploadedTypes.find(x => x[0] === value)[1]}</span>
                            )}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
            {uploadTimestamps && uploadTimestamps.find(t => t[0] === exposureType) &&
                <Box sx={{mb: 2, color: 'grey', pl: '15px', fontSize: '12px'}}>
                    Last Upload Date: {convertTimestampToDate(uploadTimestamps.find(t => t[0] === exposureType)[2])}
                </Box>
            }
        </Box>
    );

    const mainLinks: LinkObj[] = [
        { name: 'Home', path: '/', icon: <HomeIcon /> },
        { name: 'Exposure', path: '/exposure', icon: <ExposureIcon /> },
        { name: 'Drafts', path: '/drafts', icon: <GroupsIcon /> },
    ];

    const accountLinks: LinkObj[] = isLoggedIn ? [
        { name: 'Upload Exposure', path: '/uploadExposure', icon: <UploadFileIcon /> },
        { name: 'Sign Out', path: '/signOut', icon: <LogoutIcon /> }
    ] : [
        { name: 'Sign In', path: '/signIn', icon: <LoginIcon /> },
        { name: 'Sign Up', path: '/signUp', icon: <AccountCircleIcon /> },
    ];

    if (isAdmin) {
        accountLinks.splice(1, 0, 
            { name: 'Upload ADPs', path: '/uploadADPs', icon: <UploadFileIcon /> },
            { name: 'Player Name Rules', path: '/replacement', icon: <EditNoteIcon /> }
        );
    }

    const updateSelectedLink = (name: string) => {
        setSelectedLink(name);
        setMobileOpen(false);
    }

    const generateList = (linkObjArr: LinkObj[]) => {
        return (
            <List>
                {linkObjArr.map(({ name, path, icon }) => (
                    <Link key={name} to={path} style={{ textDecoration: 'none' }} >
                        <ListItem disablePadding>
                            <ListItemButton selected={selectedLink === name} onClick={() => updateSelectedLink(name)}>
                                <ListItemIcon sx={{ color: '#FAF9F6' }}>{icon}</ListItemIcon>
                                <ListItemText sx={{ color: '#FAF9F6' }} primary={name} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        )
    }

    const drawer = (
        <Box sx={{ backgroundColor: '#1C2536', flexGrow: 1 }}>
            <Toolbar />
            {isLoggedIn && <>
                {exposureDropdown}
                <Divider sx={{ borderColor: 'darkgrey' }} />
                {exposureType && <>
                    {generateList(mainLinks)}
                    <Divider sx={{ borderColor: 'darkgrey' }} />
                </>}
                
            </>}
            {generateList(accountLinks)}
        </Box>
    );

    return shouldRenderApp ? (<>
        <Box sx={{ display: 'flex', backgroundColor: '#FAF9F6', minHeight: `calc(100vh - ${100}px)` }}>
            <CssBaseline />
            <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` }, }}>
                <Toolbar style={{ backgroundColor: '#1C2536' }}>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    {exposureType && EXPOSURE_TYPES.find(([value,]) => value === exposureType) ? (
                        <Stack>
                            <Typography variant="h6" noWrap component="div" sx={{ lineHeight: '1' }}>
                                Best Ball Explorer
                            </Typography>
                            <Typography variant='overline' component='div' sx={{ lineHeight: '1', height: '16px', color: '#1976d2'}} >
                                <img style={{ height: '12px', marginRight: '5px' }} src="/logos/uf-logo-small.png" alt="Underdog Fantasy" />
                                {EXPOSURE_TYPES.find(([value,]) => value === exposureType)[1]}
                            </Typography>
                        </Stack>
                    ) : (
                        <Typography variant="h6" noWrap component="div">
                            Best Ball Explorer
                        </Typography>
                    )}
                    
                </Toolbar>
            </AppBar>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 }, backgroundColor: '#24292E', height: '100%' }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box sx={{ flexGrow: 1, p: { s: 1, md: 3 }, width: { xs: `calc(100% - ${drawerWidth}px)` } }}>
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
        <StickyFooter /></>

    ) : null;
}
