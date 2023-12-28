import React from 'react';

const Tips = () => {

    return (
        <>
            <h2><b>Enums</b></h2>
            <h3><span style={{ color: '#a6e9ff' }}>GridTypeEnum</span> (WALL, PATH, FINISH) </h3>
            <br></br>
            <h2><b>Scan Methods</b></h2>
            <h3><span style={{ color: '#ffa1d4' }}>robot.scanForward()</span>: returns <span style={{ fontFamily: 'italic' }}>GridTypeEnum</span> of space in front of M.A.Z.E.R.</h3>
            <h3><span style={{ color: '#ffa1d4' }}>robot.scanBackward()</span>: returns <span style={{ fontFamily: 'italic' }}>GridTypeEnum</span> of space behind M.A.Z.E.R.</h3>
            <h3><span style={{ color: '#ffa1d4' }}>robot.scanRight()</span>: returns <span style={{ fontFamily: 'italic' }}>GridTypeEnum</span> of space to right of M.A.Z.E.R.</h3>
            <h3><span style={{ color: '#ffa1d4' }}>robot.scanLeft()</span>: returns <span style={{ fontFamily: 'italic' }}>GridTypeEnum</span> of space to left of M.A.Z.E.R.</h3>
            <br></br>
            <h2><b>Move Methods</b></h2>
            <h3><span style={{ color: '#fff1a6' }}>robot.moveForward()</span>: moves M.A.Z.E.R. forward 1 space</h3>
            <h3><span style={{ color: '#fff1a6' }}>robot.moveBackward()</span>: moves M.A.Z.E.R. backward 1 space</h3>
            <h3><span style={{ color: '#fff1a6' }}>robot.rotateRight()</span>: rotates M.A.Z.E.R. right 90 degrees</h3>
            <h3><span style={{ color: '#fff1a6' }}>robot.rotateLeft()</span>: rotates M.A.Z.E.R. left 90 degrees</h3>
        </>
    );
}

export default Tips;