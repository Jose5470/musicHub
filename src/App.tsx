import React, { useState, useRef, useEffect } from 'react';
import { themes, Song, Theme } from './data';
import { Play, Pause, SkipForward, SkipBack, Volume2, Menu, X, Music, Upload, Loader2 } from 'lucide-react';

export default function App() {
  const [activeThemeId, setActiveThemeId] = useState<string>(themes[0].id);
  const [activeSong, setActiveSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [realSongData, setRealSongData] = useState<Record<string, {audioUrl?: string, imageUrl?: string}>>({});
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const activeTheme = themes.find(t => t.id === activeThemeId) || themes[0];
  const currentAudioUrl = activeSong ? (realSongData[activeSong.id]?.audioUrl || activeSong.audioUrl) : '';
  const currentImageUrl = activeSong ? (realSongData[activeSong.id]?.imageUrl || activeSong.imageUrl) : '';

  useEffect(() => {
    if (activeSong && audioRef.current && currentAudioUrl && !isLoadingAudio) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Audio playback failed:", e));
    }
  }, [activeSong, currentAudioUrl, isLoadingAudio]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSongSelect = async (song: Song) => {
    setActiveSong(song);
    setIsPlaying(false);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }

    // Fetch real music preview and album art from iTunes API
    if (!realSongData[song.id]?.audioUrl && !realSongData[song.id]?.imageUrl) {
      setIsLoadingAudio(true);
      try {
        const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(song.artist + ' ' + song.title)}&entity=song&limit=1`);
        const data = await res.json();
        if (data.results && data.results[0]) {
          setRealSongData(prev => ({
            ...prev,
            [song.id]: {
              ...prev[song.id],
              audioUrl: prev[song.id]?.audioUrl || data.results[0].previewUrl,
              imageUrl: prev[song.id]?.imageUrl || data.results[0].artworkUrl100.replace('100x100bb', '400x400bb')
            }
          }));
        }
      } catch (error) {
        console.error("Failed to fetch real song data:", error);
      } finally {
        setIsLoadingAudio(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeSong) {
      const url = URL.createObjectURL(file);
      setRealSongData(prev => ({
        ...prev,
        [activeSong.id]: {
          ...prev[activeSong.id],
          audioUrl: url
        }
      }));
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play().then(() => setIsPlaying(true));
        }
      }, 100);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-50 font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Volume2 className="w-6 h-6 text-indigo-500" />
            MusicHub
          </h1>
          <button className="lg:hidden text-zinc-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-8">
          <div>
            <h2 className="px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Themes</h2>
            <div className="space-y-1">
              {themes.map(theme => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setActiveThemeId(theme.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      activeThemeId === theme.id 
                        ? 'bg-indigo-500/10 text-indigo-400' 
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {theme.title}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-zinc-950">
        {/* Header */}
        <header className="h-16 flex items-center px-4 lg:px-8 border-b border-zinc-800/50 shrink-0">
          <button 
            className="lg:hidden mr-4 text-zinc-400 hover:text-white"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-zinc-100">{activeTheme.title}</h2>
        </header>

        {/* Content Split: Song List & Player */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          
          {/* Song List */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8 lg:border-r border-zinc-800/50">
            <div className="max-w-3xl mx-auto space-y-10">
              {activeTheme.sections.map((section, idx) => (
                <section key={idx}>
                  <h3 className="text-xl font-bold text-white mb-4 pb-2 border-b border-zinc-800">{section.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {[...section.songs].sort((a, b) => a.title.localeCompare(b.title)).map((song) => (
                      <button
                        key={song.id}
                        onClick={() => handleSongSelect(song)}
                        className={`flex items-center gap-4 p-3 rounded-xl transition-all text-left group ${
                          activeSong?.id === song.id 
                            ? 'bg-indigo-500/20 ring-1 ring-indigo-500/50' 
                            : 'bg-zinc-900/50 hover:bg-zinc-800'
                        }`}
                      >
                        <div className="relative w-12 h-12 rounded-md overflow-hidden shrink-0 bg-zinc-800">
                          <img src={realSongData[song.id]?.imageUrl || song.imageUrl} alt={song.artist} className="w-full h-full object-cover" />
                          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center ${activeSong?.id === song.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}>
                            {activeSong?.id === song.id && isPlaying ? (
                              <Volume2 className="w-5 h-5 text-white" />
                            ) : (
                              <Play className="w-5 h-5 text-white ml-0.5" />
                            )}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-medium truncate ${activeSong?.id === song.id ? 'text-indigo-400' : 'text-zinc-100'}`}>
                            {song.title}
                          </p>
                          <p className="text-xs text-zinc-500 truncate mt-0.5">{song.artist}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>

          {/* Lyrics & Player Panel */}
          <div className={`w-full lg:w-96 bg-zinc-900 flex flex-col shrink-0 ${!activeSong ? 'hidden lg:flex' : 'flex'}`}>
            {activeSong ? (
              <>
                {/* Now Playing Header */}
                <div className="p-6 border-b border-zinc-800 flex flex-col items-center text-center shrink-0">
                  <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-2xl shadow-black/50 mb-6 relative group bg-zinc-800 flex items-center justify-center">
                    {isLoadingAudio ? (
                      <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                    ) : (
                      <>
                        <img src={currentImageUrl} alt={activeSong.artist} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      </>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{activeSong.title}</h3>
                  <p className="text-zinc-400">{activeSong.artist}</p>
                  
                  <div className="mt-4">
                    <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 hover:text-white cursor-pointer bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors">
                      <Upload className="w-4 h-4" />
                      Upload Full MP3
                      <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>

                {/* Lyrics Area */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Lyrics</h4>
                  <div className="whitespace-pre-line text-zinc-300 text-sm leading-relaxed font-medium">
                    {activeSong.lyrics}
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/95 backdrop-blur shrink-0">
                  <audio 
                    ref={audioRef} 
                    src={currentAudioUrl} 
                    onEnded={() => setIsPlaying(false)}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  />
                  <div className="flex items-center justify-center gap-6">
                    <button className="text-zinc-400 hover:text-white transition-colors">
                      <SkipBack className="w-6 h-6" fill="currentColor" />
                    </button>
                    <button 
                      onClick={togglePlay}
                      disabled={isLoadingAudio}
                      className="w-14 h-14 flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white rounded-full transition-transform hover:scale-105 active:scale-95"
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" fill="currentColor" />
                      ) : (
                        <Play className="w-6 h-6 ml-1" fill="currentColor" />
                      )}
                    </button>
                    <button className="text-zinc-400 hover:text-white transition-colors">
                      <SkipForward className="w-6 h-6" fill="currentColor" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-500">
                <Music className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium text-zinc-400">No song selected</p>
                <p className="text-sm mt-2">Choose a song from the list to view lyrics and play music.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}
