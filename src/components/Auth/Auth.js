import React, { useState } from 'react';
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { GoogleLogin } from 'react-google-login';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Icon from './icon';
import useStyles from './styles';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Input from './Input';
import { signin, signup } from '../../actions/auth';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

const Auth = () => {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ confirmPassword: { error: false, message: '' }, email: { error: false, message: '' }, firstName: { error: false, message: '' }, lastName: { error: false, message: '' }, password: { error: false, message: '' } });
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateData() === false) {
            return;
        }
        if (isSignup) {
            dispatch(signup(formData, navigate)).then((r) => {
                if (r) {
                    if (r.response.data.message === 'User already exist.') {
                        setErrors({ ...errors, email: { error: true, message: 'Имейлът е вече регистриран' } });
                    }
                }
            });
        } else {
            dispatch(signin(formData, navigate)).then((r) => {
                if (r) {
                    if (r.response.data.message === 'User doesn\'t exist.') {
                        setErrors({ ...errors, email: { error: true, message: 'Няма потребител с такъв имейл' } });
                    }
                    if (r.response.data.message === 'Invalid Credentials') {
                        setErrors({ ...errors, password: { error: true, message: 'Потребителят или паролата са грешни' } });
                    }
                }
            });
        }
    };
    const validateData = () => {
        if (isSignup) {
            if (formData.firstName === '') {
                setErrors({ ...errors, firstName: { error: true, message: 'Моля попълнете Име' } });
                return false;
            }
            if (formData.lastName === '') {
                setErrors({ ...errors, lastName: { error: true, message: 'Моля попълнете Име' } });
                return false;
            }
            if (formData.email === '') {
                setErrors({ ...errors, email: { error: true, message: 'Моля попълнете Имейл' } });
                return false;
            }
            if (formData.password !== formData.confirmPassword) {
                setErrors({ ...errors, password: { error: true, message: 'Паролите не съвпадат' }, confirmPassword: { error: true, message: 'Паролите не съвпадат' } });
                return false;
            }
        } else {
            if (formData.email === '') {
                setErrors({ ...errors, email: { error: true, message: 'Моля попълнете Имейл' } });
                return false;
            }
            if (formData.password === '') {
                setErrors({ ...errors, password: { error: true, message: 'Моля попълнете Парола' } });
                return false;
            }
        }

        return true;
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ confirmPassword: { error: false, message: '' }, email: { error: false, message: '' }, firstName: { error: false, message: '' }, lastName: { error: false, message: '' }, password: { error: false, message: '' } });
    };
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setErrors({ confirmPassword: { error: false, message: '' }, email: { error: false, message: '' }, firstName: { error: false, message: '' }, lastName: { error: false, message: '' }, password: { error: false, message: '' } });
        setShowPassword(false);
    };
    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type: 'AUTH', data: { result, token } });
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };
    const googleFailure = (error) => {
        console.log(error);
    };
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon></LockOutlinedIcon>
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        { isSignup && (
                            <>
                                <Input error={errors.firstName.error} helperText={errors.firstName.message} name="firstName" label="Име" handleChange={handleChange} autoFocus half></Input>
                                <Input error={errors.lastName.error} helperText={errors.lastName.message} name="lastName" label="Фамилия" handleChange={handleChange} half></Input>
                            </>
                        )}
                        <Input error={errors.email.error} helperText={errors.email.message} name="email" label="Имейл" handleChange={handleChange} type="email"/>
                        <Input error={errors.password.error} helperText={errors.password.message} name="password" label="Парола" handleChange={handleChange} type={ showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword}/>
                        { isSignup && <Input error={errors.confirmPassword.error} helperText={errors.confirmPassword.message} name="confirmPassword" label="Повтори Парола" handleChange={handleChange} type="password"/>}
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        { isSignup ? 'Sign Up' : 'Sign In'}
                    </Button>
                    <GoogleLogin
                        clientId="686806189940-oqnb6bggur0ij0ob9lt1jh9tt5785ph8.apps.googleusercontent.com"
                        render={(renderProps) => (
                            <Button
                                className={classes.googleButton}
                                color='primary'
                                fullWidth
                                onClick={renderProps.onClick}
                                disabled={renderProps.disabled}
                                startIcon={<Icon />}
                                variant='contained'>
                                Google Sign In
                            </Button>
                        )}
                        onSuccess={googleSuccess}
                        onFailure={googleFailure}
                        cookiePolicy="single_host_origin"
                    />
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button variant="contained" color="secondary" onClick={switchMode}>
                                {isSignup ? 'Sign In' : 'Sign Up'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    );
};

export default Auth;
