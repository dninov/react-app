import { CLEAR_POST, FETCH_POST, START_LOADING, END_LOADING, FETCH_BY_SEARCH, FETCH_ALL, CREATE, DELETE, LIKE, UPDATE } from '../constants/actionTypes';

export default (state = { isLoading: true, posts: [] }, action) => {
    switch (action.type) {
    case START_LOADING:
        return { ...state, isLoading: true };
    case END_LOADING:
        return { ...state, isLoading: false };
    case FETCH_ALL:
        return {
            ...state,
            posts: action.payload.data,
            currentPage: action.payload.currentPage,
            numberOfPages: action.payload.NumberOfPages
        };
    case FETCH_POST: return { ...state, post: action.payload };
    case CLEAR_POST: return { ...state, post: {} };
    case FETCH_BY_SEARCH: return {
        ...state,
        posts: action.payload.data,
        currentPage: action.payload.currentPage,
        numberOfPages: action.payload.NumberOfPages
    };
    case DELETE:
        return { ...state, posts: state.posts.filter((post) => post._id !== action.payload) };
    case LIKE:
    case UPDATE:
        return { ...state, posts: state.posts.map((post) => post._id === action.payload._id ? action.payload : post) };

    case CREATE:
        return { ...state, posts: [...state.posts, action.payload] };

    default:
        return state;
    }
};
