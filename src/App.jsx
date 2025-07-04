import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ===================================================================
//
//          EDIT THESE VALUES TO CUSTOMIZE YOUR COUNTDOWN
//
const TARGET_DATE = "December 31, 2025 23:59:59";
const SPOTIFY_URL = "https://open.spotify.com/artist/2XR0tkVAWC9fk2zEAGyX97"; // <-- Replace with your band's Spotify link
const FINISHED_TEXT = "A Long Time Coming";
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


function App() {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(TARGET_DATE));
    const [isFinished, setIsFinished] = useState(false);
    const audioRef = useRef(null);

    // Effect for the countdown timer
    useEffect(() => {
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
    }, []);

    // Effect to play audio on component mount
    useEffect(() => {
        // Modern browsers have autoplay policies. Audio might not play until user interacts.
        // The `play()` method returns a promise which can be used to catch errors.
        audioRef.current.play().catch(error => {
            console.log("Audio autoplay was prevented:", error);
            // You could show a "Click to play audio" button here if needed.
        });
    }, []);


    return (
        <div className="app-container">
            {/* The audio element is here, but not visible. `controls` can be added for debugging. */}
            <audio ref={audioRef} src="/riff.mp3" loop />
            
            {isFinished ? (
                <div className="finished-container">
                    <h1 className="finished-message">{FINISHED_TEXT}</h1>
                    <a href={SPOTIFY_URL} className="spotify-button" target="_blank" rel="noopener noreferrer">
                        Listen on Spotify
                    </a>
                </div>
            ) : (
                <div id="countdown-container">
                    <div className="time-section">
                        <span className="time-value">{formatTime(timeLeft.days || 0)}</span>
                        <span className="time-label">Days</span>
                    </div>
                    <div className="time-section">
                        <span className="time-value">{formatTime(timeLeft.hours || 0)}</span>
                        <span className="time-label">Hours</span>
                    </div>
                    <div className="time-section">
                        <span className="time-value">{formatTime(timeLeft.minutes || 0)}</span>
                        <span className="time-label">Minutes</span>
                    </div>
                    <div className="time-section">
                        <span className="time-value">{formatTime(timeLeft.seconds || 0)}</span>
                        <span className="time-label">Seconds</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;