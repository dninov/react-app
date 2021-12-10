import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import FileInputComponent from 'react-file-input-previews-base64';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';
import { createPost, updatePost } from '../../actions/posts';
import { useNavigate } from 'react-router-dom';

export default function Form ({ currentId, setCurrentId }) {
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

    const imageContainerStyle = { display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'nowrap' };
    const imageStyle = { marginTop: 5, marginBottom: 5, marginRight: 5, width: '200px', height: '200px', boxShadow: 'rgba(0, 0, 0, 0.188235) 0px 10px 30px, rgba(0, 0, 0, 0.227451) 0px 6px 10px' };
    return (
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">{currentId ? 'Промяна' : 'Създаване' } на обява</Typography>
                <TextField name="title" variant="outlined" label="Продукт" fullWidth value={postData.title} onChange={ (e) => setPostData({ ...postData, title: e.target.value })} />
                <TextField name="message" variant="outlined" label="Описание" fullWidth value={postData.message} onChange={ (e) => setPostData({ ...postData, message: e.target.value })} />
                <TextField name="tags" variant="outlined" label="Град" fullWidth value={postData.tags} onChange={ (e) => setPostData({ ...postData, tags: e.target.value.split(',') })} />
                <div className={classes.fileInput}>
                    {/* <FileBase type="file" multiple={false} onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })} /> */}
                    <FileInputComponent
                        labelText="Избери снимка"
                        labelStyle={{ fontSize: 14 }}
                        multiple={false}
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
