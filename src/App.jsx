import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// ===================================================================
//
//          EDIT THESE VALUES TO CUSTOMIZE YOUR EXPERIENCE
//
const TARGET_DATE = "November 15, 2025 23:59:59";
const SPOTIFY_URL = "https://open.spotify.com/artist/2XR0tkVAWC9fk2zEAGyX97";
const MAIN_TITLE = "It's been a long time coming";
const FINISHED_TEXT = "The New Album Is Out Now";

// === YOUR TIMING SYSTEM ===
const LYRICS = [
    { text: "This",     time: 0.18 },
    { text: "is",       time: 0.43 },
    { text: "where",    time: 0.67 },
    { text: "the",      time: 0.88 },
    { text: "next",     time: 1.03 },
    { text: "mish",     time: 1.32 },
    { text: "begins...",   time: 1.60 },
];

const REVEAL_MAIN_CONTENT_AT = 3.21;
//
// ===================================================================

const formatTime = (time) => (time < 10 ? `0${time}` : time);

const calculateTimeLeft = (target) => {
    const difference = +new Date(target) - +new Date();
    let timeLeft = {};
    if (difference > 0) {
        timeLeft = { days: Math.floor(difference / (1000 * 60 * 60 * 24)), hours: Math.floor((difference / (1000 * 60 * 60)) % 24), minutes: Math.floor((difference / 1000 / 60) % 60), seconds: Math.floor((difference / 1000) % 60) };
    }
    return timeLeft;
};

const SpotifyButton = ({ url }) => ( <a href={url} className="spotify-button" target="_blank" rel="noopener noreferrer">Listen on Spotify</a> );

function App() {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(TARGET_DATE));
    const [isFinished, setIsFinished] = useState(Object.keys(calculateTimeLeft(TARGET_DATE)).length === 0);
    const [hasEntered, setHasEntered] = useState(false);
    const [visibleWordCount, setVisibleWordCount] = useState(0);
    const [isMainContentVisible, setIsMainContentVisible] = useState(false);
    const audioRef = useRef(null);

    // Countdown timer logic
    useEffect(() => {
        if (isFinished) return;
        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft(TARGET_DATE);
            if (Object.keys(newTimeLeft).length === 0) {
                setIsFinished(true);
                clearInterval(timer);
            } else { setTimeLeft(newTimeLeft); }
        }, 1000);
        return () => clearInterval(timer);
    }, [isFinished]);

    // Main synchronization effect
    useEffect(() => {
        if (!hasEntered) return;
        const audio = audioRef.current;
        
        const onTimeUpdate = () => {
            if (!isMainContentVisible) {
                const nextWord = LYRICS[visibleWordCount];
                if (nextWord && audio.currentTime >= nextWord.time) {
                    setVisibleWordCount(prevCount => prevCount + 1);
                }
            }
            if (!isMainContentVisible && audio.currentTime >= REVEAL_MAIN_CONTENT_AT) {
                setIsMainContentVisible(true);
            }
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        return () => { audio.removeEventListener('timeupdate', onTimeUpdate); };
    }, [hasEntered, visibleWordCount, isMainContentVisible]);

    const handleEnter = () => {
        setHasEntered(true);
        audioRef.current.play().catch(error => console.error("Audio Playback Error:", error));
    };

    return (
        <div className="app-container">
            <audio ref={audioRef} src="/riff.mp3" preload="auto" />

            {!hasEntered ? (
                <button className="enter-button" onClick={handleEnter}>Enter</button>
            ) : isFinished ? (
                <div className="content-reveal">
                    <div className="finished-container">
                        <h1 className="finished-message">{FINISHED_TEXT}</h1>
                        <SpotifyButton url={SPOTIFY_URL} />
                    </div>
                </div>
            ) : (
                <>
                    {isMainContentVisible ? (
                        <div className="content-reveal">
                            <h1 className="main-title">{MAIN_TITLE}</h1>
                            <div id="countdown-container">
                                <div className="time-section"><span className="time-value">{formatTime(timeLeft.days || 0)}</span><span className="time-label">Days</span></div>
                                <div className="time-section"><span className="time-value">{formatTime(timeLeft.hours || 0)}</span><span className="time-label">Hours</span></div>
                                <div className="time-section"><span className="time-value">{formatTime(timeLeft.minutes || 0)}</span><span className="time-label">Minutes</span></div>
                                <div className="time-section"><span className="time-value">{formatTime(timeLeft.seconds || 0)}</span><span className="time-label">Seconds</span></div>
                            </div>
                            <SpotifyButton url={SPOTIFY_URL} />
                        </div>
                    ) : (
                        <div className="lyrics-container">
                            {/* === THIS IS THE KEY CHANGE === */}
                            {/* We map all lyrics, but only give the 'visible' class to the ones that should be seen */}
                            {LYRICS.map((word, index) => (
                                <span 
                                    key={index} 
                                    className={`lyric-word ${index < visibleWordCount ? 'visible' : ''}`}
                                >
                                    {word.text}
                                </span>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;