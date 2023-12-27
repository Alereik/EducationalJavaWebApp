import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/account';
import { clearMazes, clearCurrMaze } from '../store/mazes'
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
import { clearMazeAttempts } from '../store/mazeAttempts';

const MenuBar = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // the account being stored globally in the app - if null, log out
    const account = useSelector(state => state.account)

    /**
     * This method runs whenever the global account object is modified. The
     * method navigates to the login page if the account has been cleared.
     */
    useEffect(() => {
        if (!account.username) {
            navigate('/')
        }
    }, [account])

    // Clears the global states for mazes and account
    const handleLogOut = async () => {
        dispatch(clearMazes());
        dispatch(clearCurrMaze());
        dispatch(logout());
        dispatch(clearMazeAttempts());
    }

    // navigates the user to their home page
    const homeNavigate = () => {
        if (account.isAdmin) {
            navigate('/adminHome')
        } else {
            navigate('/homepage')
        }
    }

    return (
        <Box
            sx={{
                width: '100%',
                backgroundColor: 'primary.dark'
            }
            }
        >
            <AppBar position="static">
                <Toolbar>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                        fontFamily='Copperplate'
                        onClick={homeNavigate}
                    >LEARNING LABYRINTH</Typography>
                    <Button
                        onClick={handleLogOut}
                        style={{
                            width: '120px',
                            height: '30px',
                            marginBlock: '10px',
                            color: 'white'
                        }}
                    >Logout</Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default MenuBar;