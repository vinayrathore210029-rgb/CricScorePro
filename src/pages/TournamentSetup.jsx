import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Trophy, Users, ArrowRight, X } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';

export default function TournamentSetup() {
    const navigate = useNavigate();
    const { addTournament } = useTournament();

    const [name, setName] = useState('');
    const [teams, setTeams] = useState(['', '', '', '']); // Start with 4 empty slots

    const handleTeamChange = (index, value) => {
        const newTeams = [...teams];
        newTeams[index] = value;
        setTeams(newTeams);
    };

    const addTeamSlot = () => {
        setTeams([...teams, '']);
    };

    const removeTeamSlot = (index) => {
        if (teams.length <= 2) return;
        const newTeams = teams.filter((_, i) => i !== index);
        setTeams(newTeams);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validTeams = teams.filter(t => t.trim() !== '');

        if (!name.trim()) return alert('Please enter tournament name');
        if (validTeams.length < 2) return alert('Please enter at least 2 teams');

        const id = addTournament(name, validTeams);
        navigate(`/tournament/${id}`);
    };

    return (
        <div className="container py-12 max-w-2xl animate-enter">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center p-3 bg-primary-50 rounded-2xl mb-4 text-primary-600 shadow-sm">
                    <Trophy size={32} />
                </div>
                <h1 className="text-4xl font-heading font-bold text-gray-900 mb-2">Create Tournament</h1>
                <p className="text-muted text-lg">Set up your league, add teams, and generate fixtures instantly.</p>
            </div>

            <div className="card shadow-2xl border-primary-100 overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary-500 to-accent-purple" />

                <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-8">
                    {/* Tournament Name */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                            <Trophy size={16} className="text-primary-500" /> Tournament Name
                        </label>
                        <div className="relative group">
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="Ex: Premier League 2024"
                                className="input py-4 text-lg font-bold bg-gray-50 border-gray-200 focus:bg-white focus:border-primary-500 transition-all shadow-sm group-hover:border-primary-200"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Teams Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end border-b border-border pb-2">
                            <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                                <Users size={16} className="text-accent-orange" /> Participating Teams
                            </label>
                            <span className="text-xs font-bold bg-primary-50 text-primary-600 px-2 py-1 rounded">
                                {teams.filter(t => t.trim()).length} / {teams.length} Ready
                            </span>
                        </div>

                        <div className="grid gap-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                            {teams.map((team, index) => (
                                <div key={index} className="flex gap-3 group animate-enter" style={{ animationDelay: `${index * 50}ms` }}>
                                    <div className="flex-1 relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 w-6 h-6 flex items-center justify-center border border-gray-200 rounded bg-white">
                                            {index + 1}
                                        </span>
                                        <input
                                            type="text"
                                            value={team}
                                            onChange={e => handleTeamChange(index, e.target.value)}
                                            placeholder={`Team ${index + 1} Name`}
                                            className="input pl-14 font-medium hover:border-primary-300 focus:ring-4 focus:ring-primary-50 transition-all"
                                        />
                                    </div>
                                    {teams.length > 2 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTeamSlot(index)}
                                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                                            title="Remove Team"
                                        >
                                            <X size={20} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addTeamSlot}
                            className="btn w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all font-bold gap-2"
                        >
                            <Plus size={18} /> Add Another Team
                        </button>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-full py-4 text-lg shadow-xl shadow-primary-600/20 hover:shadow-2xl hover:shadow-primary-600/30 hover:-translate-y-1 transition-all group"
                        >
                            Create Tournament & Schedule <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
