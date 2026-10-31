import { useMemo, useState } from 'react';
import { ArrowLeft, Shuffle, Pencil, Check, Trophy, RotateCcw, X, Sparkles } from 'lucide-react';

const LEVELS = {
  Easy: { points: 5, pace: 'Relaxed' },
  Medium: { points: 10, pace: 'Quick' },
  Hard: { points: 20, pace: 'Blitz' }
};

function shuffledNumbers() {
  const values = Array.from({ length: 25 }, (_, index) => index + 1);
  for (let index = values.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [values[index], values[swapIndex]] = [values[swapIndex], values[index]];
  }
  return values;
}

const WINNING_LINES = [
  ...Array.from({ length: 5 }, (_, row) =>
    Array.from({ length: 5 }, (_, col) => row * 5 + col)
  ),
  ...Array.from({ length: 5 }, (_, col) =>
    Array.from({ length: 5 }, (_, row) => row * 5 + col)
  ),
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20]
];

function completedLines(marked) {
  return WINNING_LINES.filter((line) => line.every((index) => marked.includes(index)));
}

export default function App() {
  const [level, setLevel] = useState('Medium');
  const [numbers, setNumbers] = useState(shuffledNumbers);
  const [marked, setMarked] = useState([]);
  const [editing, setEditing] = useState(false);
  const [score, setScore] = useState(0);
  const [turn, setTurn] = useState(1);
  const [message, setMessage] = useState('Tap numbers to mark them, then verify your pattern.');
  const [verified, setVerified] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  const wins = useMemo(() => completedLines(marked), [marked]);

  function resetCard() {
    setNumbers(shuffledNumbers());
    setMarked([]);
    setVerified(false);
    setEditing(false);
    setMessage('A fresh 25-number card is ready. Your turn!');
  }

  function startNextTurn() {
    setTurn((current) => current + 1);
    resetCard();
  }

  function autoFill() {
    setNumbers(shuffledNumbers());
    setMarked([]);
    setVerified(false);
    setMessage('Auto-filled! Your numbers have been shuffled.');
  }

  function toggleMark(index) {
    if (editing) return;
    setMarked((current) =>
      current.includes(index)
        ? current.filter((item) => item !== index)
        : [...current, index]
    );
    setVerified(false);
  }

  function changeNumber(index, rawValue) {
    if (rawValue === '') {
      setNumbers((current) => current.map((value, i) => i === index ? '' : value));
      setMarked((current) => current.filter((item) => item !== index));
      setVerified(false);
      return;
    }
    const value = Number(rawValue);
    if (!Number.isInteger(value) || value < 1 || value > 25) return;
    setNumbers((current) => current.map((oldValue, i) => i === index ? value : oldValue));
    setMarked((current) => current.filter((item) => item !== index));
    setVerified(false);
  }

  function verifyCard() {
    if (wins.length === 0) {
      setMessage('Not Bingo yet! Complete a full row, column, or diagonal.');
      return;
    }
    if (verified) {
      setMessage('This card has already been verified. Start another turn to score again.');
      return;
    }
    const points = LEVELS[level].points * wins.length;
    setScore((current) => current + points);
    setVerified(true);
    setMessage(`BINGO! ${wins.length} winning line${wins.length === 1 ? '' : 's'} verified. +${points} points!`);
  }

  return (
    <div className="page">
      <header className="topbar">
        <button className="back-button" onClick={resetCard} aria-label="Reset card"><ArrowLeft /></button>
        <div className="brand"><Sparkles size={18} /> BINGO<span>25</span></div>
        <div className="top-label">25 NUMBERS</div>
      </header>

      <main>
        <section className="intro">
          <div className="eyebrow">THE QUICK-FIRE BINGO GAME</div>
          <h1>Pick. Mark. <span>BINGO.</span></h1>
          <p>One card. Twenty-five numbers. Make your winning line.</p>
        </section>

        <section className="game-card">
          <div className="section-heading">
            <div><div className="eyebrow">CHOOSE YOUR LEVEL</div><h2>Set the challenge</h2></div>
            <div className="turn-chip">TURN {turn}</div>
          </div>

          <div className="levels">
            {Object.entries(LEVELS).map(([name, details]) => (
              <button key={name} className={`level-button ${level === name ? 'active' : ''}`}
                onClick={() => { setLevel(name); setMessage(`${name} mode selected.`); }}>
                <b>{name}</b><small>{details.pace} pace</small>
              </button>
            ))}
          </div>

          <div className="section-heading board-heading">
            <div><div className="eyebrow">YOUR BINGO CARD</div><h2>Mark your numbers</h2></div>
            <div className="tools">
              <button onClick={autoFill}><Shuffle size={15} /> Auto fill</button>
              <button className={editing ? 'editing' : ''} onClick={() => setEditing((value) => !value)}>
                <Pencil size={14} /> {editing ? 'Done' : 'Manual'}
              </button>
            </div>
          </div>

          <div className="board-shell">
            <div className="letters">{['B', 'I', 'N', 'G', 'O'].map((letter) => <span key={letter}>{letter}</span>)}</div>
            <div className="board">
              {numbers.map((number, index) => (
                <div className={`tile ${marked.includes(index) ? 'marked' : ''}`} key={index}>
                  {editing ? (
                    <input aria-label={`Cell ${index + 1}`} type="number" min="1" max="25"
                      value={number} onChange={(event) => changeNumber(index, event.target.value)} />
                  ) : (
                    <button type="button" aria-pressed={marked.includes(index)} onClick={() => toggleMark(index)}>
                      {number}
                    </button>
                  )}
                  {marked.includes(index) && <span className="checkmark"><Check size={14} /></span>}
                </div>
              ))}
              <svg className="winning-lines" viewBox="0 0 500 500" preserveAspectRatio="none" aria-hidden="true">
                {wins.map((line, index) => {
                  const first = line[0];
                  const last = line[line.length - 1];
                  return <line key={index}
                    x1={(first % 5) * 100 + 50} y1={Math.floor(first / 5) * 100 + 50}
                    x2={(last % 5) * 100 + 50} y2={Math.floor(last / 5) * 100 + 50} />;
                })}
              </svg>
            </div>
            <div className="board-hint">
              <span><i /> {marked.length} / 25 marked</span>
              <span>{editing ? 'Enter numbers from 1 to 25' : 'Tap a tile to mark / unmark'}</span>
            </div>
          </div>

          <div className="status-message"><span className="status-dot" />{message}</div>

          <div className="score-panel">
            <div className="your-turn">Your Turn</div>
            <div className="score">SCORE: <b>{score}</b></div>
            <div className="action-buttons">
              <button className="verify-button" onClick={verifyCard}>Verify</button>
              <button className="leader-button" onClick={() => setLeaderboardOpen(true)}><Trophy size={18} /> Leader Board</button>
            </div>
            <button className="next-button" onClick={startNextTurn}><RotateCcw size={14} /> Start next turn</button>
          </div>
        </section>

        <section className="rules"><b>How to score</b><span>Complete a full horizontal row, vertical column, or diagonal. Press Verify to claim your points.</span></section>
      </main>

      <footer><span>© 2026 BINGO 25</span><span>FAST HANDS. SMART MARKS.</span></footer>

      {leaderboardOpen && (
        <div className="modal-backdrop" onClick={() => setLeaderboardOpen(false)}>
          <section className="modal" role="dialog" aria-modal="true" aria-labelledby="leader-title" onClick={(event) => event.stopPropagation()}>
            <button className="close-button" onClick={() => setLeaderboardOpen(false)} aria-label="Close"><X /></button>
            <Trophy className="modal-trophy" size={32} />
            <div className="eyebrow">PLAYER STATS</div>
            <h2 id="leader-title">Leaderboard</h2>
            <div className="leader-row"><span>YOU · Current session</span><b>{score} pts</b></div>
            <p>Your score is kept for this game session. Play more turns to build it up.</p>
            <button className="leader-button modal-button" onClick={() => setLeaderboardOpen(false)}>Back to game</button>
          </section>
        </div>
      )}
    </div>
  );
}