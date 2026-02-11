import { createContext, useContext, useState, useEffect } from 'react';

const MatchContext = createContext();

export const useMatch = () => useContext(MatchContext);

export const MatchProvider = ({ children }) => {
    const [matches, setMatches] = useState(() => {
        const saved = localStorage.getItem('cricket_matches');
        return saved ? JSON.parse(saved) : [];
    });

    const [currentMatchId, setCurrentMatchId] = useState(null);

    useEffect(() => {
        localStorage.setItem('cricket_matches', JSON.stringify(matches));
    }, [matches]);

    const createMatch = (matchData) => {
        const newMatch = {
            id: Date.now().toString(),
            status: 'scheduled',
            currentInning: 1,
            target: null,
            winner: null,
            ...matchData,
            createdAt: new Date().toISOString(),
            score: {
                teamA: { runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, wides: 0, noballs: 0, byes: 0, legbyes: 0, fow: [] },
                teamB: { runs: 0, wickets: 0, overs: 0, balls: 0, extras: 0, wides: 0, noballs: 0, byes: 0, legbyes: 0, fow: [] },
            },
            currentOver: [],
            history: [],
            battingTeam: matchData.battingTeam || 'teamA',
            striker: null,
            nonStriker: null,
            bowler: null,
            playerStats: {},
        };

        const allPlayers = [];
        if (matchData.teamA?.players) allPlayers.push(...matchData.teamA.players);
        if (matchData.teamB?.players) allPlayers.push(...matchData.teamB.players);

        allPlayers.forEach(p => {
            const name = typeof p === 'object' ? p.name : p;
            if (name) {
                newMatch.playerStats[name] = {
                    runs: 0, balls: 0, fours: 0, sixes: 0,
                    overs: 0, maidens: 0, runsConceded: 0, wickets: 0,
                    ...newMatch.playerStats[name] // Preserve if already set
                };
            }
        });

        // Ensure currentOver and history are initialized if not present
        if (!newMatch.currentOver) newMatch.currentOver = [];
        if (!newMatch.history) newMatch.history = [];

        setMatches(prev => [newMatch, ...prev]);
        return newMatch.id;
    };

    const getMatch = (id) => matches.find(m => m.id === id);

    const deleteMatch = (matchId) => {
        setMatches(prev => prev.filter(m => m.id !== matchId));
    };

    const updateMatchScore = (matchId, updates) => {
        setMatches(prevMatches => prevMatches.map(m => {
            if (m.id !== matchId) return m;

            // Handle Undo
            if (updates.undo) {
                if (!m.history || m.history.length === 0) return m;
                const previousState = m.history[m.history.length - 1];
                // Ensure we don't lose the history array when restoring state
                // But we must remove the last entry from it
                const newHistory = m.history.slice(0, -1);
                return { ...previousState, history: newHistory };
            }

            // Normal Update
            // Push CURRENT state to history before applying updates
            const currentHistory = m.history || [];
            const newHistory = [...currentHistory, { ...m }];
            // Optional: Limit history size
            if (newHistory.length > 50) newHistory.shift();

            return { ...m, ...updates, history: newHistory };
        }));
    };

    return (
        <MatchContext.Provider value={{ matches, createMatch, deleteMatch, getMatch, updateMatchScore, currentMatchId, setCurrentMatchId }}>
            {children}
        </MatchContext.Provider>
    );
};
