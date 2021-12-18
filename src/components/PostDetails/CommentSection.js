import React, { useState, useRef } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { commentPost } from '../../actions/posts';
import useStyles from './styles';

const CommentSection = ({ post }) => {
    const classes = useStyles();
    const [comments, setComments] = useState(post?.comments);
    const [comment, setComment] = useState('');
    const user = JSON.parse(localStorage.getItem('profile'));
    const dispatch = useDispatch();
    const commentsRef = useRef();

    const sendComment = async () => {
        const finalComment = `${user.result.name}: ${comment}`;
        const newComments = await dispatch(commentPost(finalComment, post._id));
        setComments(newComments);
        setComment('');

        commentsRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={classes.commentsOuterContainer}>
            <div className={classes.commentsInnerContainer}>
                <Typography gutterBottom variant="h6">
                Коментари
                </Typography>
                {comments.map((c, i) => (
                    <Typography key={i} gutterBottom variant="subtitle1">
                        <strong>{c.split(': ')[0]}</strong>
                        {c.split(':')[1]}
                    </Typography>
                ))}
                <div ref={commentsRef} />
            </div>
            {user?.result?.name && (
                <div style = {{ width: '70%' }}>
                    <Typography gutterBottom variant="h6">
                Напиши коментар
                    </Typography>
                    <TextField
                        fullWidth
                        rows={4}
                        variant="outlined"
                        label="Коментар"
                        multiline
                        value={comment}
                        onChange= {(e) => setComment(e.target.value)}
                    />
                    <Button fullWidth style={{ marginTop: '10px' }} disabled={!comment} variant="contained" onClick={sendComment} color="primary">
                Изпрати
                    </Button>
                </div>)}
        </div>
    );
};

export default CommentSection;
