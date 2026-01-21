"use client";

import { useState, useRef, useEffect } from "react";

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Daniel Caesar - Entropy
    const musicUrl = "/music/entropy.mp3";

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleEnded = () => {
            setIsPlaying(false);
        };

        audio.addEventListener("ended", handleEnded);
        return () => {
            audio.removeEventListener("ended", handleEnded);
        };
    }, []);

    return (
        <>
            <audio ref={audioRef} src={musicUrl} loop />

            <button
                onClick={togglePlay}
                className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full border border-black bg-white hover:bg-black hover:text-white transition-all duration-300 flex items-center justify-center group"
                aria-label={isPlaying ? "Pause music" : "Play music"}
            >
                {isPlaying ? (
                    <div className="flex gap-1">
                        <div className="w-1 h-4 bg-black group-hover:bg-white" />
                        <div className="w-1 h-4 bg-black group-hover:bg-white" />
                    </div>
                ) : (
                    <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-1 group-hover:border-l-white" />
                )}
            </button>
        </>
    );
}
