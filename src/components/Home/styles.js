import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    appBarSearch: {
        backgroundColor: '#F6F6F6',
        borderRadius: 4,
        marginBottom: '1rem',
        display: 'flex',
        padding: '8px'
    },
    searchInput: {
        width: '100%'
    },
    searchButton: {
        marginTop: '10px',
        width: '120px',
        textAlign: 'center'
    },
    pagination: {
        borderRadius: 4,
        marginTop: '1rem',
        padding: '16px'
    },
    gridContainer: {
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column-reverse'
        }
    }
}));
