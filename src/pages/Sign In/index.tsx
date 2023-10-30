import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { selectLoggedIn, signIn, selectShowDemoCredentials, setShowDemoCredentials, selectSignInError, resetSignInError } from '../../redux/slices/user.slice';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/validators.utils'; // TODO
import { selectRedirectPathOnLogin } from '../../redux/slices/exposure.slice';
import CircularProgress from '@mui/material/CircularProgress';

export default function SignIn(props: { demo?: boolean }) {

    const loggedIn = useAppSelector(selectLoggedIn);
    const showDemoCredentials = useAppSelector(selectShowDemoCredentials);
    const redirectPathOnLogin = useAppSelector<string>(selectRedirectPathOnLogin);
    const signInError = useAppSelector<string>(selectSignInError);
    const [loggingIn, setLoggingIn] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (props.demo) dispatch(setShowDemoCredentials(true));
    }, [props]);

    useEffect(() => {
        // Reset sign in error on page load
        dispatch(resetSignInError());
    }, [dispatch]);

    useEffect(() => {
        if (loggingIn && loggedIn && redirectPathOnLogin !== null) { // indicates successful login
            setTimeout(() => {
                setLoggingIn(false);
                navigate(redirectPathOnLogin);
            }, 750);
        } else if (loggingIn && signInError !== null) { // indicates failed login
            setTimeout(() => {
                setLoggingIn(false);
            }, 500);
        } else if (loggedIn && !loggingIn) { // user shouldn't be on this page if they're logged in
            navigate('/');
        }
      }, [loggedIn, navigate, redirectPathOnLogin, signInError]);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let obj = {
            email: data.get('email').toString().toLowerCase(),
            password: data.get('password').toString(),
            rememberMe: data.get('remember') ? true : false,
        };
        // TODO: Validations
        setLoggingIn(true);
        dispatch(signIn(obj));
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    my: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#1976d2' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        disabled={loggedIn}
                        defaultValue={props.demo || showDemoCredentials ? 'demo@demo.com' : ''}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        disabled={loggedIn}
                        defaultValue={props.demo || showDemoCredentials ? 'Password!1' : ''}
                    />
                    <FormControlLabel
                        control={<Checkbox name='remember' disabled={loggedIn} value="remember" color="primary" />}
                        label="Remember me"
                    />
                    {signInError && !loggingIn && <Typography sx={{color: 'red', fontSize: '14px'}}>{signInError}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loggedIn || loggingIn} >
                            {loggingIn ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            {/* <Link style={{fontSize: '14px', color: '#1976d2'}} to={''} >Forgot password?</Link> */}
                        </Grid>
                        <Grid item>
                            <Link style={{fontSize: '14px', color: '#1976d2'}} to={'/signUp'} >
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}