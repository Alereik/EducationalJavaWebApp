import React, { useEffect, useState } from 'react';
import { Pagination } from '@mui/material';
import Fab from '@mui/material/Fab';
import { useDispatch, useSelector } from 'react-redux';
import { getMazes, clearCurrMaze, setCurrMaze, changeCurrPage } from '../store/mazes'
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import { hideError } from '../store/error'
import { hideSuccess } from '../store/success'
import MenuBar from '../components/MenuBar';
import MazeRow from '../components/MazeRow';

const AdminHome = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // global list of all mazes in the database
    const mazes = useSelector(state => state.mazes.mazes);

    // id of the maze selected by the admin
    const currentMazeId = useSelector(state => state.mazes.currentMazeId)

    // the current page of mazes being viewed
    const currentPage = useSelector(state => state.mazes.currentPage)

    // the total count of pages of mazes
    const [pageCount, setPageCount] = useState(0);

    // the mazes currently displayed in the top row
    const [visibleMazesTopRow, setVisibleMazesTop] = useState([]);

    // the mazes currently displayed in the bottom row
    const [visibleMazesBottomRow, setVisibleMazesBottom] = useState([]);

    // keeps track of whether this is the first load of this component on the DOM
    const [firstPageLoad, setFirstPageLoad] = useState(true)

    // the total mazes displayed on this page
    const MAZES_PER_PAGE = 8;

    /**
     * On page load, clear the global states from /editMaze and retrieve
     * all the mazes from the database.
     */
    useEffect(() => {
        dispatch(hideError());
        dispatch(hideSuccess());
        dispatch(clearCurrMaze());
        dispatch(getMazes());
    }, [])

    /**
     * This method runs whenever the current maze is set.
     * If the current maze id is set, navigate to the edit page to begin modifications.
     */
    useEffect(() => {
        if (firstPageLoad) {
            setFirstPageLoad(false)
            return;
        }
        if ((currentMazeId === -1) || (currentMazeId)) {
            navigate('/editMaze')
        }
    }, [currentMazeId])

    /**
     * This method runs whenever the current page or the mazes are modified.
     * The method updates the page count for the paginator and sets the array of
     * mazes to be displayed to the user.
     */
    useEffect(() => {
        if (mazes) {
            let pageCount = Math.ceil(mazes.length / MAZES_PER_PAGE)
            if (pageCount === 0) { // edge case when all mazes have been deleted
                pageCount = 1
            }
            // if the current page is no longer present (due to maze delete), jump to last page in paginator
            if (currentPage > pageCount) {
                dispatch(changeCurrPage(pageCount))
            }
            setPageCount(pageCount);
            const startIndex = (currentPage - 1) * MAZES_PER_PAGE;
            setVisibleMazesTop(
                mazes.slice(
                    startIndex,
                    startIndex + MAZES_PER_PAGE / 2
                )
            );
            setVisibleMazesBottom(
                mazes.slice(
                    startIndex + MAZES_PER_PAGE / 2,
                    startIndex + MAZES_PER_PAGE
                )
            );
        }
    }, [mazes, currentPage])

    /**
     * Sets the current page to the desired value.
     * 
     * @param {*} event 
     * @param {*} value - the new page value to switch to
     */
    const handlePageChange = (event, value) => {
        dispatch(changeCurrPage(value))
    }

    /**
     * Sets the global state of the current maze to a new maze.
     */
    const handleNewMazeClick = () => {
        dispatch(setCurrMaze(-1, JSON.parse(JSON.stringify([[0, 0], [0, 0]]))));
    }

    /**
     * Sets the global states for the selected maze.
     * 
     * @param {*} mazeId - the id of the selected maze
     * @param {*} layout - the layout array of the selected maze
     */
    const handleMazeClick = (mazeId, layout) => {
        dispatch(setCurrMaze(mazeId, layout))
    }

    return (
        <>
            <MenuBar></MenuBar>
            <div // contains whole page
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    flexFlow: 'column'
                }}
            >
                <Tooltip title="Create New Maze" placement='right'>
                    <Fab
                        color='primary'
                        style={{ margin: '40px', marginLeft: '40px' }}
                        onClick={handleNewMazeClick}
                    >
                        <AddIcon></AddIcon>
                    </Fab>
                </Tooltip>
                <div // contains the maze rows
                    style={{
                        display: 'flex',
                        flexFlow: 'column',
                    }}>
                    <div // contains maze top row
                        style={{
                            display: 'flex',
                            flexFlow: 'row',
                            position: 'absolute',
                            left: '50%',
                            top: '40%',
                            transform: 'translate(-50%, -50%)',
                        }} >
                        <MazeRow
                            mazeList={visibleMazesTopRow}
                            onMazeClick={handleMazeClick}
                        ></MazeRow>
                    </div>
                    <div // contains maze bottom row
                        style={{
                            display: 'flex',
                            flexFlow: 'row',
                            position: 'absolute',
                            left: '50%',
                            top: '75%',
                            transform: 'translate(-50%, -50%)',
                        }}>
                        <MazeRow
                            mazeList={visibleMazesBottomRow}
                            onMazeClick={handleMazeClick}
                        ></MazeRow>
                    </div>
                </div>
                <div // contains paginator
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '95%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                    <Pagination
                        count={pageCount}
                        page={currentPage}
                        onChange={handlePageChange} />
                </div>
            </div>
        </>
    );
}

export default AdminHome;
