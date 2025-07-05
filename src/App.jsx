import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ===================================================================
//
//          EDIT THESE VALUES TO CUSTOMIZE YOUR EXPERIENCE
//
const TARGET_DATE = "December 31, 2025 23:59:59";
const SPOTIFY_URL = "https://open.spotify.com/artist/2XR0tkVAWC9fk2zEAGyX97";
const MAIN_TITLE = "It's been a long time coming";
const FINISHED_TEXT = "The New Album Is Out Now";

// Timestamps for the reveal animation (in seconds)
const REVEAL_CONTENT_AT = 3.21; // The audio cue: "This is where the next mish begins"
const REVEAL_BUTTON_AT = 4.5;   // A little after the content
//
// ===================================================================

const formatTime = (time) => (time < 10 ? `0${time}` : time);

const calculateTimeLeft = (target) => {
    const difference = +new Date(target) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
        timeLeft = {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    }
    return timeLeft;
};

const SpotifyButton = ({ url }) => (
    <a href={url} className="spotify-button" target="_blank" rel="noopener noreferrer">
        Listen on Spotify
    </a>
);

function App() {
    // State for the countdown itself
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(TARGET_DATE));
    const [isFinished, setIsFinished] = useState(Object.keys(calculateTimeLeft(TARGET_DATE)).length === 0);
    
    // New state to manage the UI flow
    const [hasEntered, setHasEntered] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isButtonVisible, setIsButtonVisible] = useState(false);

    const audioRef = useRef(null);

    // Countdown timer logic (unchanged)
    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(TARGET_DATE);
            if (Object.keys(newTimeLeft).length === 0) {
                setIsFinished(true);
                clearInterval(timer);
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [isFinished]);

    // This effect runs when the user clicks "Enter"
    useEffect(() => {
        if (!hasEntered) return;

        const audio = audioRef.current;
        const onTimeUpdate = () => {
            if (audio.currentTime >= REVEAL_CONTENT_AT && !isContentVisible) {
                setIsContentVisible(true);
            }
            if (audio.currentTime >= REVEAL_BUTTON_AT && !isButtonVisible) {
                setIsButtonVisible(true);
                // We can remove the listener now since all events have fired
                audio.removeEventListener('timeupdate', onTimeUpdate);
            }
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        
        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
        };
    }, [hasEntered, isContentVisible, isButtonVisible]); // Rerun if state changes

    const handleEnter = () => {
        setHasEntered(true);
        audioRef.current.play().catch(error => console.error("Audio Playback Error:", error));
    };

    return (
        <div className="app-container">
            {/* The audio element now has NO loop attribute */}
            <audio ref={audioRef} src="/riff.mp3" preload="auto" />

            {!hasEntered ? (
                // 1. The initial "Enter" screen
                <button className="enter-button" onClick={handleEnter}>Enter</button>
            ) : isFinished ? (
                // 3. The "Finished" screen (when countdown is over)
                <div className="content-reveal">
                    <div className="finished-container">
                        <h1 className="finished-message">{FINISHED_TEXT}</h1>
                        <SpotifyButton url={SPOTIFY_URL} />
                    </div>
                </div>
            ) : (
                // 2. The main "Countdown" screen after entering
                <>
                    {isContentVisible && (
                        <div className="content-reveal">
                            <h1 className="main-title">{MAIN_TITLE}</h1>
                            <div id="countdown-container">
                                {/* Countdown timer sections */}
                                <div className="time-section"><span className="time-value">{formatTime(timeLeft.days || 0)}</span><span className="time-label">Days</span></div>
                                <div className="time-section"><span className="time-value">{formatTime(timeLeft.hours || 0)}</span><span className="time-label">Hours</span></div>
                                <div className="time-section"><span className="time-value">{formatTime(timeLeft.minutes || 0)}</span><span className="time-label">Minutes</span></div>
                                <div className="time-section"><span className="time-value">{formatTime(timeLeft.seconds || 0)}</span><span className="time-label">Seconds</span></div>
                            </div>
                        </div>
                    )}
                    {isButtonVisible && (
                        <div className="content-reveal">
                             <SpotifyButton url={SPOTIFY_URL} />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;