# Professional Cricket Scorecard Web Application – Project Documentation

## 🔰 Project Goal
To build a professional, real-world cricket scoring web application that allows admins to create matches, score live games ball-by-ball, manage tournaments, and let viewers watch live & past match scorecards. The system is designed to be suitable for college final-year / major project submission, featuring a clean UI, robust logic, and data persistence.

---

## 1️⃣ User Roles & Access Control
### Admin / Scorer
*   **Create, edit, delete matches**: Full control over match lifecycle.
*   **Start and control live scoring**: Access to the live scoring keypad.
*   **Resume paused matches**: Ability to pick up a match exactly where it left off, safe against page reloads.
*   **Password-protected access**: Optional security for match creation.

### Viewer
*   **Watch live scores (read-only)**: Real-time updates without admin privileges.
*   **View previous match scorecards**: Access detailed history of completed games.
*   **View upcoming fixtures**: See the schedule of planned tournaments.

---

## 2️⃣ Home Dashboard (Main Page)
The central hub (`src/pages/Home.jsx`) features a modern, card-based layout with navigation to:
1.  **Watch Live Matches**: Direct link to ongoing games.
2.  **Upcoming Matches**: dedicated page for scheduled fixtures.
3.  **Previous Matches**: Archive of completed match results.
4.  **Create New Scorecard**: Admin interface initialization.
5.  **Organize Tournament / Series**: Tournament setup wizard.

**Card Details**:
*   Team A vs Team B
*   Match Status (Live / Scheduled / Completed)
*   Badges for easy identification

---

## 3️⃣ Match Creation Module
**File**: `src/pages/CreateMatch.jsx`
*   **Match Formats**: T20, ODI, Test, and Custom Overs.
*   **Setup**: Enter team names, overs, and optional password.
*   **Resume/Delete**: Lists active/interrupted matches with options to Resume (Play icon) or Delete (Trash icon).

---

## 4️⃣ Team & Squad Management
**File**: `src/pages/MatchSetup.jsx`
*   **Dynamic Player Entry**: Add players one by one to Team A and Team B.
*   **Role Assignment**:
    *   🏏 Batsman
    *   ⚾ Bowler
    *   🛡️ All-Rounder
    *   🧤 Wicket-Keeper
*   **Validation**: Enforces checks (e.g., max 11 players per team).

---

## 5️⃣ Toss System
Located within `MatchSetup.jsx`:
*   **Winner Selection**: Record which team won the toss.
*   **Decision**: Record whether they elected to Bat or Bowl.
*   **Auto-Innings**: Automatically sets the batting/bowling teams for the start of the match.

---

## 6️⃣ Live Scoring System (Core Feature)
**File**: `src/pages/LiveScoring.jsx`

### Scoreboard (Real-Time)
*   Total Runs / Wickets
*   Overs (e.g., 12.4)
*   **CRR** (Current Run Rate)
*   **Target** & Needs (if chasing)

### Statistics
*   **Batting**: Striker & Non-Striker stats (Runs, Balls, 4s, 6s, SR).
*   **Bowling**: Current Bowler stats (Overs, Maidens, Runs, Wickets, Economy).

### Control Pad
*   **Runs**: 0, 1, 2, 3, 4, 6, 5 (overthrow).
*   **Extras**: Wide (WD), No Ball (NB), Bye (B), Leg Bye (LB).
*   **Wickets**: "OUT" button handling various dismissal types.
*   **Utilities**: Undo last ball button (critical for simplified scoring).

---

## 7️⃣ Ball-by-Ball Logic (Backend Logic in `MatchContext`)
*   **Auto Over Completion**: Counts legal balls; updates overs after 6 balls.
*   **Strike Rotation**: Auto-swaps batsmen on odd runs and end of overs.
*   **Extras Handling**: Wides/No Balls do not count as legal balls but add runs.
*   **Innings Transition**: Logic checks for All Out (10 wickets) or Overs Completed to switch innings.

---

## 8️⃣ Match Result System
**File**: `src/pages/MatchResult.jsx`
*   **Declaration**: Declares winner based on runs or wickets margin.
*   **Summary**: Displays final scores for both teams.
*   **Navigation**: Link back to Home or setup a new match.

---

## 9️⃣ Scorecard & History
*   **Previous Matches** (`src/pages/PreviousMatches.jsx`): List of all 'completed' matches with summary cards and date.
*   **Upcoming Matches** (`src/pages/UpcomingMatches.jsx`): List of 'scheduled' fixtures from tournaments.

---

## 🔟 Tournament / Series Module
**Context**: `src/context/TournamentContext.jsx`
*   **Create Tournament**: Define tournament name and participation teams.
*   **Fixtures**: Auto-generate match schedule.
*   **Points Table**: Tracks Played, Won, Lost, Points, and NRR (Net Run Rate logic placeholder).

---

## 1️⃣1️⃣ Data Persistence
*   **Storage**: Browser `localStorage`.
*   **Mechanism**: State is automatically saved on every update. Refreshing the page does NOT lose match data.
*   **MatchHistory**: All matches are stored in a persistent "matches" array.

---

## 1️⃣2️⃣ UI / UX Design
*   **Styling**: Validated Tailwind CSS.
*   **Theme**: Dark/Light mode compatible (Dark themed dashboard).
*   **Responsiveness**: Mobile-first design for on-field scoring.
*   **Animations**: Smooth transitions using CSS animations (fade, slide).

---

## 1️⃣3️⃣ Tech Stack
*   **Frontend**: React.js (Vite)
*   **State Management**: React Context API (`MatchContext`, `TournamentContext`)
*   **Styling**: Tailwind CSS
*   **Routing**: React Router DOM
*   **Icons**: Lucide React
*   **Build Tool**: Vite

---

## 1️⃣4️⃣ College Viva / Interview Talking Points
*   **Component Architecture**: How the app is split into `LiveScoring`, `MatchSetup`, etc.
*   **Context API**: usage for global state management (avoiding prop drilling).
*   **Complex Logic**: Handling cricket rules (overs, extras, strike rotation) in JavaScript.
*   **Persistence**: How `localStorage` mimics a database for a client-side app.
*   **UX Decisions**: Why certain buttons are placed for accessibility (Thumb zone).

---

## ✅ Final Status
The application serves as a complete, functional prototype for a Cricket Scoring System, meeting all the requirements for a standard college major project.
