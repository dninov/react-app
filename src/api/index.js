import axios from 'axios';

const API = axios.create({ baseURL: 'https://selo-market.herokuapp.com/' });
// const API = axios.create({ baseURL: 'http://localhost:5000/' });

API.interceptors.request.use((req) => {
    if (localStorage.getItem('profile')) {
        req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
    }

    return req;
});

export const fetchPost = (id) => API.get(`/posts/${id}`);
export const fetchPosts = (page) => API.get(`/posts?page=${page}`);
export const getPostsBySearch = (searchQuery) => API.get(`/posts/search?searchQuery=${searchQuery.searchQuery || 'none'}&tags=${searchQuery.tags}&page=${searchQuery.page}`);
export const createPost = (newPost) => API.post('/posts', newPost);
export const likePost = (id) => API.patch(`/posts/${id}/likePost`);
export const updatePost = (id, updatedPost) => API.patch(`/posts/${id}`, updatedPost);
export const deletePost = (id) => API.delete(`/posts/${id}`);
export const deleteAllPosts = (id) => API.delete(`/posts/all/${id}`);
export const comment = (value, id) => API.post(`/posts/${id}/commentPost`, { value });

export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);
export const updateProfile = (id, formData) => API.patch(`/user/update/${id}`, formData);
export const deleteProfile = (id) => API.delete(`/user/${id}`);
