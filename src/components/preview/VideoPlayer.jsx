import { useRef, useState, useEffect, useCallback } from 'react';

const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const VideoPlayer = ({ src, name }) => {
    const videoRef = useRef(null);
    const progressRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const onLoadedMetadata = () => setDuration(video.duration);
        const onTimeUpdate = () => setCurrentTime(video.currentTime);
        const onEnded = () => setIsPlaying(false);

        video.addEventListener('loadedmetadata', onLoadedMetadata);
        video.addEventListener('timeupdate', onTimeUpdate);
        video.addEventListener('ended', onEnded);

        return () => {
            video.removeEventListener('loadedmetadata', onLoadedMetadata);
            video.removeEventListener('timeupdate', onTimeUpdate);
            video.removeEventListener('ended', onEnded);
        };
    }, [src]);

    const togglePlay = useCallback(() => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }, []);

    const handleSeek = (e) => {
        const bar = progressRef.current;
        const rect = bar.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        videoRef.current.currentTime = ratio * duration;
    };

    const toggleMute = () => {
        const video = videoRef.current;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleVolumeChange = (e) => {
        const vol = parseFloat(e.target.value);
        videoRef.current.volume = vol;
        setVolume(vol);
        if (vol === 0) setIsMuted(true);
        else setIsMuted(false);
    };

    const progress = duration ? (currentTime / duration) * 100 : 0;

    return (
        <div
            style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <video
                ref={videoRef}
                src={src}
                onClick={togglePlay}
                style={{ width: '100%', display: 'block', cursor: 'pointer' }}
                playsInline
            />

            {/* Controls Overlay */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                padding: '24px 12px 10px',
                opacity: isHovering || !isPlaying ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }}>
                {/* Progress Bar */}
                <div
                    ref={progressRef}
                    onClick={handleSeek}
                    style={{
                        width: '100%',
                        height: 5,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        borderRadius: 3,
                        cursor: 'pointer',
                        marginBottom: 8,
                        position: 'relative',
                    }}
                >
                    <div style={{
                        width: `${progress}%`,
                        height: '100%',
                        borderRadius: 3,
                        background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
                        transition: 'width 0.1s linear',
                    }} />
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: `${progress}%`,
                        transform: 'translate(-50%, -50%)',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                    }} />
                </div>

                {/* Bottom Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Play/Pause */}
                    <button
                        onClick={togglePlay}
                        style={{
                            background: 'none', border: 'none', padding: 4, cursor: 'pointer',
                            color: '#fff', display: 'flex', alignItems: 'center',
                        }}
                    >
                        {isPlaying ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21" /></svg>
                        )}
                    </button>

                    {/* Time */}
                    <span style={{ fontSize: 11, color: '#ccc', fontFamily: 'monospace', minWidth: 80 }}>
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    <div style={{ flex: 1 }} />

                    {/* Volume */}
                    <button
                        onClick={toggleMute}
                        style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: '#fff', display: 'flex' }}
                    >
                        {isMuted || volume === 0 ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
                        )}
                    </button>
                    <input
                        type="range"
                        min="0" max="1" step="0.05"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        style={{ width: 60, accentColor: 'var(--accent)' }}
                    />
                </div>
            </div>

            {/* Center Play Button (when paused) */}
            {!isPlaying && (
                <div
                    onClick={togglePlay}
                    style={{
                        position: 'absolute',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 56, height: 56,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                    }}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><polygon points="8,5 19,12 8,19" /></svg>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
