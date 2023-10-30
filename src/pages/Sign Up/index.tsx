import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { signUp, signIn, selectSignUpError, selectSignUpSuccessful, resetSignUpError, selectLoggedIn } from '../../redux/slices/user.slice';
import { Link, useNavigate } from "react-router-dom";
import { validateEmail, validatePassword } from '../../utils/validators.utils';
import CircularProgress from '@mui/material/CircularProgress';


export default function SignUp() {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [disableForm, setDisableForm] = useState<boolean>(false);

    const isLoggedIn = useAppSelector<boolean>(selectLoggedIn);
    const signUpError = useAppSelector<string>(selectSignUpError);
    const signUpSuccessful = useAppSelector<boolean>(selectSignUpSuccessful);
    const [waitingForResponse, setWaitingForResponse] = useState<boolean>(false);

    useEffect(() => {
        if (!waitingForResponse) return;
        else if (signUpSuccessful) {
            dispatch(signIn({email: email.toLowerCase(), password: password, rememberMe: false}));
        } else if (signUpError) {
            setDisableForm(false);
            setWaitingForResponse(false);
        }
    }, [signUpSuccessful, signUpError]);

    useEffect(() => {
        /* Indicates sucessful sign up and sign in */
        if (signUpSuccessful && isLoggedIn) {
            setWaitingForResponse(false);
            setTimeout(() => navigate('/upload'), 750);
        }
    }, [signUpSuccessful, isLoggedIn, navigate]);

    const enableSubmit = () => !!(firstName && lastName && email && password && !emailError && !passwordError && !disableForm);
    const handleFirstNameChange = (event) => setFirstName(event.target.value);
    const handleLastNameChange = (event) => setLastName(event.target.value);

    // Validate the email and set the error message accordingly
    const handleEmailChange = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);
        if (!newEmail) {
            setEmailError('');
        } else if (!validateEmail(newEmail)) {
                setEmailError('Must be a valid email address.');
        } else {
            setEmailError('');
        }
    };
    
    // Validate the password and set the error message accordingly
    const handlePasswordChange = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);
        if (!newPassword) {
            setPasswordError('');
        } else if (!validatePassword(newPassword)) {
            setPasswordError('Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.');
        } else {
            setPasswordError('');
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!enableSubmit() || !validateEmail(email) || !validatePassword(password)) return;
        else {
            setDisableForm(true);
            let obj ={
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password,
            };
            dispatch(resetSignUpError());
            setWaitingForResponse(true);
            dispatch(signUp(obj));
        }
    };

    return isLoggedIn ? null : (
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
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={firstName}
                                onChange={handleFirstNameChange}
                                disabled={disableForm}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="family-name"
                                value={lastName}
                                onChange={handleLastNameChange}
                                disabled={disableForm}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                error={!!emailError}
                                helperText={emailError}
                                disabled={disableForm}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={handlePasswordChange}
                                error={!!passwordError}
                                helperText={passwordError}
                                autoComplete="new-password"
                                disabled={disableForm}
                            />
                        </Grid>
                    </Grid>
                    {signUpError && <Typography sx={{color: 'red', fontSize: '14px'}}>{signUpError}</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        disabled={!enableSubmit()}
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {waitingForResponse ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link style={{fontSize: '14px', color: '#1976d2'}} to={'/signIn'} >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}