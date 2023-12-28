import React, { useEffect, useState } from 'react';
import MazeDisplay from '../components/MazeDisplay';

const MazeRow = ({ mazeList, onMazeClick }) => {

    // Local state to store the current maze list
    const [mazes, setMazes] = useState(mazeList)

    /**
     * This method runs every time the mazeList passed to the component is modified.
     * The method updates the local state of mazes to ensure the correct mazes are
     * displayed.
     */
    useEffect(() => {
        setMazes(mazeList)
    }, [mazeList])

    return (
        <>
            {mazes && mazes.map((maze) => {
                return (
                    <div
                        key={maze}
                        style={{
                            margin: '40px',
                            marginBottom: '10px',
                            marginLeft: '50px',
                            marginTop: '15px',
                            marginRight: '50px'
                        }}
                        onClick={() => onMazeClick(maze.id, maze.layout)}
                    >
                        <MazeDisplay
                            layoutArray={maze.layout}
                            editMode={false}
                            attemptMode={false}
                            size={200}
                            onGridClick={() => { }}
                        ></MazeDisplay>
                    </div>
                )
            })}
        </>
    );
}

export default MazeRow;