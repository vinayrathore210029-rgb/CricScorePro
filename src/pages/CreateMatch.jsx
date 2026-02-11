import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import { ArrowRight, Lock, PlayCircle, Clock, ArrowLeft, Trash2, Trophy, Settings, Activity, KeyRound, X } from 'lucide-react';
import { toast } from 'sonner';

export default function CreateMatch() {
    const navigate = useNavigate();
    const location = useLocation();
    const { createMatch, matches, getMatch, deleteMatch } = useMatch();

    const tournamentData = location.state || {};

    const [formData, setFormData] = useState({
        matchName: tournamentData.teamA ? `${tournamentData.teamA} vs ${tournamentData.teamB}` : '',
        matchType: 'T20',
        overs: 20,
        password: '',
        teamA: tournamentData.teamA || '',
        teamB: tournamentData.teamB || ''
    });

    // State for inline password entry
    const [resumeMatchId, setResumeMatchId] = useState(null);
    const [passwordInput, setPasswordInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.matchName || !formData.teamA || !formData.teamB) return;

        const matchId = createMatch({
            name: formData.matchName,
            type: formData.matchType,
            totalOvers: parseInt(formData.overs),
            password: formData.password,
            teamA: { name: formData.teamA, players: [] },
            teamB: { name: formData.teamB, players: [] },
            tournamentId: tournamentData.tournamentId || null,
            fixtureId: tournamentData.fixtureId || null
        });

        navigate(`/admin/setup/${matchId}`);
    };

    const initiateResume = (matchId) => {
        const match = getMatch(matchId);
        if (!match) return;

        if (match.password) {
            setResumeMatchId(matchId);
            setPasswordInput('');
        } else {
            navigateToMatch(match);
        }
    };

    const handlePasswordSubmit = (e, matchId) => {
        e.preventDefault();
        const match = getMatch(matchId);
        if (passwordInput === match.password) {
            navigateToMatch(match);
        } else {
            toast.error("Incorrect Password!");
        }
    };

    const navigateToMatch = (match) => {
        if (match.status === 'scheduled') navigate(`/admin/setup/${match.id}`);
        else if (match.status === 'live') navigate(`/admin/live/${match.id}`);
        else navigate(`/result/${match.id}`);
    };

    const recentMatches = matches
        .filter(m => m.status !== 'completed')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    return (
        <div className="container py-8 max-w-6xl animate-enter pb-24">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="p-3 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm group"
                >
                    <ArrowLeft size={20} className="text-gray-500 group-hover:text-gray-800" />
                </button>
                <div>
                    <h1 className="text-3xl font-heading font-black text-gray-900 tracking-tight">Create & Manage</h1>
                    <p className="text-muted font-medium">Start a new game or resume scoring</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Left: Create New Match Form */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="card shadow-xl shadow-primary-900/5 border-primary-100 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary-500 to-primary-700" />
                        <div className="p-8">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-800">
                                <span className="p-2 bg-primary-50 text-primary-600 rounded-lg"><Trophy size={20} /></span>
                                New Match Setup
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Match Title</label>
                                    <input
                                        type="text"
                                        className="input font-semibold text-lg hover:border-primary-300 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 transition-all bg-gray-50 focus:bg-white"
                                        placeholder="e.g. Sunday League Final"
                                        value={formData.matchName}
                                        onChange={e => setFormData({ ...formData, matchName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Format</label>
                                        <div className="relative">
                                            <select
                                                className="input font-medium appearance-none bg-white hover:border-primary-300 transition-colors cursor-pointer"
                                                value={formData.matchType}
                                                onChange={e => {
                                                    const type = e.target.value;
                                                    let defaultOvers = formData.overs;
                                                    if (type === 'T20') defaultOvers = 20;
                                                    if (type === 'ODI') defaultOvers = 50;
                                                    setFormData({ ...formData, matchType: type, overs: defaultOvers });
                                                }}
                                            >
                                                <option value="T20">T20 (20 Overs)</option>
                                                <option value="ODI">ODI (50 Overs)</option>
                                                <option value="Test">Test Match</option>
                                                <option value="Custom">Custom</option>
                                            </select>
                                            <Settings size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Overs</label>
                                        <input
                                            type="number"
                                            className="input font-medium hover:border-primary-300 focus:border-primary-500 transition-colors"
                                            value={formData.overs}
                                            onChange={e => setFormData({ ...formData, overs: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary-600 uppercase tracking-wider">Home Team</label>
                                        <input
                                            type="text"
                                            className="input border-primary-200 focus:border-primary-500 focus:ring-primary-100 font-bold text-gray-800"
                                            placeholder="Team A"
                                            value={formData.teamA}
                                            onChange={e => setFormData({ ...formData, teamA: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 text-right">
                                        <label className="text-sm font-bold text-accent-orange uppercase tracking-wider">Away Team</label>
                                        <input
                                            type="text"
                                            className="input border-orange-200 focus:border-orange-500 focus:ring-orange-100 font-bold text-gray-800 text-right"
                                            placeholder="Team B"
                                            value={formData.teamB}
                                            onChange={e => setFormData({ ...formData, teamB: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Lock size={14} /> Admin Password (Optional)
                                    </label>
                                    <input
                                        type="password"
                                        className="input hover:border-primary-300 focus:border-primary-500 transition-colors"
                                        placeholder="Secure creation (optional)"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button type="submit" className="btn btn-primary w-full py-4 text-lg justify-center shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all group relative overflow-hidden">
                                        <span className="relative z-10 flex items-center gap-2 font-bold">Start Match Setup <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right: Resume Matches */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-gray-900 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black opacity-90" />
                        <div className="relative z-10 flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Activity className="text-green-400" /> Recent Activity
                            </h2>
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-gray-300 uppercase tracking-wider">
                                {recentMatches.length} Matches
                            </span>
                        </div>

                        {recentMatches.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl relative z-10">
                                <Clock size={32} className="mx-auto mb-3 text-gray-600" />
                                <p className="text-gray-400 font-medium">No active matches found.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 relative z-10 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
                                {recentMatches.map(match => (
                                    <div
                                        key={match.id}
                                        className={`group rounded-xl transition-all backdrop-blur-sm border ${resumeMatchId === match.id
                                                ? 'bg-white/10 border-primary-500 shadow-lg shadow-primary-500/10'
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                    >
                                        <div className="p-4 flex items-center justify-between">
                                            <div>
                                                <h3 className="font-bold text-white text-base mb-1 group-hover:text-primary-300 transition-colors">{match.name}</h3>
                                                <div className="flex items-center gap-2 text-xs text-gray-400 font-medium font-mono">
                                                    <span className={`w-2 h-2 rounded-full ${match.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`} />
                                                    {match.teamA.name} vs {match.teamB.name}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {resumeMatchId !== match.id && (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm('Delete match?')) {
                                                                deleteMatch(match.id);
                                                                toast.success('Deleted');
                                                            }
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}

                                                {resumeMatchId === match.id ? (
                                                    <button
                                                        onClick={() => setResumeMatchId(null)}
                                                        className="p-2 text-gray-400 hover:text-white transition-colors"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => initiateResume(match.id)}
                                                        className="p-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg shadow-lg shadow-primary-900/50 transition-all hover:scale-105"
                                                    >
                                                        {match.password ? <Lock size={16} /> : <PlayCircle size={18} />}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Inline Password Form */}
                                        {resumeMatchId === match.id && (
                                            <div className="px-4 pb-4 animate-enter">
                                                <form onSubmit={(e) => handlePasswordSubmit(e, match.id)} className="flex gap-2">
                                                    <div className="relative flex-1">
                                                        <KeyRound size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                                        <input
                                                            type="password"
                                                            autoFocus
                                                            placeholder="Enter Password..."
                                                            className="w-full bg-black/30 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder:text-gray-600"
                                                            value={passwordInput}
                                                            onChange={(e) => setPasswordInput(e.target.value)}
                                                        />
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-lg shadow-lg transition-colors"
                                                    >
                                                        Resume
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
