import React, { useState, useEffect, useRef } from 'react';
import { Container, Grow, Grid, Paper, AppBar, TextField, Button, Toolbar } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useNavigate, useLocation } from 'react-router';
import Posts from '../Posts/Posts';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, getPostsBySearch, clearPost } from '../../actions/posts';
import useStyles from './styles';
import Pagination from '../Pagination';
import { cities } from '../Form/cities';

function useQuery () {
    return new URLSearchParams(useLocation().search);
}

function Home () {
    const cityNames = cities;
    const [currentId, setCurrentId] = useState(null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useQuery();
    const navigate = useNavigate();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');
    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const posts = useSelector((state) => state.posts);

    useEffect(() => {
        if (posts.post?._id) {
            dispatch(clearPost());
        }
    }, [posts]);
    const searchPost = () => {
        if (search.trim() || tags.length > 0) {
            setIsSearch(prevState => !prevState);
            // dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
            navigate(`/posts/search?searchQuery=${search || 'none'}&tags=${tags}`);
        } else {
            console.log('no search');
            dispatch(getPosts(page));
        }
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            searchPost();
        }
    };
    const handleAdd = (tag) => setTags([...tags, tag]);

    const handleDelete = (tagToDelete) => setTags(tags.filter((tag) => tag !== tagToDelete));
    const onTagsChange = (event, values) => {
        const newTags = values.map((c) => { return c.title; });
        if (newTags.length > 0) {
            setTags([newTags.join(',')]);
        } else {
            setTags([]);
        }
    };
    return (
        <Grow in>
            <Container maxWidth="xl" >
                <Paper elevation={6}>
                    <Grid container spacing={2} className={classes.appBarSearch}>
                        <Grid item lg={4} xs={12}>
                            <TextField className={classes.searchInput} edge="start" name="search" variant="outlined" label="Продукт" value={search} onChange={(e) => setSearch(e.target.value)} onKeyPress={handleKeyPress}/>
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <Autocomplete
                                className={classes.searchInput}
                                multiple
                                id="combo-box-demo"
                                options={cityNames}
                                getOptionSelected={(option, value) => option.title === value.title}
                                getOptionLabel={(option) => option.title}
                                onChange={ onTagsChange }
                                renderInput={(params) => <TextField {...params} label="Градове за доставка" variant="outlined" />}
                            />
                        </Grid>
                        {/* <ChipInput style={{ margin: '10px 0' }} value={tags} onAdd={handleAdd} onDelete={handleDelete} label="Град" variant="outlined"/> */}
                        <Grid item lg={4} xs={12}>
                            <Button className={classes.searchButton} onClick={searchPost} color="primary" variant="contained" >ТЪРСИ</Button>
                        </Grid>
                    </Grid>
                </Paper>

                <Grid className={classes.gridContainer} container justifyContent ="center" alignItems="center" spacing={3}>
                    <Grid item xs={12} sm={6} md={9}>
                        <Posts setCurrentId={setCurrentId} />
                    </Grid>

                </Grid>
                <Paper className={classes.pagination} elevation={6}>
                    <Grid container className={classes.paginationContainer} justifyContent ="center" alignItems="center" >
                        <Pagination page={page} isSearch={isSearch} />
                    </Grid>
                </Paper>
            </Container>
        </Grow>
    );
}

export default Home;
