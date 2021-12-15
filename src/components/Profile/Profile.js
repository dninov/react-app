import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile, deleteProfile } from '../../actions/auth';
import { deleteAllPosts } from '../../actions/posts';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button, Paper, Grid, Typography, Container, TextField, Modal, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { cities } from '../Form/cities';
import Input from '../Auth/Input';
import useStyles from './styles';
import FileInputComponent from 'react-file-input-previews-base64';
import profileImg from '../../images/profile.jpg';

function Profile () {
    const cityNames = cities;
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [showPassword, setShowPassword] = useState(false);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const initialState = { firstName: user.result.name.split(' ')[0], lastName: user.result.name.split(' ')[1], email: user.result.email, telephone: user.result.telephone, avatar: '', towns: user.result.towns };
    const [formData, setFormData] = useState(initialState);
    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateProfile(user.result._id, formData, navigate)).then(() => {
            setUser(JSON.parse(localStorage.getItem('profile')));
        });
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    useEffect(() => {
        setFormData({ firstName: user.result.name.split(' ')[0], lastName: user.result.name.split(' ')[1], email: user.result.email, telephone: user.result.telephone, avatar: '', towns: user.result.towns });
    }, [user]);
    const onTagsChange = (event, values) => {
        setFormData({ ...formData, towns: values.map((c) => { return c.title; }) });
    };
    const getDefaultValues = () => {
        return user.result.towns.map((title) => ({ title }));
    };
    const imageContainerStyle = { display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'nowrap', justifyContent: 'center' };
    const imageStyle = { borderRadius: '50%', marginTop: 5, marginBottom: 5, marginRight: 5, width: '200px', height: '200px', boxShadow: 'rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px' };
    const resizeImage = (base64Str, maxWidth = 80, maxHeight = 80) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = base64Str;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = maxWidth;
                const MAX_HEIGHT = maxHeight;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL());
            };
        });
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const deleteAccount = () => {
        const id = user.result._id;
        dispatch(deleteProfile(id, navigate));
        dispatch(deleteAllPosts(id));
    };
    return (
        <Container component="main" maxWidth="md">
            <Paper className={classes.paper} elevation={3}>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center">
                        <div className={classes.fileInput}>
                            <FileInputComponent
                                labelText="Избери снимка"
                                labelStyle={{ fontSize: 14 }}
                                multiple={false}
                                defaultFiles={user?.result?.avatar ? [user?.result?.avatar] : [profileImg]}
                                callbackFunction={({ base64 }) => resizeImage(base64).then((r) => setFormData({ ...formData, avatar: r })) }
                                accept="image/*"
                                buttonComponent={<Button variant="contained" color="primary" className={classes.submit}>
                                         КАЧИ
                                </Button>}
                                imageContainerStyle = {imageContainerStyle}
                                imageStyle = {imageStyle}
                            />
                        </div>
                    </Grid>
                    <Grid container spacing={2}>

                        <Input name="firstName" label="Име" defaultValue={user?.result?.name.split(' ')[0]} handleChange={handleChange} half></Input>
                        <Input name="lastName" label="Фамилия" defaultValue={user?.result?.name.split(' ')[1]} handleChange={handleChange} half></Input>
                        <Input name="email" label="Имейл" defaultValue={user?.result?.email} handleChange={handleChange} type="email"/>
                        <Input name="telephone" label="Телефон" defaultValue={user?.result?.telephone} handleChange={handleChange} />
                        <Grid item xs={12} sm={12}>
                            <Autocomplete
                                multiple
                                id="combo-box-demo"
                                options={cityNames}
                                getOptionSelected={(option, value) => option.title === value.title}
                                getOptionLabel={(option) => option.title}
                                onChange={onTagsChange}
                                defaultValue={ getDefaultValues }
                                renderInput={(params) => <TextField {...params} label="Градове за доставка" variant="outlined" />}
                            />
                        </Grid>

                    </Grid>
                    <Grid container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center">
                        <Button type="submit" variant="contained" color="primary" className={classes.submit}>
                        ЗАПАЗИ
                        </Button>
                        <Button variant="contained" color="secondary" className={classes.submit} onClick={ handleClickOpen }>
                        ИЗТРИЙ АКАУНТА
                        </Button>
                    </Grid>

                </form>
            </Paper>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'НАИСТИНА ЛИ ИСКАТЕ ДА ИЗТРИЕТЕ АКАУНТА СИ?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
            С това действие ще изтриете всички обяви, които сте създали!
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
            НЕ ИЗТРИВАЙ
                    </Button>
                    <Button onClick={deleteAccount} color="secondary" autoFocus>
            ИЗТРИЙ
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Profile;
