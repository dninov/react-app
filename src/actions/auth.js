import { AUTH, DELETE } from '../constants/actionTypes';
import * as api from '../api/index.js';

export const signin = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signIn(formData);

        dispatch({ type: AUTH, data });

        navigate('/');
    } catch (error) {
        console.log(error);
    }
};

export const signup = (formData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.signUp(formData);
        console.log(data.result._id);
        dispatch({ type: AUTH, data });

        navigate(`/profile/${data.result._id}`);
    } catch (error) {
        console.log(error);
    }
};

export const updateProfile = (id, userData, navigate) => async (dispatch) => {
    try {
        const { data } = await api.updateProfile(id, userData);
        console.log({ data });
        dispatch({ type: AUTH, data });
        navigate(`/profile/${id}`);
    } catch (error) {
        console.log(error);
    }
};

export const deleteProfile = (id, navigate) => async (dispatch) => {
    try {
        await api.deleteProfile(id);
        dispatch({ type: DELETE, payload: id });
        localStorage.removeItem('profile');
        navigate('/');
    } catch (error) {
        console.log(error);
    }
};
