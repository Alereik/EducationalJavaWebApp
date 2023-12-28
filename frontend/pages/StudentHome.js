import React, { useEffect, useState } from 'react';
import { Pagination, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getMazes, clearCurrMaze, setCurrMaze, changeCurrPage, getPopularMazes } from '../store/mazes'
import { useNavigate } from 'react-router-dom';
import { hideError } from '../store/error'
import { hideSuccess } from '../store/success'
import MenuBar from '../components/MenuBar';
import MazeRow from '../components/MazeRow';
import { clearMazeAttempts } from '../store/mazeAttempts';
import Divider from '@mui/material/Divider';

const StudentHome = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // list of all mazes from the database
    const mazes = useSelector(state => state.mazes.mazes);

    // list of all 3 most popular mazes from the database
    const popularMazes = useSelector(state => state.mazes.popularMazes);

    // the id of the currently selected maze
    const currentMazeId = useSelector(state => state.mazes.currentMazeId)

    // the current page being viewed by the user
    const currentPage = useSelector(state => state.mazes.currentPage)

    // the total count of pages of mazes
    const [pageCount, setPageCount] = useState(0);

    // the list of mazes shown in the top row
    const [visibleMazesTopRow, setVisibleMazesTop] = useState([]);

    // the list of mazes shown in the bottom row
    const [visibleMazesBottomRow, setVisibleMazesBottom] = useState([]);

    // the list of 3 mazes displayed in the side bar
    const [visiblePopularMazes, setVisiblePopularMazes] = useState([]);

    // keeps track of whether this is the first load of this component on the DOM
    const [firstPageLoad, setFirstPageLoad] = useState(true)

    // the total amount of mazes to be displayed on this page
    const MAZES_PER_PAGE = 6;

    /**
     * On page load, clear the global states from /attemptMaze and
     * get all mazes from the database.
     */
    useEffect(() => {
        dispatch(hideError());
        dispatch(hideSuccess());
        dispatch(clearCurrMaze());
        dispatch(clearMazeAttempts());
        dispatch(getPopularMazes());
        dispatch(getMazes());
    }, [])

    /**
     * This method runs whenever the current maze is set.
     * If the current maze id is set, navigate to the attempt page to begin the 
     * maze attempt.
     * If the current maze id is set, navigate to the attempt page to begin the 
     * maze attempt.
     */
    useEffect(() => {
        if (firstPageLoad) {
            setFirstPageLoad(false)
            return;
        }
        if (currentMazeId) {
            navigate('/attemptMaze')
        }
    }, [currentMazeId])

    /**
    * This method runs whenever the current page or the mazes are modified.
    * The method updates the page count for the paginator and sets the array of
    * mazes to be displayed to the user.
    */
    useEffect(() => {
        if (mazes) {
            // if the current page is no longer present (due to maze delete), jump to last page in paginator
            const pageCount = Math.ceil(mazes.length / MAZES_PER_PAGE)
            // if the current page is no longer present (due to maze delete), jump to last page in paginator
            if (currentPage > pageCount) {
                dispatch(changeCurrPage(pageCount))
            }
            setPageCount(pageCount);
            // the start index of visible mazes based on page being viewed
            const startIndex = (currentPage - 1) * MAZES_PER_PAGE;
            setVisiblePopularMazes(popularMazes);
            setVisibleMazesTop(mazes.slice(startIndex, startIndex + MAZES_PER_PAGE / 2));
            setVisibleMazesBottom(mazes.slice(startIndex + MAZES_PER_PAGE / 2, startIndex + MAZES_PER_PAGE));
        }
    }, [mazes, currentPage, popularMazes])

    /**
     * Sets the current page to the value selected in the paginator.
     * 
     * @param {*} event 
     * @param {*} value - the value selected in the paginator
     */
    const handlePageChange = (event, value) => {
        dispatch(changeCurrPage(value))
    }

    /**
     * Sets the global state of the current maze to the selected maze.
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
            <div style={{//Contains entire page
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                flexFlow: 'column'
            }}
            >
                <div style={{//Contains mazes and popular mazes
                    display: 'flex',
                    flexFlow: 'row'
                }}>
                    <div style={{//Contains popular mazes
                        display: 'flex',
                        flexFlow: 'column',
                        position: 'absolute',
                        textAlign: 'center',
                        left: '10%',
                        top: '53%',
                        transform: 'translate(-50%, -50%)',
                    }}>
                        <Typography
                            variant="h5"
                            component="div"
                            fontFamily='Copperplate'
                            style={{
                                marginTop: '15px',
                                marginBottom: '0'
                            }}
                        >POPULAR</Typography>
                        <MazeRow
                            mazeList={visiblePopularMazes}
                            onMazeClick={handleMazeClick}
                        ></MazeRow>
                    </div>
                    <Divider
                        orientation='vertical'
                        variant="middle"
                        flexItem
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            left: '20%',
                            top: '10%',
                            height: '80%'
                        }}
                    ></Divider>
                    <div style={{//displays the mazes
                        display: 'flex',
                        flexFlow: 'column',
                        textAlign: 'center'
                    }}>
                        <Typography
                            variant="h4"
                            component="div"
                            fontFamily='Copperplate'
                            style={{
                                position: 'absolute',
                                left: '60%',
                                top: '20%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >MAZE CATALOG</Typography>
                        <div style={{//displays top row of mazes
                            display: 'flex',
                            flexFlow: 'row',
                            position: 'absolute',
                            left: '60%',
                            top: '40%',
                            transform: 'translate(-50%, -50%)',
                        }} >
                            <MazeRow
                                mazeList={visibleMazesTopRow}
                                onMazeClick={handleMazeClick}
                            ></MazeRow>
                        </div>
                        <div style={{//displays bottom row of mazes
                            display: 'flex',
                            flexFlow: 'row',
                            position: 'absolute',
                            left: '60%',
                            left: '60%',
                            top: '75%',
                            transform: 'translate(-50%, -50%)',
                        }}>
                            <MazeRow
                                mazeList={visibleMazesBottomRow}
                                onMazeClick={handleMazeClick}
                            ></MazeRow>
                        </div>
                        <div
                            style={{//displays paginator
                                position: 'absolute',
                                left: '60%',
                                top: '95%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default StudentHome;