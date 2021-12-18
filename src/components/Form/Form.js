import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Paper, Grid, CircularProgress } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FileBase from 'react-file-base64';
import FileInputComponent from 'react-file-input-previews-base64';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import { createPost, updatePost, getPost } from '../../actions/posts';

import { useNavigate, useParams } from 'react-router-dom';
import { cities } from './cities';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

export default function Form ({ currentId, setCurrentId }) {
    const cityNames = cities;
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [hide, setHide] = useState(user?.result?.towns.length > 0);
    const [checked, setChecked] = useState(false);
    const [towns, setTowns] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '', telephone: '' });
    const post = useSelector((state) => state.posts.post);
    const { isLoading } = useSelector((state) => state.posts);
    const classes = useStyles();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    console.log(isLoading);
    useEffect(() => {
        if (id !== undefined) {
            dispatch(getPost(id));
        }
    }, [id]);
    useEffect(() => {
        if (id === undefined) {
            console.log(user);
            setPostData({ ...postData, title: '', message: '', tags: user?.result?.towns, selectedFile: '', telephone: user?.result?.telephone });
            setChecked(user?.result?.towns.length > 0);
        }
    }, [user]);

    useEffect(() => {
        console.log(post);
        if (id !== undefined) {
            setChecked(post?.tags?.length > 0);
            setPostData(post);
            setTowns(post?.tags);
            setSelectedFile(post?.selectedFile);
        }
    }, [post]);

    const setTabs = () => {
        console.log('INITIAL CHECK VALUE: ', checked);
        if (checked === false) {
            setChecked(true);
        } else {
            setChecked(false);
            setPostData({ ...postData, tags: [] });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ ...postData });
        if (!id) {
            dispatch(createPost({ ...postData, name: user?.result?.name, creator_id: user?.result?._id }, navigate));
        } else {
            dispatch(updatePost(id, { ...postData, name: user?.result?.name }, navigate));
        }
        clear();
    };

    if (!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Моля впишете се за да създадете обява
                </Typography>
            </Paper>
        );
    }

    const clear = () => {
        setCurrentId(0);
        setPostData({ title: '', message: '', tags: [], selectedFile: '', telephone: '' });
    };

    const onTagsChange = (event, values) => {
        setPostData({ ...postData, tags: values.map((c) => { return c.title; }) });
        console.log(postData);
    };
    const imageContainerStyle = { display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'nowrap' };
    const imageStyle = { marginTop: 5, marginBottom: 5, marginRight: 5, width: '200px', height: '200px', boxShadow: 'rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px' };

    const getDefaultValues = () => {
        return postData.tags.map((title) => ({ title }));
    };

    const removePicture = () => {
        setSelectedFile(null);
        setPostData({ ...postData, selectedFile: '' });
    };
    const addPicture = () => {
        console.log('addPic');
        setSelectedFile(post?.selectedFile ? post?.selectedFile : 'aaa');
        setPostData({ ...postData, selectedFile: post?.selectedFile });
    };

    const resizeImage = (base64Str, maxWidth = 250, maxHeight = 250) => {
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

    if (isLoading) {
        return <Paper className={classes.loadingPaper}>
            <CircularProgress size="7em"/>
        </Paper>;
    }
    return (
        <Container component="main" maxWidth="md">
            <Paper className={classes.paper} elevation={6}>
                <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                    <Typography variant="h6">{id ? 'Промяна' : 'Създаване' } на обява</Typography>
                    <TextField name="title" variant="outlined" label="Продукт" fullWidth value={postData?.title || ''} onChange={ (e) => setPostData({ ...postData, title: e.target.value })} />
                    <TextField name="message" variant="outlined" label="Описание" fullWidth value={postData?.message || ''} onChange={ (e) => setPostData({ ...postData, message: e.target.value })} />
                    <TextField name="telephone" variant="outlined" label="Телефон" fullWidth value={postData?.telephone || ''} onChange={ (e) => setPostData({ ...postData, telephone: e.target.value })} />
                    <FormControlLabel
                        control={<Checkbox name="checkedA" checked={ checked } onChange={ (e) => {
                            setHide((oldState) => !oldState);
                            setTabs();
                        }}/>}
                        label="Доставка до адрес"
                    />
                    {hide && (
                        (<div id="auto">
                            { !id &&
                (<Autocomplete
                    multiple
                    id="combo-box-demo1"
                    options={cityNames}
                    getOptionSelected={(option, value) => option.title === value.title}
                    getOptionLabel={(option) => option.title}
                    onChange={ onTagsChange }
                    defaultValue={ user?.result?.towns.map((title) => ({ title })) }
                    renderInput={(params) => <TextField {...params} label="Градове за доставка" variant="outlined" />}
                />)
                            }
                            { towns?.length > 0 &&
                (<Autocomplete
                    multiple
                    id="combo-box-demo2"
                    options={cityNames}
                    getOptionSelected={(option, value) => option.title === value.title}
                    getOptionLabel={(option) => option.title}
                    onChange={ onTagsChange }
                    defaultValue={ post?.tags?.map((title) => ({ title })) }
                    renderInput={(params) => <TextField {...params} label="Градове за доставка" variant="outlined" />}
                />)
                            }
                            { (towns?.length === 0 && id) &&
                (<Autocomplete
                    multiple
                    id="combo-box-demo3"
                    options={cityNames}
                    getOptionSelected={(option, value) => option.title === value.title}
                    getOptionLabel={(option) => option.title}
                    onChange={ onTagsChange }
                    renderInput={(params) => <TextField {...params} label="Градове за доставка" variant="outlined" />}
                />)
                            }
                        </div>)
                    ) }
                    <Grid container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justifyContent="center">

                        { selectedFile && (
                            <div className={classes.fileInput}>
                                <FileInputComponent
                                    label = "Снимка на продукта"
                                    multiple={false}
                                    defaultFiles={[selectedFile] || []}
                                    callbackFunction={({ base64 }) => resizeImage(base64).then((r) => setPostData({ ...postData, selectedFile: r })) }
                                    accept="image/*"
                                    buttonComponent={<Button variant="contained" color="primary" className={classes.submit}>
                                         ИЗБЕРИ СНИМКА
                                    </Button>
                                    }
                                    imageContainerStyle = {imageContainerStyle}
                                    imageStyle = {imageStyle}
                                />
                            </div>
                        )}
                        <div className={classes.buttonSubmit}>
                            <Button variant="contained" color={ selectedFile ? 'secondary' : 'primary' } className={classes.submit} onClick={ selectedFile ? removePicture : addPicture }>
                                { selectedFile ? 'ПРЕМАХНИ СНИМКАТА' : 'СЛОЖИ СНИМКА'}
                            </Button>
                        </div>
                    </Grid>
                    <div className={classes.submitButtons}>
                        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth >Публикувай</Button>
                        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth >Изчисти</Button>
                    </div>
                </form>
            </Paper>
        </Container>
    );
}
