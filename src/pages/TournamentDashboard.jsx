import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTournament } from '../context/TournamentContext';
import { Trophy, Calendar, Users, ArrowRight, Medal, Clock } from 'lucide-react';

export default function TournamentDashboard() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getTournament } = useTournament();
    const tournament = getTournament(id);
    const [activeTab, setActiveTab] = useState('points');

    if (!tournament) return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center p-8 animate-enter">
            <Trophy className="w-16 h-16 text-muted mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-800">Tournament not found</h2>
            <button onClick={() => navigate('/')} className="mt-4 btn btn-secondary">Go Home</button>
        </div>
    );

    const { name, standings, fixtures } = tournament;

    return (
        <div className="container py-8 pb-24 animate-enter max-w-6xl">
            {/* Header / Hero */}
            <div className="relative rounded-2xl overflow-hidden bg-primary-900 text-white shadow-2xl mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 z-0" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0" />
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-primary-200 text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/10">
                            Tournament Series
                        </span>
                        <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-tr from-white to-primary-200">
                            {name}
                        </h1>
                        <p className="text-primary-200 text-lg flex items-center justify-center md:justify-start gap-2">
                            <Users size={18} /> {standings.length} Teams • <Calendar size={18} /> {fixtures.length} Matches
                        </p>
                    </div>
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-accent-yellow to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 animate-float">
                        <Trophy size={48} className="text-white drop-shadow-md" />
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 mb-8 sticky top-24 z-30 bg-white/80 backdrop-blur-md p-1.5 rounded-xl border border-border shadow-sm w-fit mx-auto md:mx-0">
                <button
                    onClick={() => setActiveTab('points')}
                    className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'points' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Points Table
                </button>
                <button
                    onClick={() => setActiveTab('fixtures')}
                    className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${activeTab === 'fixtures' ? 'bg-primary-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                    Matches & Results
                </button>
            </div>

            {/* Content Area */}
            <div className="animate-enter">
                {activeTab === 'points' && (
                    <div className="card border-0 shadow-xl overflow-hidden ring-1 ring-border">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-border text-xs uppercase tracking-wider text-muted font-bold">
                                        <th className="p-5 pl-8">Rank</th>
                                        <th className="p-5">Team</th>
                                        <th className="p-5 text-center">Played</th>
                                        <th className="p-5 text-center text-success">Won</th>
                                        <th className="p-5 text-center text-danger">Lost</th>
                                        <th className="p-5 text-center">NRR</th>
                                        <th className="p-5 pr-8 text-right font-black text-gray-800">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {standings.sort((a, b) => b.points - a.points).map((team, i) => (
                                        <tr key={i} className={`group hover:bg-gray-50 transition-colors ${i < 3 ? 'bg-primary-50/30' : ''}`}>
                                            <td className="p-5 pl-8 font-bold text-gray-400">
                                                {i === 0 && <Medal size={20} className="text-yellow-500 inline mr-2" />}
                                                {i === 1 && <Medal size={20} className="text-gray-400 inline mr-2" />}
                                                {i === 2 && <Medal size={20} className="text-orange-700 inline mr-2" />}
                                                {i > 2 && <span className="ml-7">#{i + 1}</span>}
                                            </td>
                                            <td className="p-5 font-bold text-gray-900 group-hover:text-primary-600 transition-colors text-lg">
                                                {team.name}
                                            </td>
                                            <td className="p-5 text-center font-medium text-gray-600">{team.played}</td>
                                            <td className="p-5 text-center font-bold text-green-600 bg-green-50/50 rounded-lg">{team.won}</td>
                                            <td className="p-5 text-center font-bold text-red-500 bg-red-50/50 rounded-lg">{team.lost}</td>
                                            <td className="p-5 text-center font-mono text-sm text-gray-500">+1.245</td>
                                            <td className="p-5 pr-8 text-right font-black text-2xl text-primary-700">{team.points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'fixtures' && (
                    <div className="space-y-8">
                        {/* Upcoming / Live Matches */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 border-l-4 border-primary-500 pl-3">
                                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                                Upcoming & Live Matches
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {fixtures.filter(f => f.status !== 'completed').length === 0 ? (
                                    <div className="col-span-2 p-12 text-center border-2 border-dashed border-border rounded-xl text-muted bg-gray-50">
                                        <Calendar size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-medium">No upcoming matches scheduled.</p>
                                    </div>
                                ) : (
                                    fixtures.filter(f => f.status !== 'completed').map((match, i) => (
                                        <div key={match.id} className="card p-0 border border-border hover:border-primary-300 transition-all hover:shadow-lg group overflow-hidden">
                                            <div className="p-4 bg-gray-50 border-b border-border flex justify-between items-center">
                                                <span className="text-xs font-bold text-muted uppercase tracking-wider">Match {i + 1}</span>
                                                {match.status === 'live' ? (
                                                    <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded animate-pulse flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-red-600 rounded-full" /> LIVE
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded flex items-center gap-1">
                                                        <Clock size={12} /> UPCOMING
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-6 text-center">
                                                <div className="flex justify-between items-center mb-6">
                                                    <div className="w-1/3">
                                                        <div className="font-bold text-xl text-gray-900 mb-1">{match.teamA}</div>
                                                    </div>
                                                    <div className="w-1/3 flex justify-center">
                                                        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full border border-gray-200">
                                                            VS
                                                        </span>
                                                    </div>
                                                    <div className="w-1/3">
                                                        <div className="font-bold text-xl text-gray-900 mb-1">{match.teamB}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => navigate('/admin', { state: { tournamentId: id, fixtureId: match.id, teamA: match.teamA, teamB: match.teamB } })}
                                                    className="w-full btn btn-primary py-3 group-hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
                                                >
                                                    {match.status === 'live' ? 'Resume Scoring' : 'Start Match'} <ArrowRight size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Completed Matches */}
                        {fixtures.filter(f => f.status === 'completed').length > 0 && (
                            <div className="space-y-4 pt-8 border-t border-border">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-gray-500 pl-3">
                                    <Clock size={18} /> Previous Results
                                </h3>
                                <div className="grid gap-4">
                                    {fixtures.filter(f => f.status === 'completed').map((match, i) => (
                                        <div key={match.id} className="card flex flex-col md:flex-row items-center p-4 gap-6 bg-white border border-border hover:bg-gray-50 transition-colors">
                                            <div className="flex-1 w-full flex items-center justify-between md:justify-start md:gap-12 pl-4">
                                                <div className={`font-bold text-lg flex items-center gap-2 ${match.winner === match.teamA ? 'text-green-600' : 'text-gray-400 opacity-60'}`}>
                                                    {match.teamA} {match.winner === match.teamA && <Medal size={16} className="text-yellow-500" />}
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded border border-gray-200">RESULT</span>
                                                <div className={`font-bold text-lg flex items-center gap-2 ${match.winner === match.teamB ? 'text-green-600' : 'text-gray-400 opacity-60'}`}>
                                                    {match.teamB} {match.winner === match.teamB && <Medal size={16} className="text-yellow-500" />}
                                                </div>
                                            </div>
                                            <div className="w-full md:w-auto text-center md:text-right pr-4">
                                                <span className="block text-xs font-bold text-gray-400 uppercase mb-1">Winner</span>
                                                <span className="inline-block font-bold text-green-700 bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                                                    {match.winner}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
