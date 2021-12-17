import React, { useEffect } from 'react';
import { Typography, Paper, CircularProgress, Divider, Grid } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, getPostsBySearch } from '../../actions/posts';
import useStyles from './styles';

const PostDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const classes = useStyles();
    const post = useSelector((state) => state.posts.post);
    const { posts } = useSelector((state) => state.posts);
    const { isLoading } = useSelector((state) => state.posts);
    const { id } = useParams();
    console.log(post);
    useEffect(() => {
        dispatch(getPost(id));
    }, [id]);

    useEffect(() => {
        if (post) {
            console.log(post?.tags);
            dispatch(getPostsBySearch({ searchQuery: 'none', tags: post?.tags?.join(','), page: 1 }));
        }
    }, [post]);

    if (!post) return null;

    if (isLoading || Object.keys(post).length === 0) {
        return <Paper className={classes.loadingPaper}>
            <CircularProgress size="7em"/>
        </Paper>;
    }
    const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);

    const openPost = (_id) => navigate(`/posts/${_id}`);

    return (
        <Paper style={{ padding: '20px', borderRadius: '15px' }} elevation={6}>
            <Grid container className={classes.card}>
                <Grid item md={6} xs={12}>
                    <div className={classes.section}>
                        <Typography variant="h3" component="h2">{post.title}</Typography>
                        <Typography gutterBottom variant="h6" color="textSecondary" component="h2">{post?.tags?.length > 0 ? 'Доставя до ' + post.tags.map((tag) => ` ${tag} `) : 'Изпраща по куриер' }</Typography>
                        <Typography gutterBottom variant="body1" component="p">{post.message}</Typography>
                        <Typography variant="h6">Обява от: {post.name}</Typography>
                        <Typography gutterBottom variant="body1" color="textSecondary" component="p">Телефон: {post.telephone}</Typography>
                        <Typography variant="body1">{moment(post.createdAt).fromNow()}</Typography>
                    </div>
                </Grid>
                <Grid item md={6} xs={12}>
                    <div className={classes.imageSection}>
                        <img className={classes.media} src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt={post.title} />
                    </div>
                </Grid>
            </Grid>
            {recommendedPosts.length && (
                <div className={classes.section}>
                    <Typography gutterBottom variant="h5">Други продукти за региона:</Typography>
                    <Divider />
                    <div className={classes.recommendedPosts}>
                        {recommendedPosts.map(({ title, message, name, likes, selectedFile, _id }) => (
                            <div style={{ margin: '20px', cursor: 'pointer' }} onClick={() => openPost(_id)} key={_id} >
                                <Typography gutterBottom variant="h6">{title}</Typography>
                                <Typography gutterBottom variant="subtitle2">{name}</Typography>
                                <Typography gutterBottom variant="subtitle2">{message}</Typography>
                                <Typography gutterBottom variant="subtitle1">Likes: {likes.length}</Typography>
                                <img src={selectedFile} width="200px"/>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </Paper>
    );
};

export default PostDetails;
