import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideError } from '../store/error';
import { hideSuccess } from '../store/success';

const MazeRow = () => {

    const dispatch = useDispatch();

    // The error message being displayed in the red snackbar
    const errorMessage = useSelector(state => state.error.message)

    // boolean to determine visibility of red snackbar
    const displayError = useSelector(state => state.error.displayError)

    // The success message being displayed in the green snackbar
    const successMessage = useSelector(state => state.success.message)

    // boolean to determine visibility of green snackbar
    const displaySuccess = useSelector(state => state.success.displaySuccess)

    return (
        <>
            <Snackbar // red snackbar for displaying errors
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={displayError}
                autoHideDuration={5000}
                onClose={() => dispatch(hideError())}
                key={'bottom' + 'center'}
            >
                <Alert severity='error'>{errorMessage}</Alert>
            </Snackbar>
            <Snackbar // green snackbar for displaying success feedback
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={displaySuccess}
                autoHideDuration={5000}
                onClose={() => dispatch(hideSuccess())}
                key={'bottom' + 'center'}
            >
                <Alert severity='success'>{successMessage}</Alert>
            </Snackbar>
        </>
    );
}

export default MazeRow;