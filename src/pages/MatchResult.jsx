import { Link, useParams } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import { Trophy, Home, Share2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function MatchResult() {
    const { id } = useParams();
    const { getMatch } = useMatch();
    const match = getMatch(id);
    const confettiRef = useRef(false);

    if (!match || match.status !== 'completed') {
        return <div className="p-8 text-center">Match not completed or not found.</div>;
    }

    const winner = match.winner;
    const isDraw = winner === 'draw';

    // Calculate margin
    let marginText = '';
    if (winner === match.teamA.name) {
        if (match.score.teamA.runs > match.score.teamB.runs) {
            marginText = `${match.score.teamA.runs - match.score.teamB.runs} Runs`;
        } else {
            // Wickets win logic involves knowing how many wickets fell, usually tracked via "won by X wickets"
            // Simplified for now based on runs logic usually apply for team batting first.
            // If Team A batted second and won, it's by wickets. 
            // We need to know who batted first.
            // Assuming standard flow: if Target exists, 2nd batting team wins by wickets.
        }
    }

    // Simple basic summary for now
    const teamA = match.score.teamA;
    const teamB = match.score.teamB;

    return (
        <div className="max-w-4xl mx-auto text-center space-y-8 py-10">
            <div className="space-y-4">
                <Trophy className={`w-24 h-24 mx-auto ${winner ? 'text-[var(--accent)]' : 'text-gray-500'}`} />
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                    {isDraw ? 'Match Drawn' : `${winner} Wins!`}
                </h1>
                <p className="text-xl text-muted">
                    {winner === match.teamA.name && `${match.teamA.name} defeated ${match.teamB.name}`}
                    {winner === match.teamB.name && `${match.teamB.name} defeated ${match.teamA.name}`}
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="card border-2 border-[var(--primary)] bg-[var(--bg-card)]">
                    <h2 className="text-2xl font-bold mb-4">{match.teamA.name}</h2>
                    <div className="text-5xl font-mono font-bold">{teamA.runs}/{teamA.wickets}</div>
                    <p className="text-muted mt-2">({teamA.overs} Overs)</p>
                </div>

                <div className="card border-2 border-[var(--accent)] bg-[var(--bg-card)]">
                    <h2 className="text-2xl font-bold mb-4">{match.teamB.name}</h2>
                    <div className="text-5xl font-mono font-bold">{teamB.runs}/{teamB.wickets}</div>
                    <p className="text-muted mt-2">({teamB.overs} Overs)</p>
                </div>
            </div>

            <div className="card max-w-lg mx-auto">
                <h3 className="font-bold text-lg mb-4">Post Match Actions</h3>
                <div className="flex gap-4 justify-center">
                    <Link to="/" className="btn btn-primary">
                        <Home size={18} className="mr-2" /> Home
                    </Link>
                    <button className="btn">
                        <Share2 size={18} className="mr-2" /> Share Result
                    </button>
                </div>
            </div>
        </div>
    );
}
