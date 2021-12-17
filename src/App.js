import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@material-ui/core';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import Create from './components/Create/Create';
import PostDetails from './components/PostDetails/PostDetails';
import Profile from './components/Profile/Profile';

const App = () => {
    const user = JSON.parse(localStorage.getItem('profile'));
    console.log(user);
    return (

        <BrowserRouter>
            <Container maxWidth = "xl">
                <Navbar />
                <Routes >
                    <Route path="/" element={<Navigate replace to="/posts" />} />
                    <Route path="/posts" element={<Home/>} />
                    <Route path="/posts/search" element={<Home/>} />
                    <Route path="/posts/:id" element={<PostDetails/>} />
                    <Route path="/create" element={<Create/>} />
                    <Route path="/edit/:id" element={<Create/>} />
                    {/* <Route path="/profile/:id" element={!user ? <Navigate replace to="/auth" /> : <Profile />} /> */}
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/auth" element={ <Auth />} />
                </Routes>
            </Container>
        </BrowserRouter>
    );
};
export default App;
