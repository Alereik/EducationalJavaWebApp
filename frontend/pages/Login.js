import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import background from "../login.jpg";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Fab from '@mui/material/Fab';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, signup, loginWithToken } from '../store/account'
import Messenger from '../components/Messenger';

const Login = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Global account object, which is updated after a successful login
    const account = useSelector(state => state.account)

    // the type of user signing up (1 = admin, 0 = user)
    const [userType, setUserType] = React.useState(0);

    // the type of app access being attempted (0 = login, 1 = signup)
    const [accessType, setAccessType] = React.useState(0);

    // the username typed by the user
    const [username, setUsername] = React.useState('');

    // the password typed by the user
    const [password, setPassword] = React.useState('');

    /**
     * On page load, if a token is stored in the browser, attempt to login with that token
     */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            staySignedIn(token)
        }
    }, [])

    /**
     * When the global account changes, navigate to the corresponding homepage.
     */
    useEffect(() => {
        if (account.isAdmin !== null && account.isAdmin !== undefined) {
            if (account.isAdmin === true) {
                navigate('/adminHome')
            } else {
                navigate('/homepage')
            }
        }
    }, [account])

    /**
     * Sets the userType to the desired value.
     * 
     * @param {*} event 
     * @param {*} newValue - the new userType selected in the tabs
     */
    const handleUserTypeChange = (event, newValue) => {
        setUserType(newValue);
    };

    /**
     * Sets the accessType to the opposite of the current
     * selection.
     */
    const handleAccessTypeChange = () => {
        setAccessType((accessType + 1) % 2);
    };

    /**
     * Updates the username variable with the value typed in the textfield.
     * 
     * @param {*} event - the typing event made in the username textfield
     */
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    /**
     * Updates the password variable with the value typed in the textfield.
     * 
     * @param {*} event - the typing event made in the password textfield
     */
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    }

    /**
     * Calls the Login API with the username and password
     */
    const handleLogin = async () => {
        dispatch(login(username, password));
    }

    /**
     * Calls the Signup API with the username, password, and userType
     */
    const handleSignup = () => {
        dispatch(signup(username, password, userType === 1))
    }

    /**
     * Calls the login API with the token stored in the browser.
     */
    const staySignedIn = (token) => {
        dispatch(loginWithToken(token))
    }

    return (
        <div style={{ // contains the whole page
            backgroundImage: `url(${background})`,
            backgroundSize: 'cover',
            height: '100vh',
            width: '100vw',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <div style={{ // contains the login box
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                justifyContent: 'center'
            }}>
                {accessType === 0 && (
                    <h1 style={{
                        position: 'absolute',
                        top: '-70px'
                    }}
                    >Sign In</h1>
                )}
                {accessType === 1 && (
                    <h1 style={{
                        position: 'absolute',
                        top: '-70px'
                    }}
                    >Sign Up</h1>
                )}
                <Card 
                    sx={{ 
                        width: 446, 
                        height: 313, 
                        marginTop: '0px' 
                    }} 
                    variant='outlined'
                >
                    <CardContent>
                        <Box sx={{ width: '100%' }}>
                            {accessType === 1 && (
                                <Box sx={{ 
                                    borderBottom: 1, 
                                    borderColor: 'divider' }}
                                >
                                    <Tabs value={userType} onChange={handleUserTypeChange}>
                                        <Tab label="User" />
                                        <Tab label="Admin" />
                                    </Tabs>
                                </Box>
                            )}
                            {accessType === 0 && (
                                <Box sx={{ height: '49px' }}></Box>
                            )}
                            <Box sx={{ p: 3 }}>
                                <TextField
                                    value={username}
                                    onChange={handleUsernameChange}
                                    label="Username"
                                    variant="outlined"
                                    style={{ width: '100%', marginBottom: '20px' }}
                                />
                                <TextField
                                    value={password}
                                    onChange={handlePasswordChange}
                                    label="Password"
                                    type='password'
                                    variant="outlined"
                                    style={{ width: '100%', marginBottom: '5px' }}
                                />
                                {accessType === 0 && (
                                    <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center' }}
                                    >
                                        <Fab
                                            color='primary'
                                            variant="extended"
                                            style={{ width: '120px', height: '30px', marginBlock: '10px' }}
                                            onClick={handleLogin}
                                        >Sign In</Fab>
                                        <div>
                                            <span>Need an account? </span>
                                            <span
                                                onClick={handleAccessTypeChange}
                                                style={{ color: 'blue' }}
                                            >Click here.</span>
                                        </div>
                                    </div>
                                )}
                                {accessType === 1 && (
                                    <div style={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        alignItems: 'center' }}
                                    >
                                        <Fab
                                            color='primary'
                                            variant="extended"
                                            onClick={handleSignup}
                                            style={{ 
                                                width: '120px', 
                                                height: '30px', 
                                                marginBlock: '10px' 
                                            }}
                                        >Sign Up</Fab>
                                        <div>
                                            <span>Have an account? </span>
                                            <span
                                                onClick={handleAccessTypeChange}
                                                style={{ color: 'blue' }}
                                            >Click here.</span>
                                        </div>
                                    </div>
                                )}
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </div>
            <Messenger></Messenger>
        </div>
    );
}

export default Login;