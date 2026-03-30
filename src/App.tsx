/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { Radio, Play, Pause, SkipBack, SkipForward, Volume2, User, Newspaper, Compass, Library, Trash2, Edit2, Plus } from 'lucide-react';
import { INITIAL_STATIONS, INITIAL_NEWS_SOURCES } from './constants';
import { Station, NewsSource } from './types';

const AdminDashboard = ({ stations, setStations, newsSources, setNewsSources, onClose }: any) => {
  const [newStation, setNewStation] = useState({ name: '', slogan: '' });
  const [newSource, setNewSource] = useState({ name: '', url: '' });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-red-500">Panel Administrador</h2>
        <button onClick={onClose} className="text-slate-400">Cerrar</button>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Gestionar Emisoras</h3>
          {stations.map((s: Station) => (
            <div key={s.id} className="flex items-center justify-between bg-slate-900 p-3 rounded mb-2">
              <span className="text-white">{s.name}</span>
              <button onClick={() => setStations(stations.filter((st: Station) => st.id !== s.id))} className="text-red-500"><Trash2 size={18} /></button>
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-4">
            <input placeholder="Nombre" value={newStation.name} onChange={e => setNewStation({...newStation, name: e.target.value})} className="flex-1 p-2 bg-slate-800 rounded text-white" />
            <input placeholder="URL de Streaming" value={newStation.slogan} onChange={e => setNewStation({...newStation, slogan: e.target.value})} className="flex-1 p-2 bg-slate-800 rounded text-white" />
            <button onClick={() => setStations([...stations, { id: Date.now().toString(), name: newStation.name, streamUrl: newStation.slogan, logo: 'radio' }])} className="bg-red-600 p-2 rounded text-white font-bold">Agregar Emisora</button>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Gestionar Noticias</h3>
          {newsSources.map((ns: NewsSource) => (
            <div key={ns.id} className="flex items-center justify-between bg-slate-900 p-3 rounded mb-2">
              <span className="text-white">{ns.name}</span>
              <button onClick={() => setNewsSources(newsSources.filter((n: NewsSource) => n.id !== ns.id))} className="text-red-500"><Trash2 size={18} /></button>
            </div>
          ))}
          <div className="flex flex-col gap-2 mt-4">
            <input placeholder="Nombre" value={newSource.name} onChange={e => setNewSource({...newSource, name: e.target.value})} className="flex-1 p-2 bg-slate-800 rounded text-white" />
            <input placeholder="URL del Sitio" value={newSource.url} onChange={e => setNewSource({...newSource, url: e.target.value})} className="flex-1 p-2 bg-slate-800 rounded text-white" />
            <button onClick={() => setNewsSources([...newsSources, { id: Date.now().toString(), name: newSource.name, url: newSource.url, logo: newSource.name[0], headlines: [] }])} className="bg-red-600 p-2 rounded text-white font-bold">Agregar Sitio</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // Use INITIAL_STATIONS directly to ensure updated URLs are applied, ignoring stale localStorage
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [newsSources, setNewsSources] = useState<NewsSource[]>(INITIAL_NEWS_SOURCES);
  const [currentStation, setCurrentStation] = useState<Station>(stations[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    localStorage.setItem('stations', JSON.stringify(stations));
    localStorage.setItem('newsSources', JSON.stringify(newsSources));
  }, [stations, newsSources]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.unload();
    }
    soundRef.current = new Howl({
      src: [currentStation.streamUrl],
      html5: true,
      format: ['mp3', 'aac'],
      autoplay: isPlaying,
      onplayerror: (id, error) => {
        console.error("Playback failed", error);
        soundRef.current?.once('unlock', () => soundRef.current?.play());
      }
    });
  }, [currentStation]);

  useEffect(() => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.play();
      } else {
        soundRef.current.pause();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    newsSources.forEach(source => {
      fetch('/api/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: source.url })
      })
      .then(res => res.json())
      .then(headlines => {
        setNewsSources(prev => prev.map(s => s.id === source.id ? { ...s, headlines } : s));
      })
      .catch(err => console.error(err));
    });
  }, []);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    localStorage.setItem('stations', JSON.stringify(stations));
    localStorage.setItem('newsSources', JSON.stringify(newsSources));
  }, [stations, newsSources]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'RadFam26') {
      setIsAdmin(true);
      setShowLogin(false);
      setShowAdmin(true);
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-slate-950/80 backdrop-blur-md transition-colors">
        <h1 className="text-xl font-bold tracking-tighter text-red-500">RadioNote</h1>
        <button onClick={() => isAdmin ? setShowAdmin(true) : setShowLogin(true)} className="text-red-500 p-2 rounded-full hover:bg-slate-800">
          <User size={24} />
        </button>
      </header>

      {showLogin && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <form onSubmit={handleLogin} className="bg-slate-900 p-8 rounded-2xl w-full max-w-sm border border-slate-800">
            <h2 className="text-xl font-bold mb-4 text-white">Inicio de Sesión Administrador</h2>
            <input type="text" placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 mb-4 border rounded bg-slate-800 border-slate-700 text-white" />
            <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 mb-4 border rounded bg-slate-800 border-slate-700 text-white" />
            <button type="submit" className="w-full bg-red-600 text-white p-2 rounded font-bold">Entrar</button>
            <button onClick={() => setShowLogin(false)} className="w-full mt-2 text-slate-400">Cancelar</button>
          </form>
        </div>
      )}

      {showAdmin && <AdminDashboard stations={stations} setStations={setStations} newsSources={newsSources} setNewsSources={setNewsSources} onClose={() => setShowAdmin(false)} />}

      <main className="pt-16 pb-32">
        <section className="px-6 py-8 bg-slate-900">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs uppercase tracking-wider font-bold text-red-500">Emisiones en Vivo</span>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6">
            {stations.map((station) => (
              <button 
                key={station.id}
                onClick={() => {
                  setCurrentStation(station);
                  setIsPlaying(true);
                }}
                className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center p-3 text-center shadow-sm transition-transform ${currentStation.id === station.id ? 'bg-slate-800 border-b-2 border-red-600' : 'bg-slate-800'}`}
              >
                <div className="relative">
                  <Radio size={24} className={currentStation.id === station.id ? 'text-red-500' : 'text-slate-500'} />
                  {currentStation.id === station.id && isPlaying && (
                    <div className="absolute -top-1 -right-1 flex gap-0.5">
                      <div className="w-1 h-3 bg-red-500 animate-pulse"></div>
                      <div className="w-1 h-4 bg-red-500 animate-pulse delay-75"></div>
                      <div className="w-1 h-2 bg-red-500 animate-pulse delay-150"></div>
                    </div>
                  )}
                </div>
                <span className="text-[10px] font-bold uppercase mt-2 text-slate-200">{station.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 bg-slate-900 rounded-2xl p-6 shadow-lg border border-slate-800">
            <h2 className="text-lg font-bold text-red-500">{currentStation.name}</h2>
            <p className="text-sm text-slate-400 italic">"{currentStation.slogan}"</p>
            
            <div className="mt-8 flex flex-col items-center">
              <div className="flex items-center gap-10">
                <button 
                  onClick={() => {
                    const idx = stations.findIndex(s => s.id === currentStation.id);
                    setCurrentStation(stations[(idx - 1 + stations.length) % stations.length]);
                  }}
                  className="text-slate-600 hover:text-white transition-colors"
                >
                  <SkipBack size={32} />
                </button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center text-white shadow-xl"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} />}
                </button>
                <button 
                  onClick={() => {
                    const idx = stations.findIndex(s => s.id === currentStation.id);
                    setCurrentStation(stations[(idx + 1) % stations.length]);
                  }}
                  className="text-slate-600 hover:text-white transition-colors"
                >
                  <SkipForward size={32} />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
