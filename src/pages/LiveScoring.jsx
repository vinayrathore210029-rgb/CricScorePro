import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import { useTournament } from '../context/TournamentContext';
import { Undo2, Maximize2, X, Edit3 } from 'lucide-react';
import { toast } from 'sonner';

export default function LiveScoring({ viewOnly }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getMatch, updateMatchScore } = useMatch();
    const { updateTournamentStandings } = useTournament();
    const match = getMatch(id);

    // Local UI State
    const [promptData, setPromptData] = useState(null); // { type: 'initialSelection' | 'selectBatsman' | 'selectBowler' | 'selectWicketType', ... }
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [wicketDetails, setWicketDetails] = useState({ type: 'bowled', fielder: '' });

    // Temp state for initial selection modal
    const [initialSelection, setInitialSelection] = useState({ striker: '', nonStriker: '', bowler: '' });

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    // Check for mandatory initial selection
    useEffect(() => {
        if (match && !viewOnly && (!match.striker || !match.nonStriker || !match.bowler)) {
            // Only set if not already set (to avoid loop or override if user cancels/closes manually)
            // Actually, we want to force it.
            if (!promptData || promptData.type !== 'initialSelection') {
                setPromptData({ type: 'initialSelection' });
            }
        }
    }, [match?.id, viewOnly]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (match && match.status === 'completed') {
            if (match.tournamentId) {
                updateTournamentStandings(match.tournamentId, {
                    matchId: id,
                    fixtureId: match.fixtureId,
                    winner: match.winner,
                    teams: [match.teamA.name, match.teamB.name]
                });
            }
            navigate(`/result/${id}`);
        }
    }, [match?.status, id, navigate, updateTournamentStandings]);

    if (!match) return <div className="text-center mt-10">Loading Match...</div>;

    // --- Derived State ---
    const battingTeamKey = match.battingTeam;
    const bowlingTeamKey = match.battingTeam === 'teamA' ? 'teamB' : 'teamA';
    const battingTeam = match[battingTeamKey];
    const bowlingTeam = match[bowlingTeamKey];
    const score = match[battingTeamKey] ? match.score[battingTeamKey] : match.score.teamA; // Fallback

    // Stats
    const striker = match.playerStats[match.striker] ? { name: match.striker, ...match.playerStats[match.striker] } : null;
    const nonStriker = match.playerStats[match.nonStriker] ? { name: match.nonStriker, ...match.playerStats[match.nonStriker] } : null;
    const currentBowler = match.playerStats[match.bowler] ? { name: match.bowler, ...match.playerStats[match.bowler] } : null;

    // RRR Calculation
    const target = match.target;
    let requiredRunRate = null;
    if (match.currentInning === 2 && target) {
        const runsNeeded = target - score.runs;
        const ballsRemaining = (match.totalOvers * 6) - (score.overs * 6 + score.balls);
        if (ballsRemaining > 0) {
            requiredRunRate = ((runsNeeded / ballsRemaining) * 6).toFixed(2);
        }
    }

    // --- Action Handlers ---

    const handleInitialSubmit = () => {
        if (!initialSelection.striker || !initialSelection.nonStriker || !initialSelection.bowler) {
            toast.error('Please select all players to start.');
            return;
        }
        if (initialSelection.striker === initialSelection.nonStriker) {
            toast.error('Striker and Non-Striker cannot be the same!');
            return;
        }
        updateMatchScore(id, {
            striker: initialSelection.striker,
            nonStriker: initialSelection.nonStriker,
            bowler: initialSelection.bowler
        });
        setPromptData(null);
    };

    const checkMatchStatus = (currentScore, currentWickets, currentOvers) => {
        if (match.currentInning === 2 && match.target) {
            if (currentScore >= match.target) {
                return { status: 'completed', winner: battingTeam.name };
            }
        }
        if (currentWickets >= 10 || currentWickets >= battingTeam.players.length - 1) {
            return { innEnd: true, reason: 'All Out' };
        }
        if (currentOvers >= match.totalOvers) {
            return { innEnd: true, reason: 'Overs Completed' };
        }
        return null;
    };

    const handleRun = (runs) => {
        if (!match.striker || !match.nonStriker || !match.bowler) {
            setPromptData({ type: 'initialSelection' });
            return;
        }

        const newBalls = score.balls + 1;
        let newOvers = score.overs;
        let overCompleted = false;

        // Auto-initialize player stats if missing to prevent crashes
        const ensureStats = (name) => {
            if (!match.playerStats[name]) {
                return { runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0, runsConceded: 0, overs: 0 };
            }
            return match.playerStats[name];
        };

        const strikerStats = ensureStats(match.striker);
        const bowlerStats = ensureStats(match.bowler);

        const updatedStriker = {
            ...strikerStats,
            runs: (strikerStats.runs || 0) + runs,
            balls: (strikerStats.balls || 0) + 1,
            fours: runs === 4 ? (strikerStats.fours || 0) + 1 : (strikerStats.fours || 0),
            sixes: runs === 6 ? (strikerStats.sixes || 0) + 1 : (strikerStats.sixes || 0)
        };

        const updatedBowler = {
            ...bowlerStats,
            runsConceded: (bowlerStats.runsConceded || 0) + runs,
            balls: (bowlerStats.balls || 0) + 1
        };

        if (newBalls === 6) {
            newOvers += 1;
            overCompleted = true;
        }

        let updates = {
            score: {
                ...(match.score || {}),
                [battingTeamKey]: {
                    ...score,
                    runs: score.runs + runs,
                    overs: newOvers,
                    balls: overCompleted ? 0 : newBalls
                }
            },
            currentOver: [...(match.currentOver || []), { runs, type: 'run', player: match.striker }],
            playerStats: {
                ...(match.playerStats || {}),
                [match.striker]: updatedStriker,
                [match.bowler]: updatedBowler
            }
        };

        let nextStriker = match.striker;
        let nextNonStriker = match.nonStriker;

        if (runs % 2 !== 0) {
            [nextStriker, nextNonStriker] = [nextNonStriker, nextStriker];
        }

        if (overCompleted) {
            [nextStriker, nextNonStriker] = [nextNonStriker, nextStriker];
            setPromptData({ type: 'selectBowler', previousBowler: match.bowler });
        }

        updates.striker = nextStriker;
        updates.nonStriker = nextNonStriker;

        // Ensure battingTeam exists in score before checking
        const currentRuns = updates.score[battingTeamKey]?.runs || 0;
        const currentWickets = updates.score[battingTeamKey]?.wickets || 0;

        const status = checkMatchStatus(currentRuns, currentWickets, newOvers);
        if (status?.status === 'completed') {
            updates.status = 'completed';
            updates.winner = status.winner;
        } else if (status?.innEnd) {
            handleInningsEnd(updates);
            return;
        }

        if (runs === 4) toast.success('FOUR!');
        if (runs === 6) toast.success('SIX!');

        updateMatchScore(id, updates);
    };

    const handleWicketClick = () => {
        if (!match.striker || !match.nonStriker || !match.bowler) {
            setPromptData({ type: 'initialSelection' });
            return;
        }
        setPromptData({ type: 'selectWicketType' });
    };

    const confirmWicket = () => {
        if (!match.striker || !match.bowler) return;

        const type = wicketDetails.type;
        const newWickets = score.wickets + 1;
        const newBalls = score.balls + 1;
        let newOvers = score.overs;
        let overCompleted = false;

        if (newBalls === 6) {
            newOvers += 1;
            overCompleted = true;
        }

        // Auto-initialize player stats if missing to prevent crashes
        const ensureStats = (name) => {
            if (!match.playerStats?.[name]) {
                return { runs: 0, balls: 0, fours: 0, sixes: 0, wickets: 0, runsConceded: 0, overs: 0 };
            }
            return match.playerStats[name];
        };

        const strikerStats = ensureStats(match.striker);
        const bowlerStats = ensureStats(match.bowler);

        const updatedStriker = { ...strikerStats, balls: (strikerStats.balls || 0) + 1, outBy: type };
        const updatedBowler = {
            ...bowlerStats,
            wickets: type === 'runout' ? (bowlerStats.wickets || 0) : (bowlerStats.wickets || 0) + 1,
            balls: (bowlerStats.balls || 0) + 1
        };

        const fowRecord = {
            score: score.runs,
            wicket: newWickets,
            batsman: match.striker,
            over: `${score.overs}.${score.balls}`,
            type: type
        };

        let updates = {
            score: {
                ...(match.score || {}),
                [battingTeamKey]: {
                    ...score,
                    wickets: newWickets,
                    overs: newOvers,
                    balls: overCompleted ? 0 : newBalls,
                    fow: [...(score.fow || []), fowRecord]
                }
            },
            playerStats: {
                ...(match.playerStats || {}),
                [match.striker]: updatedStriker,
                [match.bowler]: updatedBowler
            },
            currentOver: [...(match.currentOver || []), { runs: 'W', type: 'wicket', wicketType: type }],
            striker: null
        };

        const status = checkMatchStatus(score.runs, newWickets, newOvers);

        if (status?.innEnd || status?.status === 'completed') {
            if (status.status === 'completed') {
                updates.status = 'completed';
                updates.winner = status.winner;
                updateMatchScore(id, updates);
            } else {
                handleInningsEnd(updates);
            }
        } else {
            if (overCompleted) {
                [updates.striker, updates.nonStriker] = [match.nonStriker, null];
                setPromptData({ type: 'selectBatsmanAndBowler', overDone: true }); // This will be handled by the new modal logic
            } else {
                setPromptData({ type: 'selectBatsman' });
            }
            toast.error(`WICKET! (${type})`);
            updateMatchScore(id, updates);
        }
        setWicketDetails({ type: 'bowled', fielder: '' });
    };

    const handleExtra = (type) => {
        if (!match.striker || !match.nonStriker || !match.bowler) {
            setPromptData({ type: 'initialSelection' });
            return;
        }

        const isWideOrNoBall = type === 'wide' || type === 'noball';
        const runs = 1;

        const newBalls = score.balls + (isWideOrNoBall ? 0 : 1);
        let newOvers = score.overs;
        let overCompleted = false;

        if (newBalls === 6) {
            newOvers += 1;
            overCompleted = true;
        }

        const bowlerStats = match.playerStats[match.bowler];
        const updatedBowler = {
            ...bowlerStats,
            runsConceded: bowlerStats.runsConceded + runs,
            balls: (bowlerStats.balls || 0) + (isWideOrNoBall ? 0 : 1),
        };

        let extraKey = '';
        if (type === 'wide') extraKey = 'wides';
        if (type === 'noball') extraKey = 'noballs';
        if (type === 'bye') extraKey = 'byes';
        if (type === 'legbye') extraKey = 'legbyes';

        const currentExtras = score.extras || 0;
        const currentSpecific = score[extraKey] || 0;

        const updates = {
            score: {
                ...match.score,
                [battingTeamKey]: {
                    ...score,
                    runs: score.runs + runs,
                    extras: currentExtras + runs,
                    [extraKey]: currentSpecific + runs,
                    overs: newOvers,
                    balls: overCompleted ? 0 : newBalls
                }
            },
            currentOver: [...match.currentOver, { runs: isWideOrNoBall ? '1wd/nb' : '1b/lb', type }],
            playerStats: {
                ...match.playerStats,
                [match.bowler]: updatedBowler
            }
        };

        const status = checkMatchStatus(updates.score[battingTeamKey].runs, updates.score[battingTeamKey].wickets, newOvers);
        if (status?.status === 'completed') {
            updates.status = 'completed';
            updates.winner = status.winner;
        } else if (status?.innEnd) {
            handleInningsEnd(updates);
            return;
        }

        updateMatchScore(id, updates);
    };

    const handleInningsEnd = (currentUpdates) => {
        if (match.currentInning === 1) {
            const target = currentUpdates.score[battingTeamKey].runs + 1;
            const nextUpdates = {
                ...currentUpdates,
                currentInning: 2,
                battingTeam: bowlingTeamKey,
                target: target,
                striker: null,
                nonStriker: null,
                bowler: null,
                currentOver: [],
                history: []
            };
            updateMatchScore(id, nextUpdates);
            alert(`Innings Break! target is ${target}`);
        } else {
            let scoreA = match.score.teamA.runs;
            let scoreB = match.score.teamB.runs;
            if (battingTeamKey === 'teamA') scoreA = currentUpdates.score.teamA.runs;
            else scoreB = currentUpdates.score.teamB.runs;

            let winner = 'draw';
            if (scoreA > scoreB) winner = match.teamA.name;
            else if (scoreB > scoreA) winner = match.teamB.name;

            updateMatchScore(id, { ...currentUpdates, status: 'completed', winner });
        }
    };

    const handleUndo = () => updateMatchScore(id, { undo: true });

    const selectPlayer = (role, playerName) => {
        updateMatchScore(id, { [role]: playerName });
        if (promptData && promptData.type !== 'initialSelection') setPromptData(null);
    };

    const handleRetire = (role) => {
        if (window.confirm('Change this player?')) {
            updateMatchScore(id, { [role]: null });
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-4 pb-24 font-body">
            {/* --- PRO DASHBOARD --- */}
            <div className="card bg-gradient-to-br from-primary-900 to-primary-800 border border-gray-700 shadow-2xl relative overflow-hidden rounded-xl">

                {/* Header: Controls & Match Info */}
                <div className="flex justify-between items-center p-4 border-b border-gray-700 bg-black-20">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {match.name} • {match.currentInning === 1 ? '1st Inn' : '2nd Inn'}
                    </div>
                    {!viewOnly && (
                        <div className="flex gap-2">
                            <button onClick={handleUndo} className="p-2 bg-white-5 hover:bg-white-10 rounded-full text-accent transition-colors"><Undo2 size={16} /></button>
                            <button onClick={toggleFullscreen} className="p-2 bg-white-5 hover:bg-white-10 rounded-full text-white transition-colors"><Maximize2 size={16} /></button>
                        </div>
                    )}
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-700">

                    {/* LEFT: Score & Overs (4 cols) */}
                    <div className="lg:col-span-4 p-6 flex flex-col justify-center items-center text-center bg-black-20">
                        <h2 className="text-xl font-bold text-white mb-1">{battingTeam.name}</h2>
                        <div className="text-6xl font-black gradient-text-primary leading-none mb-2">
                            {score.runs}/{score.wickets}
                        </div>
                        <div className="text-lg text-gray-400 font-mono">
                            <span className="text-white font-bold">{score.overs}.{score.balls}</span> Overs
                        </div>
                        <div className="mt-4 flex gap-4 text-xs font-mono text-muted">
                            <div className="bg-white-5 px-3 py-1 rounded">CRR: {((score.runs / (score.overs * 6 + score.balls || 1)) * 6).toFixed(2)}</div>
                            {requiredRunRate && <div className="bg-accent-soft text-accent px-3 py-1 rounded border border-gray-700">RRR: {requiredRunRate}</div>}
                        </div>
                        {target && <div className="mt-2 text-xs text-blue-400">Target: {target} | Need: {target - score.runs}</div>}
                    </div>

                    {/* CENTER: Batting Table (5 cols) */}
                    <div className="lg:col-span-5 p-0 bg-white-5">
                        <div className="flex justify-between items-center bg-black-20 p-2 px-4 border-b border-gray-700">
                            <span className="text-xs font-bold uppercase text-gray-400">Batting</span>
                            {!viewOnly && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleRetire('striker')} className="p-1 hover:bg-white-10 rounded text-blue-400" title="Change Striker"><Edit3 size={12} /></button>
                                    <button onClick={() => handleRetire('nonStriker')} className="p-1 hover:bg-white-10 rounded text-gray-400" title="Change Non-Striker"><Edit3 size={12} /></button>
                                </div>
                            )}
                        </div>
                        <div className="p-4 space-y-3">
                            {[striker, nonStriker].map((bat, i) => (
                                <div key={i} className={`flex justify-between items-center p-2 rounded ${i === 0 ? 'bg-primary-soft border border-primary-800' : 'bg-transparent'}`}>
                                    <div className="flex items-center gap-3">
                                        {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-accent-orange shadow-[0_0_8px_var(--accent-orange)]"></div>}
                                        <div>
                                            <div className={`font-bold text-sm ${i === 0 ? 'text-white' : 'text-gray-400'}`}>
                                                {bat ? bat.name : <span className="text-red-400 italic">Select Player</span>}
                                            </div>
                                        </div>
                                    </div>
                                    {bat && (
                                        <div className="text-right font-mono leading-none">
                                            <div className="text-lg font-bold text-white">{bat.runs}<span className="text-[10px] text-gray-500 font-sans ml-1">({bat.balls})</span></div>
                                            <div className="text-[10px] text-gray-500">SR: {bat.balls ? ((bat.runs / bat.balls) * 100).toFixed(0) : 0}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Bowling Stats (3 cols) */}
                    <div className="lg:col-span-3 p-0 bg-white-5">
                        <div className="flex justify-between items-center bg-black-20 p-2 px-4 border-b border-gray-700">
                            <span className="text-xs font-bold uppercase text-gray-400">Bowling</span>
                            {!viewOnly && <button onClick={() => handleRetire('bowler')} className="p-1 hover:bg-white-10 rounded text-purple-400" title="Change Bowler"><Edit3 size={12} /></button>}
                        </div>
                        <div className="p-6 text-center">
                            {currentBowler ? (
                                <>
                                    <div className="text-lg font-bold text-white mb-2">{currentBowler.name}</div>
                                    <div className="grid grid-cols-3 gap-2 text-center mb-2">
                                        <div className="bg-black-20 p-1 rounded"><div className="text-xs text-gray-500">O</div><div className="font-mono font-bold">{Math.floor((currentBowler.balls || 0) / 6)}.{(currentBowler.balls || 0) % 6}</div></div>
                                        <div className="bg-black-20 p-1 rounded"><div className="text-xs text-gray-500">R</div><div className="font-mono font-bold">{currentBowler.runsConceded}</div></div>
                                        <div className="bg-black-20 p-1 rounded"><div className="text-xs text-gray-500">W</div><div className="font-mono font-bold text-danger">{currentBowler.wickets}</div></div>
                                    </div>
                                    <div className="text-xs text-gray-500">Eco: {((currentBowler.runsConceded / ((currentBowler.balls || 1) / 6))).toFixed(1)}</div>
                                </>
                            ) : (
                                <div className="text-sm text-red-400 italic py-4">Select Bowler</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer: Extras Breakdown */}
                <div className="bg-black-90 p-2 flex justify-center gap-4 text-[10px] font-bold uppercase text-gray-400 border-t border-gray-700">
                    <span className="text-yellow-500">Extras: {score.extras || 0}</span>
                    <span>WD: {score.wides || 0}</span>
                    <span>NB: {score.noballs || 0}</span>
                    <span>B: {score.byes || 0}</span>
                    <span>LB: {score.legbyes || 0}</span>
                </div>
            </div>

            {/* Fall of Wickets */}
            {(score.fow && score.fow.length > 0) && (
                <div className="card p-4 bg-primary-800">
                    <h3 className="text-xs font-bold uppercase text-muted mb-2">Fall of Wickets</h3>
                    <div className="flex flex-wrap gap-2">
                        {score.fow.map((f, i) => (
                            <div key={i} className="px-2 py-1 bg-primary-950 border border-gray-700 rounded text-xs text-gray-300">
                                <span className="font-bold text-white">{f.score}-{f.wicket}</span> <span className="text-muted">({f.batsman}, {f.over} ov)</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* --- MODALS --- */}
            {!viewOnly && promptData && (
                <div className="fixed inset-0 bg-black-90 backdrop-blur-md z-100 flex items-center justify-center p-4">
                    <div className="card w-full max-w-md bg-primary-800 border border-gray-700 animate-enter shadow-2xl">

                        {/* Initial Selection Modal */}
                        {promptData.type === 'initialSelection' && (
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-white text-center border-b border-gray-700 pb-2">Start Match / Resume</h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-bold text-blue-400 uppercase">Striker</label>
                                        <select className="input w-full mt-1" value={initialSelection.striker} onChange={e => setInitialSelection({ ...initialSelection, striker: e.target.value })}>
                                            <option value="">Select Player</option>
                                            {battingTeam.players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase">Non-Striker</label>
                                        <select className="input w-full mt-1" value={initialSelection.nonStriker} onChange={e => setInitialSelection({ ...initialSelection, nonStriker: e.target.value })}>
                                            <option value="">Select Player</option>
                                            {battingTeam.players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-purple-400 uppercase">Bowler</label>
                                        <select className="input w-full mt-1" value={initialSelection.bowler} onChange={e => setInitialSelection({ ...initialSelection, bowler: e.target.value })}>
                                            <option value="">Select Bowler</option>
                                            {bowlingTeam.players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <button onClick={handleInitialSubmit} className="btn btn-primary w-full py-3 mt-4 font-bold text-lg">Start Scoring</button>
                            </div>
                        )}

                        {/* Standard Player Selector (Single) */}
                        {promptData.type === 'selectBatsman' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">New Batsman</h3>
                                <select className="input w-full" onChange={(e) => selectPlayer('striker', e.target.value)}>
                                    <option value="">Select New Striker</option>
                                    {battingTeam.players.filter(p => p.name !== nonStriker?.name).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                </select>
                            </div>
                        )}
                        {promptData.type === 'selectBowler' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">New Bowler</h3>
                                <select className="input w-full" onChange={(e) => selectPlayer('bowler', e.target.value)}>
                                    <option value="">Select Next Bowler</option>
                                    {bowlingTeam.players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                </select>
                            </div>
                        )}

                        {/* Combined Batsman/Bowler Selection (End of Over + Wicket) */}
                        {promptData.type === 'selectBatsmanAndBowler' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold">End of Over: Updates</h3>
                                <div>
                                    <label className="text-xs font-bold text-blue-400 uppercase">New Striker</label>
                                    <select className="input w-full mt-1" onChange={(e) => selectPlayer('striker', e.target.value)}>
                                        <option value="">Select Batsman</option>
                                        {battingTeam.players.filter(p => p.name !== nonStriker?.name).map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-purple-400 uppercase">New Bowler</label>
                                    <select className="input w-full mt-1" onChange={(e) => selectPlayer('bowler', e.target.value)}>
                                        <option value="">Select Bowler</option>
                                        {bowlingTeam.players.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Wicket Type */}
                        {promptData.type === 'selectWicketType' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold flex justify-between">Wicket Type <button onClick={() => setPromptData(null)}><X size={18} /></button></h3>
                                <div className="grid grid-cols-3 gap-2">
                                    {['bowled', 'caught', 'runout', 'lbw', 'stumped', 'hitwicket'].map(t => (
                                        <button key={t} onClick={() => setWicketDetails({ ...wicketDetails, type: t })} className={`px-2 py-3 rounded font-bold uppercase text-xs ${wicketDetails.type === t ? 'bg-danger text-white' : 'bg-black-40 hover:bg-black-90'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={confirmWicket} className="btn bg-danger text-white w-full py-3 font-bold">Confirm Wicket</button>
                            </div>
                        )}

                    </div>
                </div>
            )}

            {/* --- CONTROL PAD --- */}
            {!viewOnly && (
                <div className="fixed bottom-0 left-0 right-0 bg-primary-950 border-t border-gray-800 p-2 z-40 pb-6 safe-pb">
                    <div className="max-w-3xl mx-auto flex flex-col gap-2">
                        {/* Row 1: Main Runs */}
                        <div className="grid grid-cols-6 gap-2">
                            {[0, 1, 2, 3].map(r => (
                                <button key={r} onClick={() => handleRun(r)} className="btn-control btn-run">{r}</button>
                            ))}
                            <button onClick={() => handleRun(4)} className="btn-control btn-four">4</button>
                            <button onClick={() => handleRun(6)} className="btn-control btn-six">6</button>
                        </div>

                        {/* Row 2: Secondary & Extras */}
                        <div className="grid grid-cols-6 gap-2">
                            <button onClick={() => handleRun(5)} className="btn-control btn-run" style={{ fontSize: '1.2rem', color: '#94a3b8' }}>5</button>
                            <button onClick={handleWicketClick} className="btn-control btn-out">OUT</button>
                            <button onClick={() => handleExtra('wide')} className="btn-control btn-extra">WD</button>
                            <button onClick={() => handleExtra('noball')} className="btn-control btn-extra">NB</button>
                            <button onClick={() => handleExtra('bye')} className="btn-control btn-extra">B</button>
                            <button onClick={() => handleExtra('legbye')} className="btn-control btn-extra">LB</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="h-32"></div>
        </div>
    );
}
