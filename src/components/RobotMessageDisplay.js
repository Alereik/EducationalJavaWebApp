import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Typed from 'react-typed';

const RobotMessageDisplay = () => {

    // the message displayed when the user first views a maze
    const welcomeMessage = ["Hello, I am the Mobile Algorithmic Zone Explorer " +
        "and Resolver, but you can call me M.A.Z.E.R. My hard drive " +
        "has malfunctioned, leaving me trapped in this maze! Help me escape " +
        "by writing a Java method that navigates me to the exit." +
        " Part of my memory bank was salvaged, including a few methods to " +
        "scan and navigate my environment. Hover over me to learn about my " +
        "available methods!"];

    // the message displayed when a user pulls in saved code
    const savedCodeMessage = [
        "Looks like this code's been compiled! Press play to watch it run!"
    ];

    // the message displayed when a user is working on new code
    const newAttempt = [
        "New code attempt initiated! Keep working to develop a " +
        "new method. Remember to hover over me to see my available methods!"
    ]

    // Global state storing the success message
    const currentAnimatedAttempt = useSelector(state => state.mazeAttempts.currentAnimatedAttempt)

    // Global state storing the success message
    const successMessage = useSelector(state => state.mazeAttempts.successMessage)

    // Global state storing the failure message
    const failureMessage = useSelector(state => state.mazeAttempts.failureMessage)

    // Local state displaying the success message
    const [currSuccessMessage, setSuccessMessage] = useState(successMessage);

    // Local state displaying the failure message
    const [currFailureMessage, setFailureMessage] = useState(failureMessage);

    // boolean to determine if the welcome message is visible
    const [showWelcome, setShowWelcome] = useState(false);

    // boolean to determine if the success message is visible
    const [showSuccess, setShowSuccess] = useState(false);

    // boolean to determine if the failure message is visible
    const [showFailure, setShowFailure] = useState(false);

    // boolean to determine if the loading message is visible
    const [showSavedCode, setShowSavedCode] = useState(false)

    // boolean to determine if the new attempt message is visible
    const [showNewAttempt, setShowNewAttempt] = useState(false)

    // boolean to track if the user is currently making their first attempt
    const [makingFirstAttempt, setMakingFirstAttempt] = useState(true)

    /**
     * This method runs whenever the message for the robot is updated. It restarts the
     * typing animation and updates the local state of the message.
     */
    useEffect(() => {
        if (successMessage != null) {
            hideAllMessages()
            setSuccessMessage(successMessage)
            setShowSuccess(true)
        } else if (failureMessage != null) {
            hideAllMessages()
            setFailureMessage(failureMessage)
            setShowFailure(true)
        }
    }, [successMessage, failureMessage])

    /**
     * Runs whenever a new attempt is ready to be animated. It displays the
     * message stating there is saved code ready to animate.
     */
    useEffect(() => {
        hideAllMessages()
        if (currentAnimatedAttempt !== null) {
            setMakingFirstAttempt(false)
            setShowSavedCode(true)
        } else if (makingFirstAttempt) {
            setShowWelcome(true)
        } else {
            setShowNewAttempt(true)
        }
    }, [currentAnimatedAttempt])

    /**
     * Hides all the message displays.
     */
    const hideAllMessages = () => {
        setShowWelcome(false)
        setShowSuccess(false)
        setShowFailure(false)
        setShowSavedCode(false)
        setShowNewAttempt(false)
    }

    return (
        <>
            {showWelcome && ( // displays the welcome message if the user has no past attempts
                <Typed
                    id="welcomeDisplay"
                    loop={false}
                    typeSpeed={30}
                    showCursor={false}
                    strings={welcomeMessage}
                    stopped={!showWelcome}
                ></Typed>
            )}
            {showSuccess && ( // displays the success message when an attempt finds the exit
                <Typed
                    key={currSuccessMessage}
                    id="successDisplay"
                    typeSpeed={30}
                    showCursor={false}
                    strings={currSuccessMessage}
                    stopped={!showSuccess}
                ></Typed>
            )}
            {showFailure && ( // displays the failure message when an attempt doesn't find the exit
                <Typed
                    id="failureDisplay"
                    typeSpeed={30}
                    showCursor={false}
                    strings={currFailureMessage}
                    stopped={!showFailure}
                ></Typed>
            )}
            {showSavedCode && ( // displays the saved code message
                <Typed
                    id="savedCodeDisplay"
                    typeSpeed={30}
                    showCursor={false}
                    strings={savedCodeMessage}
                    stopped={!showSavedCode}
                ></Typed>
            )}
            {showNewAttempt && ( // displays the new attempt message
                <Typed
                    id="newAttemptDisplay"
                    typeSpeed={30}
                    showCursor={false}
                    strings={newAttempt}
                    stopped={!showNewAttempt}
                ></Typed>
            )}
        </>
    );
}

export default RobotMessageDisplay;