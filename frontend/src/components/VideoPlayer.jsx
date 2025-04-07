import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { server } from '../main.jsx';
import toast from 'react-hot-toast';
import './VideoPlayer.css';

const VideoPlayer = ({ videoUrl, lectureId, courseId }) => {
    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const progressUpdateTimeout = useRef(null);

    useEffect(() => {
        fetchProgress();
    }, [lectureId]);

    const fetchProgress = async () => {
        try {
            const { data } = await axios.get(`${server}/api/progress/lecture/${lectureId}`, {
                headers: { token: localStorage.getItem('token') }
            });

            if (data.success && data.progress) {
                setProgress(data.progress.progress);
                if (data.progress.lastPosition > 0) {
                    videoRef.current.currentTime = data.progress.lastPosition;
                }
            }
        } catch (error) {
            console.error('Error fetching progress:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProgress = async (currentProgress, currentTime) => {
        try {
            await axios.post(
                `${server}/api/progress/update`,
                {
                    lectureId,
                    courseId,
                    progress: currentProgress,
                    lastPosition: currentTime
                },
                {
                    headers: { token: localStorage.getItem('token') }
                }
            );
        } catch (error) {
            console.error('Error updating progress:', error);
            toast.error('Failed to update progress');
        }
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;

        const video = videoRef.current;
        const currentProgress = Math.round((video.currentTime / video.duration) * 100);

        if (currentProgress !== progress) {
            setProgress(currentProgress);

            // Debounce progress updates to avoid too many API calls
            if (progressUpdateTimeout.current) {
                clearTimeout(progressUpdateTimeout.current);
            }

            progressUpdateTimeout.current = setTimeout(() => {
                updateProgress(currentProgress, video.currentTime);
            }, 2000); // Update progress every 2 seconds
        }
    };

    return (
        <div className="video-player-container">
            {loading ? (
                <div className="loading">Loading video...</div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        className="video-player"
                        controls
                        onTimeUpdate={handleTimeUpdate}
                        src={videoUrl}
                    />
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${progress}%` }}>
                            <span className="progress-text">{progress}% completed</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default VideoPlayer; 