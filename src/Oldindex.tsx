import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Trophy, 
  Calendar, 
  Settings, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  User as UserIcon,
  ShieldAlert,
  BarChart3,
  X,
  Target,
  Trash2,
  Edit,
  LayoutGrid,
  List,
  Clock,
  LogIn,
  LogOut,
  Mail,
  Phone,
  Lock,
  Save
} from 'lucide-react';

// --- Types ---

type Role = 'Admin' | 'Spielleiter' | 'Spieler';

interface Player {
  id: string;
  name: string;
  adName: string;
  pin: string;
  role: Role;
  email?: string;
  phone?: string;
}

interface Match {
  id: string;
  player1Id: string;
  player2Id: string;
  score1: number;
  score2: number;
  completed: boolean;
  dateLabel: string;
  scheduledDate?: string;
  reportedBy?: string; 
  matchday: number;
}

interface PlayerStats {
  id: string;
  name: string;
  adName: string;
  played: number;
  won: number;
  lost: number;
  legsWon: number;
  legsLost: number;
  legDiff: number;
  points: number;
}

// --- Initial Data ---

const INITIAL_PLAYERS: Player[] = [
  { id: 'p1', name: 'Peter', adName: 'Pyrrha', pin: '1234', role: 'Admin' },
  { id: 'p2', name: 'Klaus', adName: 'Schummi', pin: '1234', role: 'Spieler' },
  { id: 'p3', name: 'Alex', adName: 'Schummi24', pin: '1234', role: 'Spieler' },
  { id: 'p4', name: 'Oli', adName: 'oli.djk', pin: '1234', role: 'Spieler' },
  { id: 'p5', name: 'Jason', adName: 'Black_Mamba', pin: '1234', role: 'Spielleiter' },
  { id: 'p6', name: 'Sven', adName: 'Svensonbbg', pin: '1234', role: 'Spieler' },
  { id: 'p7', name: 'Kevin', adName: 'neocortex', pin: '1234', role: 'Spieler' },
  { id: 'p8', name: 'Chris', adName: 'Behrli78', pin: '1234', role: 'Spielleiter' },
  { id: 'p9', name: 'Maggi', adName: 'MCMLXXIX', pin: '1234', role: 'Spieler' },
  { id: 'p10', name: 'Nico', adName: 'Kurzer117', pin: '1234', role: 'Spieler' },
];

const INITIAL_MATCHES: Match[] = [
  { id: 's1m1', player1Id: 'p1', player2Id: 'p10', score1: 0, score2: 0, completed: false, dateLabel: 'KW 3', matchday: 1 },
  { id: 's1m2', player1Id: 'p2', player2Id: 'p9', score1: 0, score2: 0, completed: false, dateLabel: 'KW 3', matchday: 1 },
  { id: 's1m3', player1Id: 'p3', player2Id: 'p8', score1: 0, score2: 0, completed: false, dateLabel: 'KW 3', matchday: 1 },
  { id: 's1m4', player1Id: 'p4', player2Id: 'p7', score1: 0, score2: 0, completed: false, dateLabel: 'KW 3', matchday: 1 },
  { id: 's1m5', player1Id: 'p5', player2Id: 'p6', score1: 0, score2: 0, completed: false, dateLabel: 'KW 3', matchday: 1 },
  { id: 's2m1', player1Id: 'p9', player2Id: 'p1', score1: 0, score2: 0, completed: false, dateLabel: 'KW 4', matchday: 2 },
  { id: 's2m2', player1Id: 'p10', player2Id: 'p8', score1: 0, score2: 0, completed: false, dateLabel: 'KW 4', matchday: 2 },
  { id: 's2m3', player1Id: 'p7', player2Id: 'p2', score1: 0, score2: 0, completed: false, dateLabel: 'KW 4', matchday: 2 },
  { id: 's2m4', player1Id: 'p6', player2Id: 'p3', score1: 0, score2: 0, completed: false, dateLabel: 'KW 4', matchday: 2 },
  { id: 's2m5', player1Id: 'p5', player2Id: 'p4', score1: 0, score2: 0, completed: false, dateLabel: 'KW 4', matchday: 2 },
  { id: 's3m1', player1Id: 'p8', player2Id: 'p1', score1: 0, score2: 0, completed: false, dateLabel: 'KW 5', matchday: 3 },
  { id: 's3m2', player1Id: 'p9', player2Id: 'p7', score1: 0, score2: 0, completed: false, dateLabel: 'KW 5', matchday: 3 },
  { id: 's3m3', player1Id: 'p10', player2Id: 'p6', score1: 0, score2: 0, completed: false, dateLabel: 'KW 5', matchday: 3 },
  { id: 's3m4', player1Id: 'p2', player2Id: 'p5', score1: 0, score2: 0, completed: false, dateLabel: 'KW 5', matchday: 3 },
  { id: 's3m5', player1Id: 'p3', player2Id: 'p4', score1: 0, score2: 0, completed: false, dateLabel: 'KW 5', matchday: 3 },
  { id: 's4m1', player1Id: 'p1', player2Id: 'p7', score1: 0, score2: 0, completed: false, dateLabel: 'KW 6', matchday: 4 },
  { id: 's4m2', player1Id: 'p8', player2Id: 'p6', score1: 0, score2: 0, completed: false, dateLabel: 'KW 6', matchday: 4 },
  { id: 's4m3', player1Id: 'p5', player2Id: 'p9', score1: 0, score2: 0, completed: false, dateLabel: 'KW 6', matchday: 4 },
  { id: 's4m4', player1Id: 'p4', player2Id: 'p10', score1: 0, score2: 0, completed: false, dateLabel: 'KW 6', matchday: 4 },
  { id: 's4m5', player1Id: 'p2', player2Id: 'p3', score1: 0, score2: 0, completed: false, dateLabel: 'KW 6', matchday: 4 },
  { id: 's5m1', player1Id: 'p6', player2Id: 'p1', score1: 0, score2: 0, completed: false, dateLabel: 'KW 7', matchday: 5 },
  { id: 's5m2', player1Id: 'p5', player2Id: 'p7', score1: 0, score2: 0, completed: false, dateLabel: 'KW 7', matchday: 5 },
  { id: 's5m3', player1Id: 'p4', player2Id: 'p8', score1: 0, score2: 0, completed: false, dateLabel: 'KW 7', matchday: 5 },
  { id: 's5m4', player1Id: 'p3', player2Id: 'p9', score1: 0, score2: 0, completed: false, dateLabel: 'KW 7', matchday: 5 },
  { id: 's5m5', player1Id: 'p10', player2Id: 'p2', score1: 0, score2: 0, completed: false, dateLabel: 'KW 7', matchday: 5 },
  { id: 's6m1', player1Id: 'p1', player2Id: 'p5', score1: 0, score2: 0, completed: false, dateLabel: 'KW 8', matchday: 6 },
  { id: 's6m2', player1Id: 'p6', player2Id: 'p4', score1: 0, score2: 0, completed: false, dateLabel: 'KW 8', matchday: 6 },
  { id: 's6m3', player1Id: 'p7', player2Id: 'p3', score1: 0, score2: 0, completed: false, dateLabel: 'KW 8', matchday: 6 },
  { id: 's6m4', player1Id: 'p8', player2Id: 'p2', score1: 0, score2: 0, completed: false, dateLabel: 'KW 8', matchday: 6 },
  { id: 's6m5', player1Id: 'p9', player2Id: 'p10', score1: 0, score2: 0, completed: false, dateLabel: 'KW 8', matchday: 6 },
  { id: 's7m1', player1Id: 'p4', player2Id: 'p1', score1: 0, score2: 0, completed: false, dateLabel: 'KW 9', matchday: 7 },
  { id: 's7m2', player1Id: 'p3', player2Id: 'p5', score1: 0, score2: 0, completed: false, dateLabel: 'KW 9', matchday: 7 },
  { id: 's7m3', player1Id: 'p2', player2Id: 'p6', score1: 0, score2: 0, completed: false, dateLabel: 'KW 9', matchday: 7 },
  { id: 's7m4', player1Id: 'p10', player2Id: 'p7', score1: 0, score2: 0, completed: false, dateLabel: 'KW 9', matchday: 7 },
  { id: 's7m5', player1Id: 'p9', player2Id: 'p8', score1: 0, score2: 0, completed: false, dateLabel: 'KW 9', matchday: 7 },
  { id: 's8m1', player1Id: 'p1', player2Id: 'p3', score1: 0, score2: 0, completed: false, dateLabel: 'KW 10', matchday: 8 },
  { id: 's8m2', player1Id: 'p4', player2Id: 'p2', score1: 0, score2: 0, completed: false, dateLabel: 'KW 10', matchday: 8 },
  { id: 's8m3', player1Id: 'p5', player2Id: 'p10', score1: 0, score2: 0, completed: false, dateLabel: 'KW 10', matchday: 8 },
  { id: 's8m4', player1Id: 'p6', player2Id: 'p9', score1: 0, score2: 0, completed: false, dateLabel: 'KW 10', matchday: 8 },
  { id: 's8m5', player1Id: 'p7', player2Id: 'p8', score1: 0, score2: 0, completed: false, dateLabel: 'KW 10', matchday: 8 },
  { id: 's9m1', player1Id: 'p2', player2Id: 'p1', score1: 0, score2: 0, completed: false, dateLabel: 'KW 11', matchday: 9 },
  { id: 's9m2', player1Id: 'p10', player2Id: 'p3', score1: 0, score2: 0, completed: false, dateLabel: 'KW 11', matchday: 9 },
  { id: 's9m3', player1Id: 'p9', player2Id: 'p4', score1: 0, score2: 0, completed: false, dateLabel: 'KW 11', matchday: 9 },
  { id: 's9m4', player1Id: 'p8', player2Id: 'p5', score1: 0, score2: 0, completed: false, dateLabel: 'KW 11', matchday: 9 },
  { id: 's9m5', player1Id: 'p7', player2Id: 'p6', score1: 0, score2: 0, completed: false, dateLabel: 'KW 11', matchday: 9 },
];

// --- Utility Components ---

const Badge: React.FC<{ children?: React.ReactNode; color: string }> = ({ children, color }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${color}`}>
    {children}
  </span>
);

const Card: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden shadow-xl ${className}`}>
    {children}
  </div>
);

// --- Main App ---

export default function DartLigaApp() {
  const [currentUser, setCurrentUser] = useState<Player | null>(() => {
    const saved = localStorage.getItem('bamberg_currentUser_v6');
    return saved ? JSON.parse(saved) : null;
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const saved = localStorage.getItem('bamberg_players_v6');
    return saved ? JSON.parse(saved) : INITIAL_PLAYERS;
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('bamberg_matches_v6');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [activeTab, setActiveTab] = useState<'table' | 'schedule' | 'admin' | 'profile'>('table');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('bamberg_players_v6', JSON.stringify(players));
    localStorage.setItem('bamberg_matches_v6', JSON.stringify(matches));
    if (currentUser) {
      localStorage.setItem('bamberg_currentUser_v6', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bamberg_currentUser_v6');
    }
  }, [players, matches, currentUser]);

  const playerStats: PlayerStats[] = useMemo(() => {
    const statsMap: Record<string, PlayerStats> = {};
    players.forEach(p => {
      statsMap[p.id] = {
        id: p.id, name: p.name, adName: p.adName, played: 0, won: 0, lost: 0, legsWon: 0, legsLost: 0, legDiff: 0, points: 0
      };
    });
    matches.filter(m => m.completed).forEach(m => {
      const p1 = statsMap[m.player1Id];
      const p2 = statsMap[m.player2Id];
      if (p1 && p2) {
        p1.played += 1; p2.played += 1;
        p1.legsWon += m.score1; p1.legsLost += m.score2;
        p2.legsWon += m.score2; p2.legsLost += m.score1;
        if (m.score1 > m.score2) { p1.won += 1; p1.points += 2; p2.lost += 1; } 
        else if (m.score2 > m.score1) { p2.won += 1; p2.points += 2; p1.lost += 1; }
      }
    });
    return Object.values(statsMap)
      .map(s => ({ ...s, legDiff: s.legsWon - s.legsLost }))
      .sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.legDiff !== a.legDiff) return b.legDiff - a.legDiff;
        return b.legsWon - a.legsWon;
      });
  }, [players, matches]);

  // --- Login Screen ---
  const LoginScreen = () => {
    const [name, setName] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
      e.preventDefault();
      const user = players.find(p => p.name.toLowerCase() === name.toLowerCase() && p.pin === pin);
      if (user) {
        setCurrentUser(user);
        setError('');
      } else {
        setError('Name oder PIN falsch.');
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 overflow-hidden relative">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
        
        <Card className="w-full max-w-md p-10 space-y-10 animate-in fade-in zoom-in duration-500 relative z-10">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl rotate-3 mb-6">
              <Target className="text-white" size={48} />
            </div>
            <h1 className="text-3xl font-black text-white uppercase tracking-tighter leading-tight">1. Bamberger<br/>Autodarts Liga</h1>
            <p className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Member Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Benutzername</label>
              <div className="relative">
                <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-14 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-700"
                  placeholder="Dein Vorname"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">4-stellige PIN</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="password"
                  maxLength={4}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-14 pr-4 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all tracking-[1em] placeholder-slate-700 font-mono"
                  placeholder="••••"
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-xs text-center font-bold bg-red-500/10 py-3 rounded-xl border border-red-500/20">{error}</p>}

            <button type="submit" className="w-full bg-white text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl hover:bg-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              Anmelden <LogIn size={20} />
            </button>
          </form>
        </Card>
      </div>
    );
  };

  if (!currentUser) return <LoginScreen />;

  // --- Views ---

  const TableView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-2">
            <Trophy className="text-yellow-500" /> Tabelle
          </h2>
          <p className="text-slate-400 text-sm mt-1">1. Bamberger Autodarts Liga - Saison 2026</p>
        </div>
        <Badge color="bg-green-500/20 text-green-400 border border-green-500/30">Live Update</Badge>
      </div>
      
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-6 py-4 font-bold">Pos</th>
                <th className="px-6 py-4 font-bold">Spieler</th>
                <th className="px-6 py-4 font-bold text-center">Sp</th>
                <th className="px-6 py-4 font-bold text-center">S</th>
                <th className="px-6 py-4 font-bold text-center">N</th>
                <th className="px-6 py-4 font-bold text-center">Legs</th>
                <th className="px-6 py-4 font-bold text-center text-white">Pkt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {playerStats.map((p, idx) => (
                <tr key={p.id} className="hover:bg-slate-700/20 transition-all cursor-pointer group" onClick={() => { setSelectedPlayerId(p.id); setActiveTab('profile'); }}>
                  <td className="px-6 py-5 font-mono text-slate-500 font-bold">{idx + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{p.name}</span>
                      <span className="text-xs text-slate-500 font-mono">@{p.adName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center text-slate-300 font-medium">{p.played}</td>
                  <td className="px-6 py-5 text-center text-green-400 font-medium">{p.won}</td>
                  <td className="px-6 py-5 text-center text-red-400 font-medium">{p.lost}</td>
                  <td className="px-6 py-5 text-center text-slate-400 font-mono">{p.legsWon}:{p.legsLost}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="bg-slate-900 px-3 py-1 rounded-lg font-black text-white ring-1 ring-slate-700 shadow-lg">{p.points}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const ScheduleView = () => {
    const [viewMode, setViewMode] = useState<'season' | 'matchday'>('season');
    const [currentMatchdayFilter, setCurrentMatchdayFilter] = useState(1);
    const [reportingId, setReportingId] = useState<string | null>(null);
    const [schedulingId, setSchedulingId] = useState<string | null>(null);
    const [score1, setScore1] = useState(0);
    const [score2, setScore2] = useState(0);
    const [tempDate, setTempDate] = useState('');

    const matchdays = Array.from(new Set(matches.map(m => m.matchday))).sort((a, b) => a - b);
    const displayedMatches = useMemo(() => {
      if (viewMode === 'season') return [...matches].sort((a, b) => a.matchday - b.matchday);
      return matches.filter(m => m.matchday === currentMatchdayFilter);
    }, [matches, viewMode, currentMatchdayFilter]);

    const submitResult = (matchId: string) => {
      if (score1 < 5 && score2 < 5) { alert("First to 5 (ein Spieler braucht 5 Legs)!"); return; }
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, score1, score2, completed: true, reportedBy: currentUser.name } : m));
      setReportingId(null);
    };

    const submitSchedule = (matchId: string) => {
      if (!tempDate) return;
      setMatches(prev => prev.map(m => m.id === matchId ? { ...m, scheduledDate: tempDate } : m));
      setSchedulingId(null);
      setTempDate('');
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2"><Calendar className="text-blue-500" /> Spielplan</h2>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start">
            <button onClick={() => setViewMode('season')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'season' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Saison</button>
            <button onClick={() => setViewMode('matchday')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${viewMode === 'matchday' ? 'bg-white text-slate-950 shadow-lg' : 'text-slate-500 hover:text-white'}`}>Spieltag</button>
          </div>
        </div>

        {viewMode === 'matchday' && (
          <div className="flex flex-wrap gap-2 items-center bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
            {matchdays.map(md => (
              <button key={md} onClick={() => setCurrentMatchdayFilter(md)} className={`w-10 h-10 rounded-xl font-bold transition-all ${currentMatchdayFilter === md ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-white'}`}>{md}</button>
            ))}
          </div>
        )}
        
        <div className="grid gap-4">
          {displayedMatches.map(m => {
            const p1 = players.find(p => p.id === m.player1Id);
            const p2 = players.find(p => p.id === m.player2Id);
            const isOwnMatch = m.player1Id === currentUser.id || m.player2Id === currentUser.id;
            return (
              <Card key={m.id} className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 transition-all hover:bg-slate-800/60 ${isOwnMatch ? 'border-l-blue-500 bg-blue-500/10' : 'border-l-slate-700'}`}>
                <div className="flex items-center gap-6 flex-1">
                  <div className="text-center min-w-[100px] border-r border-slate-700/50 pr-6">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{m.dateLabel}</div>
                    {m.scheduledDate && <div className="text-xs text-blue-400 font-black flex items-center justify-center gap-1 mt-1"><Clock size={10} /> {m.scheduledDate}</div>}
                    <div className="mt-2">
                      <Badge color={m.completed ? "bg-slate-900 text-slate-500 border border-slate-700" : "bg-blue-500/20 text-blue-400 border border-blue-500/20"}>{m.completed ? "Beendet" : "Offen"}</Badge>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-3 items-center gap-4">
                    <div className="text-right">
                      <div className="font-black text-white text-lg">{p1?.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono">@{p1?.adName}</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`text-2xl font-black px-4 py-2 rounded-xl border ${m.completed ? 'bg-slate-900 text-blue-400 border-blue-500/30' : 'bg-slate-950 text-slate-700 border-slate-800'}`}>
                        {m.completed ? `${m.score1} : ${m.score2}` : 'VS'}
                      </div>
                      {m.reportedBy && <div className="text-[8px] text-slate-600 mt-2 uppercase font-bold tracking-tighter">Report: {m.reportedBy}</div>}
                    </div>
                    <div className="text-left">
                      <div className="font-black text-white text-lg">{p2?.name}</div>
                      <div className="text-[9px] text-slate-500 font-mono">@{p2?.adName}</div>
                    </div>
                  </div>
                </div>

                {!m.completed && reportingId !== m.id && schedulingId !== m.id && (
                  <div className="flex gap-2">
                    <button onClick={() => { setTempDate(m.scheduledDate || ''); setSchedulingId(m.id); }} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all">Termin</button>
                    <button onClick={() => { setScore1(0); setScore2(0); setReportingId(m.id); }} className="bg-white hover:bg-slate-200 text-slate-950 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">Ergebnis</button>
                  </div>
                )}

                {schedulingId === m.id && (
                  <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-2xl border border-indigo-500/40 animate-in fade-in slide-in-from-right-4">
                    <input className="w-24 bg-slate-800 text-white text-[10px] p-2 rounded-lg border border-slate-700 focus:border-indigo-500 outline-none font-bold" placeholder="z.B. Sa, 19h" value={tempDate} onChange={e => setTempDate(e.target.value)} />
                    <button onClick={() => submitSchedule(m.id)} className="bg-indigo-600 text-white p-2 rounded-lg shadow-lg"><CheckCircle2 size={16}/></button>
                    <button onClick={() => setSchedulingId(null)} className="text-slate-500 hover:text-white p-1"><X size={16}/></button>
                  </div>
                )}

                {reportingId === m.id && (
                  <div className="flex items-center gap-2 bg-slate-900 p-2.5 rounded-2xl border border-blue-500/40 animate-in fade-in slide-in-from-right-4">
                    <input type="number" className="w-12 bg-slate-800 text-center p-2 rounded-lg border border-slate-700 outline-none text-white font-black" value={score1} onChange={e => setScore1(parseInt(e.target.value) || 0)} />
                    <span className="text-slate-600 font-black">:</span>
                    <input type="number" className="w-12 bg-slate-800 text-center p-2 rounded-lg border border-slate-700 outline-none text-white font-black" value={score2} onChange={e => setScore2(parseInt(e.target.value) || 0)} />
                    <button onClick={() => submitResult(m.id)} className="bg-green-600 text-white p-2 rounded-lg shadow-lg ml-2"><CheckCircle2 size={16}/></button>
                    <button onClick={() => setReportingId(null)} className="text-slate-500 hover:text-white p-1"><X size={16}/></button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const ProfileView = () => {
    const statsPlayer = players.find(s => s.id === (selectedPlayerId || currentUser.id));
    const isOwnProfile = !selectedPlayerId || selectedPlayerId === currentUser.id;

    const [editEmail, setEditEmail] = useState(statsPlayer?.email || '');
    const [editPhone, setEditPhone] = useState(statsPlayer?.phone || '');
    const [editPin, setEditPin] = useState(statsPlayer?.pin || '');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleUpdate = () => {
      setPlayers(prev => prev.map(p => p.id === currentUser.id ? { ...p, email: editEmail, phone: editPhone, pin: editPin } : p));
      setCurrentUser(prev => prev ? { ...prev, email: editEmail, phone: editPhone, pin: editPin } : null);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    };

    return (
      <div className="space-y-8 pb-32">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white flex items-center gap-3"><UserIcon className="text-indigo-400" /> Profil</h2>
          <button onClick={() => { setCurrentUser(null); setActiveTab('table'); }} className="text-red-500 hover:text-red-400 flex items-center gap-1 font-bold text-xs uppercase transition-all"><LogOut size={16} /> Abmelden</button>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 rounded-[2.5rem] border border-slate-800 shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -z-10" />
          <div className="w-28 h-28 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[2.5rem] flex items-center justify-center border-4 border-slate-800 shadow-2xl rotate-3">
             <UserIcon size={56} className="text-white" />
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-5xl font-black text-white tracking-tighter mb-2">{statsPlayer?.name}</h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="text-blue-400 font-mono font-bold text-lg">@{statsPlayer?.adName}</span>
              <Badge color="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">{statsPlayer?.role}</Badge>
            </div>
          </div>
        </div>

        {isOwnProfile && (
          <Card className="p-8 space-y-8">
             <div className="flex items-center gap-2 text-white font-black text-xl border-b border-slate-800/50 pb-4">
               <Edit size={24} className="text-blue-500" /> Daten bearbeiten
             </div>
             <div className="grid md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">E-Mail Adresse</label>
                 <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editEmail} onChange={e => setEditEmail(e.target.value)} placeholder="name@beispiel.de" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Telefonnummer</label>
                 <div className="relative">
                   <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="0171 1234567" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Neuer PIN (4 Ziffern)</label>
                 <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                   <input maxLength={4} className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white text-sm font-mono tracking-[0.8em] focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={editPin} onChange={e => setEditPin(e.target.value)} />
                 </div>
               </div>
               <div className="flex items-end">
                 <button onClick={handleUpdate} className="w-full bg-white text-slate-950 h-[60px] rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-slate-200 active:scale-[0.98] transition-all">
                   {saveSuccess ? <><CheckCircle2 className="text-green-600" size={20}/> Gespeichert</> : <><Save size={20}/> Änderungen speichern</>}
                 </button>
               </div>
             </div>
          </Card>
        )}

        {!isOwnProfile && (
           <Card className="p-8 space-y-6">
             <h4 className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Kontaktinformationen</h4>
             <div className="grid gap-4">
                <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-blue-400"><Mail size={20}/></div>
                  <span className="text-white font-medium">{statsPlayer?.email || 'Nicht hinterlegt'}</span>
                </div>
                <div className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800/50">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-green-400"><Phone size={20}/></div>
                  <span className="text-white font-medium">{statsPlayer?.phone || 'Nicht hinterlegt'}</span>
                </div>
             </div>
           </Card>
        )}
      </div>
    );
  };

  const ManagementView = () => {
    const [newName, setNewName] = useState('');
    const [newAdName, setNewAdName] = useState('');
    const [newRole, setNewRole] = useState<Role>('Spieler');
    
    const addUser = () => {
      if (!newName || !newAdName) return;
      const id = 'p' + (players.length + 1);
      setPlayers(prev => [...prev, { id, name: newName, adName: newAdName, role: newRole, pin: '1234' }]);
      setNewName(''); setNewAdName('');
      alert(`Benutzer ${newName} wurde mit Standard-PIN 1234 angelegt.`);
    };

    return (
      <div className="space-y-8 pb-32">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black text-white flex items-center gap-2"><ShieldAlert className="text-red-500" /> Liga-Verwaltung</h2>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8 space-y-6">
             <div className="flex items-center gap-3 text-white font-black text-xl border-b border-slate-800/50 pb-4">
               <Plus className="text-blue-500" size={24} /> Neuen Spieler anlegen
             </div>
             <div className="space-y-4">
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Vorname / Anzeigename</label>
                 <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newName} onChange={e => setNewName(e.target.value)} placeholder="z.B. Markus" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Autodarts Account</label>
                 <input className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={newAdName} onChange={e => setNewAdName(e.target.value)} placeholder="z.B. dartslord99" />
               </div>
               <div className="space-y-1">
                 <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Rolle im System</label>
                 <select className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white outline-none cursor-pointer" value={newRole} onChange={e => setNewRole(e.target.value as Role)}>
                   <option value="Spieler">Spieler (Normal)</option>
                   <option value="Spielleiter">Spielleiter (Darf Ergebnisse melden)</option>
                   <option value="Admin">Administrator (Darf alles)</option>
                 </select>
               </div>
               <button onClick={addUser} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:bg-blue-500 active:scale-[0.98] transition-all">Spieler hinzufügen</button>
             </div>
          </Card>

          <Card className="p-8 space-y-6">
             <div className="flex items-center gap-3 text-white font-black text-xl border-b border-slate-800/50 pb-4">
               <ShieldAlert className="text-yellow-500" size={24} /> System-Status
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
                   <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Spieler</div>
                   <div className="text-4xl font-black text-white">{players.length}</div>
                </div>
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
                   <div className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">Matches</div>
                   <div className="text-4xl font-black text-white">{matches.length}</div>
                </div>
             </div>
             <p className="text-slate-500 text-xs italic text-center px-4 leading-relaxed">Der Standard-PIN für neue Benutzer ist "1234". Bitte fordere die Spieler auf, diesen in ihrem Profil umgehend zu ändern.</p>
          </Card>
        </div>

        <Card className="p-8">
           <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">Kader-Übersicht</h3>
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {players.map(p => (
                <div key={p.id} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 flex justify-between items-center group hover:border-slate-700 transition-all">
                   <div>
                     <div className="text-white font-black">{p.name}</div>
                     <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">@{p.adName}</div>
                   </div>
                   <div className="flex flex-col items-end">
                     <Badge color={p.role === 'Admin' ? 'bg-red-500/20 text-red-500 border-red-500/30' : p.role === 'Spielleiter' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'}>{p.role}</Badge>
                     {currentUser.role === 'Admin' && p.id !== currentUser.id && (
                       <button onClick={() => { if(confirm('Spieler löschen?')) setPlayers(prev => prev.filter(x => x.id !== p.id)) }} className="text-red-900 hover:text-red-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                     )}
                   </div>
                </div>
              ))}
           </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="fixed top-0 left-0 right-0 h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-6 md:px-12 z-50">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => { setSelectedPlayerId(null); setActiveTab('table'); }}>
          <div className="w-12 h-12 bg-red-600 rounded-[1rem] flex items-center justify-center shadow-2xl rotate-3">
            <Target className="text-white" size={28} />
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black text-white uppercase leading-none block tracking-tighter">Bamberger</span>
            <span className="text-xs font-black text-blue-500 uppercase mt-0.5 block tracking-[0.15em]">Autodarts Liga</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden sm:block text-right">
             <div className="text-white font-black text-sm tracking-tight">{currentUser.name}</div>
             <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{currentUser.role}</div>
           </div>
           <button onClick={() => { setSelectedPlayerId(null); setActiveTab('profile'); }} className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-800 hover:border-slate-600 transition-all shadow-lg active:scale-95">
             <UserIcon size={22} className="text-slate-300" />
           </button>
        </div>
      </nav>

      <main className="pt-32 pb-40 max-w-5xl mx-auto px-6">
        {activeTab === 'table' && <TableView />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'profile' && <ProfileView />}
        {activeTab === 'admin' && <ManagementView />}
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-slate-900/90 backdrop-blur-3xl border border-slate-700/40 p-2.5 rounded-[2.5rem] shadow-2xl z-50 ring-1 ring-white/5">
        <button onClick={() => { setSelectedPlayerId(null); setActiveTab('table'); }} className={`flex flex-col items-center gap-1.5 px-8 py-3.5 rounded-3xl transition-all ${activeTab === 'table' ? 'bg-white text-slate-950 shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}>
          <Trophy size={22} strokeWidth={2.5} /><span className="text-[10px] font-black uppercase tracking-widest">Tabelle</span>
        </button>
        <button onClick={() => { setSelectedPlayerId(null); setActiveTab('schedule'); }} className={`flex flex-col items-center gap-1.5 px-8 py-3.5 rounded-3xl transition-all ${activeTab === 'schedule' ? 'bg-white text-slate-950 shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}>
          <Calendar size={22} strokeWidth={2.5} /><span className="text-[10px] font-black uppercase tracking-widest">Spiele</span>
        </button>
        {(currentUser.role === 'Admin' || currentUser.role === 'Spielleiter') && (
          <button onClick={() => { setSelectedPlayerId(null); setActiveTab('admin'); }} className={`flex flex-col items-center gap-1.5 px-8 py-3.5 rounded-3xl transition-all ${activeTab === 'admin' ? 'bg-white text-slate-950 shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}>
            <ShieldAlert size={22} strokeWidth={2.5} /><span className="text-[10px] font-black uppercase tracking-widest">Liga</span>
          </button>
        )}
      </div>

      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full -z-10 pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/5 blur-[120px] rounded-full -z-10 pointer-events-none" />
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<DartLigaApp />);
}
