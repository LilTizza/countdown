import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ===================================================================
//
//          EDIT THESE VALUES TO CUSTOMIZE YOUR COUNTDOWN
//
const TARGET_DATE = "December 31, 2025 23:59:59";
const SPOTIFY_URL = "https://open.spotify.com/artist/YOUR_ARTIST_ID_HERE"; // <-- Replace with your band's Spotify link
const MAIN_TITLE = "It's been a long time coming";
const FINISHED_TEXT = "The New Album Is Out Now";
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

// A reusable button component to keep our code clean
const SpotifyButton = ({ url }) => (
    <a href={url} className="spotify-button" target="_blank" rel="noopener noreferrer">
        Listen on Spotify
    </a>
);

function App() {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(TARGET_DATE));
    const [isFinished, setIsFinished] = useState(Object.keys(calculateTimeLeft(TARGET_DATE)).length === 0);
    const audioRef = useRef(null);

    // Effect for the countdown timer
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

    // Effect for playing audio on user interaction
    useEffect(() => {
        const playAudioOnFirstInteraction = () => {
            audioRef.current.play().catch(() => {});
            window.removeEventListener('click', playAudioOnFirstInteraction);
        };
        window.addEventListener('click', playAudioOnFirstInteraction);
        return () => {
            window.removeEventListener('click', playAudioOnFirstInteraction);
        };
    }, []);

    return (
        <div className="app-container">
            <audio ref={audioRef} src="/riff.mp3" loop />
            
            {isFinished ? (
                // VIEW WHEN THE COUNTDOWN IS FINISHED
                <div className="finished-container">
                    <h1 className="finished-message">{FINISHED_TEXT}</h1>
                    <SpotifyButton url={SPOTIFY_URL} />
                </div>
            ) : (
                // VIEW WHILE THE COUNTDOWN IS RUNNING
                <>
                    <h1 className="main-title">{MAIN_TITLE}</h1>
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
                    <SpotifyButton url={SPOTIFY_URL} />
                </>
            )}
        </div>
    );
}

export default App;