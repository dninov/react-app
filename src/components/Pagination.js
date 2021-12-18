import React, { useEffect, useState } from 'react';
import { Pagination, PaginationItem } from '@material-ui/lab';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts, getPostsBySearch } from '../actions/posts';
import useStyles from './styles';
import { useNavigate, useLocation, useSearchParams } from 'react-router';

function useQuery () {
    return new URLSearchParams(useLocation().search);
}

const Paginate = ({ page, isSearch }) => {
    const { numberOfPages, search } = useSelector((state) => state.posts);
    const classes = useStyles();
    const dispatch = useDispatch();
    const query = useQuery();
    const searchQuery = query.get('searchQuery');
    const tags = query.get('tags');
    const [searchS, setSearch] = useState(searchQuery);
    const [tagsS, setTags] = useState(tags);

    useEffect(() => {
        if (page && searchQuery === null) {
            dispatch(getPosts(page));
        } else {
            dispatch(getPostsBySearch({ page: page, searchQuery: searchQuery, tags: tags }));
        }
    }, [dispatch, page, tagsS, searchS, isSearch]);

    return (
        <Pagination
            classes={{ ul: classes.ul }}
            count={numberOfPages}
            page={Number(page) || 1}
            variant="outlined"
            color="primary"
            renderItem={(item) => (
                isSearch
                    ? <PaginationItem { ...item} component={Link} to={`/posts/search?searchQuery=${searchQuery || 'none'}&tags=${tags}&page=${item.page}`}/>
                    : <PaginationItem { ...item} component={Link} to={`/posts?page=${item.page}`}/>
            )}
        />
    );
};
export default Paginate;
