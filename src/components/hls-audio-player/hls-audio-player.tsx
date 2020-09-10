import React, { useRef, useState, useEffect } from 'react';
import styles from './hls-audio-player.module.scss';
import Hls from 'hls.js';
import playButton from '../../assets/icons/play-button.svg';
import pauseButton from '../../assets/icons/pause-button.svg';
import volumeOnButton from '../../assets/icons/volume-on-button.svg';
import volumeOffButton from '../../assets/icons/volume-off-button.svg';

interface Props {
    hlsSource: string;
}

const HLSAudioPlayer = (props: Props) => {
    const { hlsSource } = props;
    const audioRef = useRef<HTMLMediaElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [volume, setVolume] = useState<number>(1);
    const [isMuted, setIsMuted] = useState<boolean>(false);

    useEffect(() => {
        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        if (audioRef.current) {
            hlsRef.current = new Hls();
            hlsRef.current.attachMedia(audioRef.current);
            hlsRef.current.on(Hls.Events.MEDIA_ATTACHED, () => {
                hlsRef.current?.loadSource(hlsSource);

                hlsRef.current?.on(Hls.Events.MANIFEST_PARSED, () => {
                    hlsRef.current?.on(Hls.Events.LEVEL_LOADED, (_: string, data: Hls.levelLoadedData) => {
                        const duration: number = data.details.totalduration;
                        setDuration(duration);
                        setCurrentTime(0);
                        audioRef.current?.play();
                    })
                });
            })
        }

    }, [hlsSource]);

    const onSeeking = (e: React.FormEvent<HTMLInputElement>) => {
        const currentTime: number = +e.currentTarget.value;
        audioRef.current!.currentTime = currentTime;
        setCurrentTime(currentTime);
    }

    const onProgress = (e: any) => {
        const currentTime: number = audioRef.current!.currentTime;
        setCurrentTime(currentTime);
    }

    const onPlay = () => setIsPlaying(true);

    const onPause = () => setIsPlaying(false);

    const onSeekStart = () => audioRef.current?.pause();

    const onSeekEnd = () => audioRef.current?.play();

    const onPlayPauseClick = () => {
        if (isPlaying) {
            audioRef.current!.pause();
        } else {
            audioRef.current!.play();
        }
    }

    const onVolumeChange = (e: React.FormEvent<HTMLInputElement>) => {
        const newVolume: number = +e.currentTarget.value;
        setVolume(newVolume);
    }

    useEffect(() => {
        audioRef.current!.volume = volume;
    }, [volume]);

    const onMute = () => setIsMuted(!isMuted);

    return (
        <div className={styles.hlsAudioPlayer}>
            <audio 
                ref={audioRef} 
                onTimeUpdate={onProgress}
                onPlay={onPlay}
                onPause={onPause}
                muted={isMuted}
            />
            <div className={styles.leftControls}>
                <div className={styles.playPauseButton} onClick={onPlayPauseClick}>
                    <img src={isPlaying ? pauseButton : playButton} />
                </div>
            </div>
            <div className={styles.progressWrapper}>
                <div className={styles.timeline} />
                <div className={styles.progressLine} style={{ width: `${currentTime / duration * 100}%`}} />
                <div className={styles.progressThumb} style={{ marginLeft: `calc(${currentTime / duration * 100 }% - 8px)`}} />
                <input 
                    type='range' 
                    min='0'
                    max={duration}
                    value={currentTime} 
                    className={styles.rangeInput}
                    onInput={onSeeking}
                    onChange={onSeeking}
                    onMouseDown={onSeekStart}
                    onMouseUp={onSeekEnd}
                />
            </div>
            <div className={styles.volumeControls}>
                <div className={styles.volumeWrapper}>
                    <div className={styles.volumeLine} />
                    <div className={styles.volumeLevelLine} style={{ width: `${volume * 100}%` }}/>
                    <div className={styles.volumeThumb} style={{ marginLeft: `calc(${volume * 100 }% - 8px)`}} />
                    <input
                        type='range'
                        min='0'
                        max='1'
                        step='0.01'
                        className={styles.rangeInput}
                        onInput={onVolumeChange}
                        onChange={onVolumeChange}
                    />
                </div>

                <div className={styles.volumeButton} onClick={onMute}>
                    <img src={isMuted || volume === 0 ? volumeOffButton : volumeOnButton} />
                </div>
            </div>
        </div>
    )
}

export default HLSAudioPlayer;