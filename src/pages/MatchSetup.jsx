import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import { Coins, UserPlus, Plus, X, Shield, Club, Disc, Hand, Users, ChevronDown, ArrowLeft, Trophy } from 'lucide-react';
import { toast } from 'sonner';

const ROLES = [
    { id: 'batsman', label: 'Batsman', icon: Club, color: 'text-blue-500' },
    { id: 'bowler', label: 'Bowler', icon: Disc, color: 'text-purple-500' },
    { id: 'allrounder', label: 'All Rounder', icon: Shield, color: 'text-orange-500' },
    { id: 'wicketkeeper', label: 'Wicket Keeper', icon: Hand, color: 'text-yellow-500' },
];

const PlayerInput = ({ teamName, players, setPlayers, colorClass, maxPlayers, side }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('batsman');

    const addPlayer = (e) => {
        e.preventDefault();
        if (name.trim()) {
            if (players.length >= maxPlayers) {
                toast.error(`Maximum ${maxPlayers} players allowed per team.`);
                return;
            }
            setPlayers([...players, { name: name.trim(), role }]);
            toast.success(`Added ${name.trim()}`);
            setName('');
            setRole('batsman');
        }
    };

    const removePlayer = (index) => {
        setPlayers(players.filter((_, i) => i !== index));
    };

    const SelectedRole = ROLES.find(r => r.id === role);

    const isAddDisabled = !name.trim() || players.length >= maxPlayers;

    return (
        <div className={`card h-full border-t-4 ${side === 'A' ? 'border-t-primary-500' : 'border-t-accent-orange'}`}>
            <div className="p-6 border-b border-border bg-gray-50/50">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-heading font-bold flex items-center gap-3 text-gray-800">
                        <div className={`p-2 rounded-lg ${side === 'A' ? 'bg-primary-50 text-primary-600' : 'bg-orange-50 text-orange-600'}`}>
                            <Users size={20} />
                        </div>
                        {teamName}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${players.length === maxPlayers
                        ? 'bg-success/10 text-success border-success/20'
                        : 'bg-white text-muted border-border'
                        }`}>
                        {players.length} / {maxPlayers}
                    </span>
                </div>

                <form onSubmit={addPlayer} className="relative z-10">
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            className="input bg-white shadow-sm focus:ring-2 focus:ring-primary-100 transition-all font-semibold text-gray-900 placeholder:text-gray-400"
                            placeholder="Type player name..."
                            value={name}
                            onChange={e => setName(e.target.value)}
                            disabled={players.length >= maxPlayers}
                        />

                        <div className="flex gap-2">
                            <div className="relative flex-1 group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none group-hover:text-primary-500 transition-colors">
                                    <SelectedRole.icon size={16} />
                                </div>
                                <select
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="input pl-10 cursor-pointer appearance-none bg-white shadow-sm hover:border-primary-300 transition-colors text-gray-800 font-medium"
                                    disabled={players.length >= maxPlayers}
                                >
                                    {ROLES.map(r => (
                                        <option key={r.id} value={r.id}>{r.label}</option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
                            </div>

                            <button
                                type="submit"
                                className={`btn p-0 w-12 h-11 flex items-center justify-center rounded-lg shadow-md transition-all active:scale-95 ${isAddDisabled
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                                    }`}
                                disabled={isAddDisabled}
                            >
                                <Plus size={24} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar max-h-[400px]">
                {players.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-muted border-2 border-dashed border-border rounded-xl bg-gray-50/50">
                        <UserPlus size={48} className="mb-4 opacity-20" />
                        <p className="font-medium text-gray-400">Add players to start</p>
                    </div>
                ) : (
                    players.map((p, i) => {
                        const PlayerRole = ROLES.find(r => r.id === p.role) || ROLES[0];
                        return (
                            <div key={i} className="group flex justify-between items-center p-3 rounded-lg bg-white border border-border hover:border-primary-200 hover:shadow-md transition-all animate-enter">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <span className="w-6 h-6 flex items-center justify-center text-xs font-bold text-muted bg-gray-100 rounded-md shrink-0">
                                        {i + 1}
                                    </span>
                                    <div className="min-w-0">
                                        <p className="font-bold text-gray-800 truncate">{p.name}</p>
                                        <div className={`text-xs flex items-center gap-1 ${PlayerRole.color}`}>
                                            <PlayerRole.icon size={12} />
                                            <span className="font-medium opacity-80">{PlayerRole.label}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removePlayer(i)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default function MatchSetup() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getMatch, updateMatchScore } = useMatch();
    const match = getMatch(id);

    const [tossDetails, setTossDetails] = useState({ winner: '', decision: '' });
    const [playersPerTeam, setPlayersPerTeam] = useState(11); // Default to 11

    // Initialize players 
    const [playersA, setPlayersA] = useState(() => {
        const existing = match?.teamA?.players || [];
        return existing.map(p => typeof p === 'string' ? { name: p, role: 'batsman' } : p);
    });
    const [playersB, setPlayersB] = useState(() => {
        const existing = match?.teamB?.players || [];
        return existing.map(p => typeof p === 'string' ? { name: p, role: 'batsman' } : p);
    });

    if (!match) return <div className="flex items-center justify-center min-h-screen text-muted animate-enter">Match not found</div>;

    const handlePlayerLimitChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setPlayersPerTeam(val);
    };

    const handleStartMatch = () => {
        if (playersPerTeam < 2 || playersPerTeam > 11) {
            toast.error("Team size must be between 2 and 11.");
            return;
        }
        if (playersA.length !== playersPerTeam || playersB.length !== playersPerTeam) {
            toast.error(`Both teams must have exactly ${playersPerTeam} players.`);
            return;
        }
        if (!tossDetails.winner || !tossDetails.decision) {
            toast.error("Please complete the toss decision.");
            return;
        }

        const initialStats = {};
        [...playersA, ...playersB].forEach(p => {
            initialStats[p.name] = { runs: 0, balls: 0, fours: 0, sixes: 0, overs: 0, maidens: 0, runsConceded: 0, wickets: 0 };
        });

        updateMatchScore(id, {
            toss: tossDetails,
            teamA: { ...match.teamA, players: playersA },
            teamB: { ...match.teamB, players: playersB },
            status: 'live',
            currentInning: 1,
            playerStats: initialStats,
            battingTeam: tossDetails.winner === match.teamA.name
                ? (tossDetails.decision === 'bat' ? 'teamA' : 'teamB')
                : (tossDetails.decision === 'bat' ? 'teamB' : 'teamA')
        });

        navigate(`/admin/live/${id}`);
    };

    return (
        <div className="container py-8 max-w-6xl animate-enter">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 transition-all text-muted hover:text-primary-600">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Match Setup</h1>
                        <p className="text-muted flex items-center gap-2 font-medium">
                            {match.name} <span className="w-1.5 h-1.5 rounded-full bg-gray-300" /> {match.overs} Overs
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-xl border border-border shadow-sm">
                    <div className="bg-primary-50 p-2 rounded-lg text-primary-600">
                        <Users size={20} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-muted uppercase tracking-wider">Squad Size</span>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min="2"
                                max="11"
                                value={playersPerTeam}
                                onChange={handlePlayerLimitChange}
                                className="w-12 font-bold text-lg text-main bg-transparent outline-none border-b-2 border-transparent focus:border-primary-500 transition-colors text-center"
                            />
                            <span className="text-sm font-medium text-gray-400">/ Team</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid md:lg:grid-cols-2 gap-8 mb-8">
                <PlayerInput
                    teamName={match.teamA.name}
                    players={playersA}
                    setPlayers={setPlayersA}
                    colorClass="text-primary-600"
                    maxPlayers={playersPerTeam}
                    side="A"
                />
                <PlayerInput
                    teamName={match.teamB.name}
                    players={playersB}
                    setPlayers={setPlayersB}
                    colorClass="text-accent-orange"
                    maxPlayers={playersPerTeam}
                    side="B"
                />
            </div>

            {/* Toss & Action Section */}
            <div className="card border-primary-100 shadow-xl overflow-hidden mb-12">
                <div className="bg-gradient-to-r from-gray-50 to-white border-b border-border p-6 text-center">
                    <h2 className="text-xl font-heading font-bold flex items-center justify-center gap-2 text-gray-800">
                        <Coins className="text-yellow-500" size={24} />
                        Match Toss Decision
                    </h2>
                </div>

                <div className="p-8 grid md:grid-cols-2 gap-12 relative">
                    {/* Vertical Divider for Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-border to-transparent" />

                    {/* Winner Selection */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-center text-muted uppercase tracking-widest">Toss Winner</label>
                        <div className="grid grid-cols-2 gap-4">
                            {[match.teamA.name, match.teamB.name].map(team => (
                                <button
                                    key={team}
                                    onClick={() => setTossDetails({ ...tossDetails, winner: team })}
                                    className={`py-4 px-2 rounded-xl border-2 font-bold transition-all duration-300 transform active:scale-95 ${tossDetails.winner === team
                                        ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md scale-105 ring-2 ring-primary-200 ring-offset-2'
                                        : 'border-border bg-white text-gray-500 hover:border-primary-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {team}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Decision Selection */}
                    <div className={`space-y-4 transition-all duration-500 ${tossDetails.winner ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4 pointer-events-none'}`}>
                        <label className="block text-sm font-bold text-center text-muted uppercase tracking-widest">Elected To</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setTossDetails({ ...tossDetails, decision: 'bat' })}
                                className={`py-4 px-2 rounded-xl border-2 font-bold transition-all duration-300 flex flex-col items-center gap-2 transform active:scale-95 ${tossDetails.decision === 'bat'
                                    ? 'border-accent-green bg-green-50 text-green-700 shadow-md scale-105 ring-2 ring-green-200 ring-offset-2'
                                    : 'border-border bg-white text-gray-500 hover:border-green-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Club size={24} />
                                Bat First
                            </button>
                            <button
                                onClick={() => setTossDetails({ ...tossDetails, decision: 'bowl' })}
                                className={`py-4 px-2 rounded-xl border-2 font-bold transition-all duration-300 flex flex-col items-center gap-2 transform active:scale-95 ${tossDetails.decision === 'bowl'
                                    ? 'border-accent-purple bg-purple-50 text-purple-700 shadow-md scale-105 ring-2 ring-purple-200 ring-offset-2'
                                    : 'border-border bg-white text-gray-500 hover:border-purple-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Disc size={24} />
                                Bowl First
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-border flex justify-center sticky bottom-0 z-20 backdrop-blur-md bg-white/80">
                    <button
                        onClick={handleStartMatch}
                        disabled={!tossDetails.winner || !tossDetails.decision || playersA.length !== playersPerTeam || playersB.length !== playersPerTeam}
                        className="btn btn-primary px-12 py-4 text-lg shadow-xl shadow-primary-500/30 hover:shadow-2xl hover:shadow-primary-500/40 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transform transition-all duration-300 hover:-translate-y-1 block w-full md:w-auto"
                    >
                        Start Official Match
                    </button>
                </div>
            </div>
        </div>
    );
}
