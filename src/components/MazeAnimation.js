import React, { useEffect, useState } from 'react';
import { Directions } from '../enums/Directions.ts';
import robotPic from "../robotTopView.jpg";
import failPic from "../Fail.jpg";
import MazeDisplay from './MazeDisplay';
import { Movements } from '../enums/Movements.ts';
import { motion } from "framer-motion";
import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setFailMessage, setSuccessMessage } from '../store/mazeAttempts.js';
import { PlayArrow } from '@mui/icons-material';
import { showError } from '../store/error.js';

const MazeAnimation = ({
    widthInPixels = 350,
}) => {

    const dispatch = useDispatch();

    // the attempt currently being animated
    const currentAttempt = useSelector(state => state.mazeAttempts.currentAnimatedAttempt)

    // Global state storing the current maze layout being animated
    const mazeLayout = useSelector(state => state.mazes.currentMazeLayout)

    // the pixel width and height of each grid of the maze
    const gridSize = widthInPixels / mazeLayout.length;

    // the space (in pixels) between the robot and the grid walls
    const ROBOT_GRID_OFFSET = gridSize * .17;

    // the speed (in seconds) of each movement animation
    const MOVEMENT_SPEED = 3 / mazeLayout.length;

    // the speed (in seconds) of each movement animation
    const JUMP_TO_START_POSITION_SPEED = .0001;

    // the image representing the robot
    const [roboPic, setRoboPic] = useState(robotPic);

    // the speed (in seconds) the robot will perform each movement
    const [speed, setSpeed] = useState(JUMP_TO_START_POSITION_SPEED)

    // the index (in currentAttempt.movements) of the movement currently being animated
    const [currentMovementIndex, setCurrentMovementIndex] = useState(null)

    // stores the x and y coordinates of the robot in the maze
    const [currXPos, setCurrRobotXPos] = useState(0)
    const [currYPos, setCurrRobotYPos] = useState(0)

    // stores the robot's current rotation
    const [currRotation, setCurrRobotRotate] = useState(0)

    // stores the robot's current direction
    const [currDirection, setCurrDirection] = useState(null)

    // stores all the ids of the queued timeouts
    let timeouts = []

    // determines if the replay button should be clickable
    const [allowReplay, setAllowReplay] = useState(false)

    /**
     * This method runs whenever the currentAttempt is updated.
     * The method resets the robot's position. If the new attempt
     * is null, disable the play button.
     */
    useEffect(() => {
        resetRobotPosition();
        if (currentAttempt === null) {
            setAllowReplay(false)
        }
    }, [currentAttempt])

    /**
     * This function runs whenever currentMovementIndex is updated. If the index is valid
     * and the move list exists, call the handler for the new movement.
     */
    useEffect(() => {
        if (currentMovementIndex != null &&
            currentAttempt != null &&
            currentAttempt.movements != null &&
            currentAttempt.movements.length > 0) {
            setAllowReplay(true)
            handleRobotMovement(currentAttempt.movements[currentMovementIndex])
        }
    }, [currentMovementIndex])

    /**
     * This function runs whenever the robot's position or rotation have updated.
     * The function pauses for 1 second to allow for animation of the movement.
     * After the pause, iterate to the next movement.
     */
    useEffect(() => {
        if (currentMovementIndex !== null) {
            timeouts.push(setTimeout(() => {
                setCurrentMovementIndex(currentMovementIndex + 1)
            }, 1000 * MOVEMENT_SPEED))
        }
    }, [currXPos, currYPos, currRotation])

    /**
     * Resets the robot's position, then points
     * currentMovementIndex to the first movement in the current
     * attempt's movements list.
     */
    const beginAnimation = () => {
        resetRobotPosition();
        timeouts.push(setTimeout(() => {
            setSpeed(MOVEMENT_SPEED);
            setCurrentMovementIndex(0);
        }, 1000))
    }

    /**
     * Places the robot back in the start position of the maze and cancels
     * all currently queued movements.
     */
    const resetRobotPosition = () => {
        setAllowReplay(false)
        // stop the current movement loop by setting the current movement to null
        setCurrentMovementIndex(null)
        for (let i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i])
        }
        timeouts = []
        setSpeed(JUMP_TO_START_POSITION_SPEED)
        setRoboPic(robotPic)
        for (let y = 0; y < mazeLayout.length; y++) {
            for (let x = 0; x < mazeLayout.length; x++) {
                if (mazeLayout[y][x] === 2) {
                    setCurrRobotXPos((x * gridSize))
                    setCurrRobotYPos((y * gridSize))
                    setCurrRobotRotate(90)
                    setCurrDirection(Directions.RIGHT)
                    setAllowReplay(true)
                    return;
                }
            }
        }
    }

    /**
     * Calls the appropriate update function based on the current movement being animated.
     * 
     * @param movement - the new movement to be animated
     */
    const handleRobotMovement = (movement) => {
        switch (movement) {
            case Movements.FORWARD:
                moveForward();
                break;
            case Movements.BACKWARD:
                moveBackward();
                break;
            case Movements.ROTATE_LEFT:
                rotateLeft();
                break;
            case Movements.ROTATE_RIGHT:
                rotateRight();
                break;
            case Movements.SUCCESS:
                if (currentAttempt.id != null) {
                    dispatch(setSuccessMessage(currentAttempt.numMoves, currentAttempt.date, false))
                } else {
                    dispatch(setSuccessMessage(currentAttempt.numMoves, currentAttempt.date, true))
                }
                break;
            case Movements.FAILURE:
                setRoboPic(failPic);
                dispatch(setFailMessage(currentAttempt.numMoves, currentAttempt.date))
                break;
        }
    }

    /**
     * Updates the x or y position of the robot to move it in the direction
     * it is currently facing.
     */
    const moveForward = () => {
        switch (currDirection) {
            case Directions.UP:
                setCurrRobotYPos(currYPos - gridSize);
                break;
            case Directions.DOWN:
                setCurrRobotYPos(currYPos + gridSize);
                break;
            case Directions.LEFT:
                setCurrRobotXPos(currXPos - gridSize);
                break;
            case Directions.RIGHT:
                const newPos = currXPos + gridSize;
                setCurrRobotXPos(newPos);
                break;
        }
    }

    /**
     * Updates the x or y position of the robot to move it in the opposite direction
     * it is currently facing.
     */
    const moveBackward = () => {
        switch (currDirection) {
            case Directions.UP:
                setCurrRobotYPos(currYPos + gridSize)
                break;
            case Directions.DOWN:
                setCurrRobotYPos(currYPos - gridSize)
                break;
            case Directions.LEFT:
                setCurrRobotXPos(currXPos + gridSize)
                break;
            case Directions.RIGHT:
                setCurrRobotXPos(currXPos - gridSize)
                break;
        }
    }

    /**
     * Increments the rotation angle by 90 degrees and updates the current direction the 
     * robot is facing.
     */
    const rotateRight = () => {
        switch (currDirection) {
            case Directions.DOWN:
                setCurrDirection(Directions.LEFT)
                break;
            case Directions.UP:
                setCurrDirection(Directions.RIGHT)
                break;
            case Directions.LEFT:
                setCurrDirection(Directions.UP)
                break;
            case Directions.RIGHT:
                setCurrDirection(Directions.DOWN)
                break;
        }
        setCurrRobotRotate(currRotation + 90)
    }

    /**
     * Decrements the rotation angle by 90 degrees and updates the current direction the 
     * robot is facing.
     */
    const rotateLeft = () => {
        switch (currDirection) {
            case Directions.DOWN:
                setCurrDirection(Directions.RIGHT)
                break;
            case Directions.UP:
                setCurrDirection(Directions.LEFT)
                break;
            case Directions.LEFT:
                setCurrDirection(Directions.DOWN)
                break;
            case Directions.RIGHT:
                setCurrDirection(Directions.UP)
                break;
        }
        setCurrRobotRotate(currRotation - 90)
    }

    return (
        <div>
            <div
                style={{
                    width: `${widthInPixels}px`,
                    height: `${widthInPixels}px`
                }}>
                <motion.img
                    src={roboPic}
                    alt='robot'
                    animate={{
                        x: `${currXPos + ROBOT_GRID_OFFSET}px`,
                        y: `${currYPos + ROBOT_GRID_OFFSET}px`,
                        rotate: currRotation
                    }}
                    transition={{
                        duration: speed,
                        ease: 'linear'
                    }}
                    style={{
                        position: 'absolute',
                        maxWidth: `${gridSize * .7}px`,
                        maxHeight: `${gridSize * .7}px`
                    }}
                ></motion.img>
                <MazeDisplay
                    size={widthInPixels}
                    editMode={false}
                    attemptMode={true}
                    onGridClick={() => { }}
                    layoutArray={mazeLayout}
                ></MazeDisplay>
            </div>
            <Button
                variant="outlined"
                startIcon={<PlayArrow />}
                disabled={!allowReplay}
                onClick={() => beginAnimation()}
                style={{
                    position: 'absolute',
                    transform: 'translate(135px, 10px)'
                }}
            >Play</Button>
        </div>
    );
}

export default MazeAnimation;