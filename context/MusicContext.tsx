"use client";

import { createContext, useContext, useState, useRef, ReactNode } from "react";

export type Track = {
  id: string;
  song_title: string;
  artist: string;
  audio_url?: string | null;
  cover_url?: string | null;
  mood_code?: string | null;
  related_link?: string | null;
};

type MusicContextType = {
  currentTrack: Track | null;
  isPlaying: boolean;
  playlist: Track[]; // 🌟 新增：记住当前的播放列表
  playTrack: (track: Track, trackList?: Track[]) => void; // 🌟 接收列表数据
  togglePlay: () => void;
  playNext: () => void; // 🌟 新增：切换下一首的方法
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playTrack = (track: Track, trackList?: Track[]) => {
    // 如果传入了新的列表，就更新大脑里的播放列表
    if (trackList) {
      setPlaylist(trackList);
    } else if (playlist.length === 0) {
      setPlaylist([track]);
    }

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }
    
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current && track.audio_url) {
      audioRef.current.src = track.audio_url;
      audioRef.current.play();
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  // 🌟 核心逻辑：自动寻找下一首并循环播放
  const playNext = () => {
    if (playlist.length === 0 || !currentTrack) return;
    const currentIndex = playlist.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % playlist.length; // 取模运算，实现列表循环
    const nextTrack = playlist[nextIndex];

    setCurrentTrack(nextTrack);
    setIsPlaying(true);
    if (audioRef.current && nextTrack.audio_url) {
      audioRef.current.src = nextTrack.audio_url;
      audioRef.current.play();
    }
  };

  return (
    <MusicContext.Provider value={{ currentTrack, isPlaying, playlist, playTrack, togglePlay, playNext }}>
      {children}
      {/* 🌟 监听 onEnded 事件，一首歌放完自动执行 playNext */}
      <audio
        ref={audioRef}
        onEnded={playNext} 
        className="hidden"
      />
    </MusicContext.Provider>
  );
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
}