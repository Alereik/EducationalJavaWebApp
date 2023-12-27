import React, { useEffect, useState } from 'react';

const MazeDisplay = ({ layoutArray, onGridClick, editMode, attemptMode, size: widthInPixels }) => {

    // Stores an int array from 0 to maze grid width - 1
    const [sizeArray, setSizeArray] = useState([]);

    // Stores the percentage of the component a grid should fill vertically and horizontally
    const [gridSize, setGridSize] = useState(100 / layoutArray.length)

    // the array to display in the component
    const [mazeArray, setMazeArray] = useState(layoutArray);

    // determines the css of the shadow of this maze
    const [shadow, setShadow] = useState('none');

    // determines the css of the scale of this maze
    const [scale, setScale] = useState('none');

    /**
     * Every time the array passed to this component is changed, we update the grid size,
     * the maze being stored locally, and the size array.
     */
    useEffect(() => {
        setGridSize(100/layoutArray.length)
        let newSizeArray = []
        for (let i = 0; i < layoutArray.length; i++) {
            newSizeArray.push(i);
        }
        setSizeArray(newSizeArray)
        setMazeArray(layoutArray)
    }, [layoutArray])

    /**
     * Returns the color of the grid based off its array value.
     * 
     * @returns the CSS color of the desired grid
     */
    const getColor = (x, y) => {
        const gridColorNum = mazeArray[x][y];
        if (gridColorNum === 1) { // walls
            return '#001908'
        } else if (gridColorNum === 2) { // start
            if (attemptMode)
                return 'white'
            return '#ffeead'
        } else if (gridColorNum === 3) { // finish
            return '#badfad'
        } else {
            return 'white'
        }
    }

    /**
     * When edit mode is enabled, we turn on grid lines. Else we leave them hidden.
     * 
     * @returns CSS styling for displaying grid lines
     */
    const showGrids = () => {
        if (editMode) {
            return '1px solid gray'
        } else {
            return 'none'
        }
    }

    /**
     * Sets the shadow css of this maze to true.
     */
    const showShadow = () => {
        if (!editMode && !attemptMode) {
            setShadow('gray 0px 0px 30px')
            setScale('scale(1.05, 1.05)')
        }
    }

    /**
     * Sets the shadow css of this maze to false.
     */
    const hideShadow = () => {
        if (!editMode && !attemptMode) {
            setShadow('none')
            setScale('none')
        }
    }

    return (
        <div
            onMouseEnter={showShadow}
            onMouseLeave={hideShadow}
            style={{ 
                border: '1px solid black', 
                height: `${widthInPixels}px`, 
                width: `${widthInPixels}px`, 
                display: 'flex', 
                flexFlow: 'row wrap',
                boxShadow: `${shadow}`,
                transition: 'all 0.2s ease-in-out',
                transform: `${scale}`,
            }}
        >
            {sizeArray.map((x) =>
                sizeArray.map((y) => {
                    const gridColor = getColor(x, y);
                    return (
                        <div
                            onClick={() => onGridClick(x,y)}
                            style={{
                                backgroundColor: `${gridColor}`,
                                width: `${gridSize}%`,
                                height: `${gridSize}%`,
                                margin: 0,
                                boxSizing: 'border-box',
                                border: `${showGrids()}`,
                            }}
                        ></div>
                    )
                })
            )}
        </div>
    );
}

export default MazeDisplay;