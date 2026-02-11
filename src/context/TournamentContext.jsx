import { createContext, useContext, useState, useEffect } from 'react';

const TournamentContext = createContext();

export const useTournament = () => useContext(TournamentContext);

export const TournamentProvider = ({ children }) => {
    const [tournaments, setTournaments] = useState(() => {
        const saved = localStorage.getItem('cricket_tournaments');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cricket_tournaments', JSON.stringify(tournaments));
    }, [tournaments]);

    const addTournament = (name, teams) => {
        const id = Date.now().toString();

        // Generate Fixtures (Round Robin)
        const fixtures = [];
        for (let i = 0; i < teams.length; i++) {
            for (let j = i + 1; j < teams.length; j++) {
                fixtures.push({
                    id: `${id}_m_${fixtures.length + 1}`,
                    teamA: teams[i],
                    teamB: teams[j],
                    status: 'scheduled',
                    matchId: null // Link to actual match ID when played
                });
            }
        }

        const newTournament = {
            id,
            name,
            teams,
            fixtures,
            createdAt: new Date().toISOString(),
            standings: teams.map(team => ({
                name: team,
                played: 0,
                won: 0,
                lost: 0,
                tied: 0,
                points: 0,
            }))
        };

        setTournaments(prev => [newTournament, ...prev]);
        return id;
    };

    const getTournament = (id) => tournaments.find(t => t.id === id);

    const updateTournamentStandings = (tournamentId, matchResult) => {
        setTournaments(prev => prev.map(t => {
            if (t.id !== tournamentId) return t;

            // Simple win/loss update for now
            const newStandings = t.standings.map(s => {
                if (s.name === matchResult.winner) {
                    return { ...s, played: s.played + 1, won: s.won + 1, points: s.points + 2 };
                } else if (matchResult.teams.includes(s.name) && s.name !== matchResult.winner) {
                    return { ...s, played: s.played + 1, lost: s.lost + 1 };
                }
                return s;
            });

            // Update fixture status
            const newFixtures = t.fixtures.map(f => {
                if (f.id === matchResult.fixtureId) {
                    return { ...f, status: 'completed', matchId: matchResult.matchId, winner: matchResult.winner };
                }
                return f;
            });

            return { ...t, standings: newStandings, fixtures: newFixtures };
        }));
    };

    return (
        <TournamentContext.Provider value={{ tournaments, addTournament, getTournament, updateTournamentStandings }}>
            {children}
        </TournamentContext.Provider>
    );
};
