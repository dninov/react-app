import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FileBase from 'react-file-base64';
import FileInputComponent from 'react-file-input-previews-base64';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';
import { useNavigate } from 'react-router-dom';
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
    const [hide, setHide] = useState(false);
    const [postData, setPostData] = useState({ title: '', message: '', tags: '', selectedFile: '' });
    const post = useSelector((state) => currentId ? state.posts.posts.find((post) => post._id === currentId) : null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const navigate = useNavigate();

    useEffect(() => {
        if (post) setPostData(post);
    }, [post]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (currentId !== 0) {
            dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
        } else {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
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
        setPostData({ title: '', message: '', tags: '', selectedFile: '' });
    };

    const onTagsChange = (event, values) => {
        setPostData({ ...postData, tags: values.map((c) => { return c.title; }) });
        console.log(postData);
    };
    const imageContainerStyle = { display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'nowrap' };
    const imageStyle = { marginTop: 5, marginBottom: 5, marginRight: 5, width: '200px', height: '200px', boxShadow: 'rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px' };
    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? 'Промяна' : 'Създаване' } на обява</Typography>
                <TextField name="title" variant="outlined" label="Продукт" fullWidth value={postData.title} onChange={ (e) => setPostData({ ...postData, title: e.target.value })} />
                <TextField name="message" variant="outlined" label="Описание" fullWidth value={postData.message} onChange={ (e) => setPostData({ ...postData, message: e.target.value })} />
                <FormControlLabel
                    control={<Checkbox name="checkedA" onChange={ (e) => { setHide((oldState) => !oldState); }}/>}
                    label="Доставка до адрес"
                />
                { hide &&
                (<Autocomplete
                    multiple
                    id="combo-box-demo"
                    options={cityNames}
                    getOptionLabel={(option) => option.title}
                    fullWidth
                    onChange={onTagsChange}
                    renderInput={(params) => <TextField {...params} label="Градове за доставка" variant="outlined" />}
                />)
                }

                <div className={classes.fileInput}>
                    <FileInputComponent
                        labelText="Избери снимка"
                        labelStyle={{ fontSize: 14 }}
                        multiple={false}
                        value={postData.tags}
                        callbackFunction={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })}
                        accept="image/*"
                        buttonComponent={<button style={{ marginLeft: '10px' }} type="button">Качи</button>}
                        imageContainerStyle = {imageContainerStyle}
                        imageStyle = {imageStyle}
                    />
                </div>
                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth >Публикувай</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth >Изчисти</Button>
            </form>
        </Paper>
    );
}
