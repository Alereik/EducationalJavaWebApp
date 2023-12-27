import React, { useEffect, useState } from 'react';
import MazeDisplay from '../components/MazeDisplay';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Radio from '@mui/material/Radio';
import InputLabel from '@mui/material/InputLabel';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Fab from '@mui/material/Fab';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RadioGroup from '@mui/material/RadioGroup';
import { useDispatch, useSelector } from 'react-redux';
import { createMaze, deleteMaze, updateMaze } from '../store/mazes'
import { showError } from '../store/error'
import MenuBar from '../components/MenuBar';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Messenger from '../components/Messenger';

const AdminEditMaze = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Global states for the current maze and mazeId being editted
    const currentMazeId = useSelector(state => state.mazes.currentMazeId)
    const currentMazeLayout = useSelector(state => state.mazes.currentMazeLayout)

    // the maze being editted
    const [mazeArray, setMazeArray] = useState(JSON.parse(JSON.stringify(currentMazeLayout)));

    // the dimensions of the maze (Size x Size)
    const [size, setSize] = useState(currentMazeLayout.length);

    // boolean to determine clickability of size adjustment buttons
    const [disableSizeEdit, setDisableSizeEdit] = useState(false);

    // signifies what color a grid should change to when clicked
    const [editType, setEditType] = useState(0)

    /**
     * This method runs whenever the local maze is updated by the user. The method then
     * updates the size of the array and allows for further size editting.
     */
    useEffect(() => {
        setSize(mazeArray.length)
        setDisableSizeEdit(false)
    }, [mazeArray])

    /**
     * This method runs after an API call updates the current maze. The method
     * then updates the local state array to match the new one.
     */
    useEffect(() => {
        if (currentMazeId === null) {
            navigate('/adminHome')
            return;
        }
        setMazeArray(JSON.parse(JSON.stringify(currentMazeLayout)))
    }, [currentMazeLayout])

    /**
     * Updates editType with the value selected in the radio group.
     * 
     * @param {*} event 
     * @param {*} newValue - the new value for editType to be set to
     */
    const handleEditTypeChange = (event, newValue) => {
        setEditType(newValue);
    }

    /**
     * Sets the mazeArray to all 0's.
     */
    const clearMaze = () => {
        let newMaze = [...mazeArray]
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                newMaze[i][j] = 0;
            }
        }
        setMazeArray(newMaze);
    }

    /**
     * Calls the API to save the maze. If the mazeId is not -1, call the update
     * API. Otherwise, call the create API.
     */
    const handleSaveMaze = () => {
        if (currentMazeId >= 0) {
            dispatch(updateMaze(mazeArray, currentMazeId));
        } else if (currentMazeId === -1) {
            dispatch(createMaze(mazeArray));
        }
    }

    /**
     * Deletes the current maze from the database. If the maze is a new maze being 
     * created, simply navigate back to the homepage.
     */
    const handleDeleteMaze = () => {
        if (currentMazeId === -1) {
            navigate('/adminHome')
        }
        else if (currentMazeId) {
            dispatch(deleteMaze(currentMazeId));
        }
    }

    /**
     * When a user clicks on a grid, set that grid's value to the desired editType
     */
    const handleGridClick = (x, y) => {
        if (mazeArray[x][y] === parseInt(editType)) {
            let newLayoutArray = [...mazeArray];
            newLayoutArray[x][y] = 0;
            setMazeArray(newLayoutArray);
            return;
        }
        else if (
            (editType === '2' && startExists()) ||
            (editType === '3' && finishExists())
        ) {
            if (editType === '2' && startExists()) {
                dispatch(showError("This maze already has a start position."))
            } else {
                dispatch(showError("This maze already has a finish position."))
            }
            return;
        }
        let newLayoutArray = [...mazeArray];
        newLayoutArray[x][y] = parseInt(editType);
        setMazeArray(newLayoutArray);
    }

    /**
     * Appens 0's to every row in the maze and creates a new row of all 0's
     * to maintain its equal width and height.
     */
    const handleSizeIncrease = () => {
        if (size < 15) {
            setDisableSizeEdit(true)
            let newLayoutArray = [...mazeArray];
            for (let i = 0; i < size; i++) {
                newLayoutArray[i].push(0)
            }
            newLayoutArray.push([0]);
            for (let i = 0; i < size; i++) {
                newLayoutArray[size].push(0)
            }
            setMazeArray(newLayoutArray)
        } else {
            dispatch(showError("Mazes cannot be larger than 15x15."))
        }
    }

    /**
     * Removes the last index of each maze row and removes the last row
     * to maintain its equal width and height.
     */
    const handleSizeDecrease = () => {
        if (size > 2) {
            setDisableSizeEdit(true)
            let newLayoutArray = [...mazeArray];
            for (let i = 0; i < size; i++) {
                newLayoutArray[i].splice(size - 1, 1)
            }
            newLayoutArray.splice(size - 1, 1);
            setMazeArray(newLayoutArray)
        } else {
            dispatch(showError("Mazes cannot be smaller than 2x2."))
        }
    }

    /**
     * Check if a start position exists in the maze.
     * @returns true if a start position exists, else false
     */
    const startExists = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (mazeArray[i][j] === 2) {
                    return true
                }
            }
        }
        return false
    }
    /**
     * Check if a finish position exists in the maze.
     * @returns true if a finish position exists, else false
     */
    const finishExists = () => {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (mazeArray[i][j] === 3) {
                    return true
                }
            }
        }
        return false
    }

    return (
        <>
            <MenuBar></MenuBar>
            <div style={{ // contains the entire page
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-60%, -50%)',
                display: 'flex',
                justifyContent: 'center',
                flexFlow: 'column'
            }}>
                <div style={{ // contains the edit boxes and maze
                    display: 'flex',
                    flexFlow: 'row',
                    marginBottom: '20px'
                }}>
                    <Card
                        sx={{
                            width: 200,
                            height: 350,
                            marginRight: '80px'
                        }}
                        variant='outlined'
                    >
                        <CardContent>
                            <InputLabel>Dimensions: {size}x{size}</InputLabel>
                            <Fab
                                disabled={disableSizeEdit}
                                color="primary"
                                onClick={handleSizeIncrease}
                                style={{
                                    marginRight: '10px',
                                    marginBottom: '10px'
                                }}
                            >
                                <ArrowUpwardIcon />
                            </Fab>
                            <Fab
                                disabled={disableSizeEdit}
                                color="primary"
                                onClick={handleSizeDecrease}
                                style={{ marginBottom: '10px' }}
                            >
                                <ArrowDownwardIcon />
                            </Fab>
                            <InputLabel>Grid Type</InputLabel>
                            <RadioGroup
                                value={editType}
                                onChange={handleEditTypeChange}
                                style={{ marginBottom: '5px' }}
                            >
                                <FormControlLabel value={0} control={<Radio />} label="Pathway" />
                                <FormControlLabel value={1} control={<Radio />} label="Wall" />
                                <FormControlLabel value={2} control={<Radio />} label="Start" />
                                <FormControlLabel value={3} control={<Radio />} label="Finish" />
                            </RadioGroup>
                            <Button variant="outlined" onClick={clearMaze}>Clear</Button>
                        </CardContent>
                    </Card>
                    <MazeDisplay
                        size={350}
                        editMode={true}
                        attemptMode={false}
                        onGridClick={handleGridClick}
                        layoutArray={mazeArray}
                    ></MazeDisplay>
                </div>
                <div style={{ // contains the save and delete buttons
                    width: '200px' }}>
                    <Button onClick={handleSaveMaze} variant="contained">Save</Button>
                    <Button
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteMaze}
                        style={{ right: "-10%" }}
                        variant="outlined"
                        color="error"
                    >Delete</Button>
                </div>
            </div>
            <Messenger></Messenger>
        </>
    );
}

export default AdminEditMaze;