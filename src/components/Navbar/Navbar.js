import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { AppBar, Avatar, Toolbar, Typography, Button } from '@material-ui/core';
import useStyles from './styles';
import logo from '../../images/logo.png';
import decode from 'jwt-decode';

function Navbar () {
    const classes = useStyles();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        setUser(null);
        navigate('/auth');
    };
    const create = () => {
        navigate('/create');
    };

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);
    return (
        <AppBar className = {classes.appBar} position="static" color="inherit">
            <div className={classes.brandContainer}>
                <NavLink to="/">
                    <img className = {classes.image} src={logo} alt="logo" height="70" />
                </NavLink>
            </div>
            <Toolbar className={classes.toolbar}>
                {user
                    ? (
                        <div className={classes.profile}>
                            <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                            <Typography className={classes.username} variant="h6">{user.result.name}</Typography>
                            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout} >ИЗХОД</Button>
                            <Button variant="contained" className={classes.logout} color="primary" onClick={create} >СЪЗДАЙ</Button>
                        </div>
                    )
                    : (
                        <Button component={Link} to="/auth" variant="contained" color="primary">ВХОД</Button>
                    )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
