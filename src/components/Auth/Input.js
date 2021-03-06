import React from 'react';
import { TextField, Grid, InputAdornment, IconButton } from '@material-ui/core';
import Visability from '@material-ui/icons/Visibility';
import VisabilityOff from '@material-ui/icons/VisibilityOff';

const Input = ({ error, helperText, name, handleChange, half, label, autoFocus, type, handleShowPassword, defaultValue, required }) => {
    return (
        <Grid item xs={12} sm={half ? 6 : 12}>
            <TextField
                name={name}
                onChange={handleChange}
                variant="outlined"
                required={required}
                fullWidth
                defaultValue={defaultValue}
                label={label}
                autoFocus={autoFocus}
                type={type}
                helperText={helperText}
                error={error}
                InputProps={name === 'password'
                    ? {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleShowPassword}>
                                    {type === 'password' ? <Visability/> : <VisabilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                    : null}
            />
        </Grid>
    );
};

export default Input;
