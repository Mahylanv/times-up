'use client';

import { useEffect, useMemo, useState } from 'react';

type TeamScore = {
  name: string;
  rounds: number[];
};

const ROUNDS = 3;
const TURN_DURATION = 60;

const MIN_TEAMS = 2;
const MAX_TEAMS = 5;
const TEAM_LABELS = ['A', 'B', 'C', 'D', 'E'];
const TEAM_COLORS = ['#f59e0b', '#22d3ee', '#f472b6', '#34d399', '#a78bfa'];
const ROUND_RULES = ['Description libre', 'Un seul mot', 'Mimes'];

const BASE_CARDS = [
  "Lampe frontale",
  "Sac a dos",
  "Chaussure de rando",
  "Batterie externe",
  "Brosse a cheveux",
  "Ballon de basket",
  "Clavier sans fil",
  "Figurine Lego",
  "Tapis de souris",
  "Tournevis",
  "Piano jouet",
  "Casque de ski",
  "Torchon",
  "Bouteille d eau",
  "Couteau suisse",
  "Brosse a dents",
  "Camera instantanee",
  "Micro cravate",
  "Carnet a spirale",
  "Vase en verre",
  "Plante en pot",
  "Lunettes de natation",
  "Puzzle 500 pieces",
  "Voiture telecommandee",
  "Montre connectee",
  "Balance de cuisine",
  "Bougie parfumee",
  "Ruban adhesif",
  "Cahier de dessin",
  "Bonnette anti vent",
  "Harmonica",
  "Chaussettes de sport",
  "Mug isotherme",
  "Cloche a vache",
  "Livre de voyage",
  "Sac banane",
  "Balle anti stress",
  "Casque gaming",
  "Gourde inox",
  "Rubiks Cube",
  "Cle USB",
  "Tablier",
  "Basket montante",
  "Planche a decouper",
  "Paquet de cartes",
  "Tapis de course miniature",
  "Perche telescopique",
  "Bague en bois",
  "Brosse a barbe",
  "Figurine d astronaute",
];

const shuffle = (items: string[]) => {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const createTeams = (count = MIN_TEAMS): TeamScore[] =>
  Array.from({ length: count }, (_, idx) => ({
    name: `Équipe ${TEAM_LABELS[idx]}`,
    rounds: Array(ROUNDS).fill(0),
  }));

export default function Home() {
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState<string[]>(() => shuffle(BASE_CARDS));
  const [teams, setTeams] = useState<TeamScore[]>(() => createTeams());
  const [currentTeam, setCurrentTeam] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);
  const [roundFinished, setRoundFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState<string>('');

  const cardsRemaining = deck.length;
  const currentCard = deck[0];

  const cardsValidatedThisRound = useMemo(
    () => teams.reduce((acc, team) => acc + team.rounds[round - 1], 0),
    [round, teams],
  );

  useEffect(() => {
    if (!isRunning) return undefined;
    if (timeLeft <= 0) {
      endTurn();
      return undefined;
    }
    const timer = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [isRunning, timeLeft]);

  const playBuzzer = () => {
    try {
      const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      const play = () => {
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const t0 = audioCtx.currentTime;
        const duration = 0.8;

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.value = 880;
        osc2.frequency.value = 660;

        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.22, t0 + 0.08);
        gain.gain.setValueAtTime(0.18, t0 + duration - 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioCtx.destination);
        osc1.start(t0);
        osc2.start(t0);
        osc1.stop(t0 + duration);
        osc2.stop(t0 + duration);
        osc2.onended = () => audioCtx.close();
      };
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(play).catch(() => {});
      } else {
        play();
      }
    } catch {
      // Ignore audio errors.
    }
  };

  const endTurn = () => {
    playBuzzer();
    setIsRunning(false);
    setTimeLeft(TURN_DURATION);
    setMessage("Temps écoulé ! À l'équipe suivante.");
    setCurrentTeam((prev) => (prev + 1) % teams.length);
  };

  const completeRound = () => {
    setIsRunning(false);
    setRoundFinished(true);
    setTimeLeft(TURN_DURATION);
    setMessage(`Round ${round} terminé !`);
    if (round === ROUNDS) {
      setGameOver(true);
    }
  };

  const startNextRound = () => {
    if (round >= ROUNDS) {
      setGameOver(true);
      return;
    }
    const nextRound = round + 1;
    const nextTeam = (currentTeam + 1) % teams.length;
    setRound(nextRound);
    setDeck(shuffle(BASE_CARDS));
    setRoundFinished(false);
    setIsRunning(false);
    setTimeLeft(TURN_DURATION);
    setCurrentTeam(nextTeam);
    setMessage(
      `Round ${nextRound} lancé, ${ROUND_RULES[nextRound - 1].toLowerCase()} - à ${teams[nextTeam].name} de jouer !`,
    );
  };

  const startTurn = () => {
    if (gameOver || roundFinished) return;
    if (!deck.length) {
      completeRound();
      return;
    }
    setMessage('');
    setIsRunning(true);
    setTimeLeft(TURN_DURATION);
  };

  const updateScore = () => {
    setTeams((prev) =>
      prev.map((team, idx) =>
        idx === currentTeam
          ? {
              ...team,
              rounds: team.rounds.map((score, rIdx) => (rIdx === round - 1 ? score + 1 : score)),
            }
          : team,
      ),
    );
  };

  const handleValidate = () => {
    if (!deck.length || roundFinished || gameOver) return;
    updateScore();
    setDeck((prev) => {
      if (!prev.length) return prev;
      const [, ...rest] = prev;
      if (rest.length === 0) {
        completeRound();
      }
      return rest;
    });
  };

  const handlePass = () => {
    if (!deck.length || roundFinished || gameOver) return;
    setDeck((prev) => {
      if (prev.length <= 1) return prev;
      const [first, ...rest] = prev;
      return [...rest, first];
    });
  };

  const resetGame = () => {
    setRound(1);
    setDeck(shuffle(BASE_CARDS));
    setTeams(createTeams());
    setCurrentTeam(0);
    setIsRunning(false);
    setTimeLeft(TURN_DURATION);
    setRoundFinished(false);
    setGameOver(false);
    setMessage('Nouvelle partie, à Équipe A de lancer !');
  };

  const handleAddTeam = () => {
    setTeams((prev) => {
      if (prev.length >= MAX_TEAMS) return prev;
      const nextIndex = prev.length;
      return [
        ...prev,
        { name: `Équipe ${TEAM_LABELS[nextIndex]}`, rounds: Array(ROUNDS).fill(0) },
      ];
    });
  };

  return (
    <main>
      <div className="hero">
        <div className="hero-copy">
          <div className="badge">Times Up express - 50 cartes - 3 rounds</div>
          <h1>Times Up Sprint</h1>
          <p>
            {teams.length} équipes, 60 secondes par tour. Valide ou passe chaque carte, les 50
            doivent tomber avant de passer au round suivant.
          </p>
          <div className="chips" style={{ marginTop: 12 }}>
            <div className="pill">Round {round} / {ROUNDS}</div>
            <div className="pill">{cardsValidatedThisRound} cartes validées - {cardsRemaining} restantes</div>
            <div className="pill">Règle: {ROUND_RULES[round - 1]}</div>
          </div>
        </div>
        <div className="surface hero-panel">
          <div className="inline" style={{ justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="team-pill">
              <span style={{ background: TEAM_COLORS[currentTeam % TEAM_COLORS.length] }} />
              {teams[currentTeam].name}
            </span>
            <small className="muted">Tour en cours</small>
          </div>
          <div className="timer">
            {timeLeft}s <small>chrono</small>
          </div>
          <div className="hero-actions" style={{ marginTop: 12 }}>
            <div className="actions">
              <button
                className="btn-accent"
                onClick={handleAddTeam}
                disabled={isRunning || teams.length >= MAX_TEAMS}
              >
                Ajouter une équipe +
              </button>
            </div>
            <div className="actions-row">
              <button className="btn-danger" onClick={resetGame} disabled={isRunning}>
                Rejouer
              </button>
              <button className="btn-primary" onClick={startTurn} disabled={isRunning || roundFinished || gameOver}>
                {isRunning ? 'En cours...' : 'Lancer le tour'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="surface card">
          <div>
            <p className="muted small-text">Carte actuelle</p>
            <h2 className="card-title">
              {currentCard ? currentCard : roundFinished ? 'Round terminé' : "Plus de cartes"}
            </h2>
            <p className="muted small-text">
              {cardsRemaining > 0 ? `${cardsRemaining} cartes restantes` : 'Plus rien dans la pioche'}
            </p>
          </div>
          <div className="actions">
            <button
              className="btn-accent"
              onClick={handleValidate}
              disabled={!isRunning || !currentCard || roundFinished || gameOver}
            >
              Valider ✓
            </button>
            <button
              className="btn-danger"
              onClick={handlePass}
              disabled={!isRunning || !currentCard || roundFinished || gameOver}
            >
              Passer ✕
            </button>
          </div>
        </div>

        <div className="surface card">
          <div className="inline" style={{ justifyContent: 'space-between' }}>
            <h3>Progression du round</h3>
            <span className="pill">{cardsValidatedThisRound}/50 validées</span>
          </div>
          <div className="stack">
            <div className="score-row">
              <span>Cartes validées</span>
              <strong>{cardsValidatedThisRound}</strong>
            </div>
            <div className="score-row">
              <span>Cartes restantes</span>
              <strong>{cardsRemaining}</strong>
            </div>
            <div className="score-row">
              <span>Chrono par tour</span>
              <strong>{TURN_DURATION}s</strong>
            </div>
            <div className="score-row">
              <span>Règle du round</span>
              <strong>{ROUND_RULES[round - 1]}</strong>
            </div>
            <div className="score-row">
              <span>Équipe en jeu</span>
              <strong>{teams[currentTeam].name}</strong>
            </div>
          </div>
          {roundFinished && !gameOver && (
            <button className="btn-primary" onClick={startNextRound}>
              Démarrer le round {round + 1}
            </button>
          )}
          {gameOver && (
            <button className="btn-primary" onClick={resetGame}>
              Rejouer une partie
            </button>
          )}
        </div>
      </div>

      <div className="surface" style={{ marginTop: 18 }}>
        <div className="inline" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
          <h3>Scores par équipe</h3>
          <span className="pill">3 rounds - 50 cartes remises en jeu à chaque manche</span>
        </div>
        <div className="scores">
          {teams.map((team, idx) => {
            const total = team.rounds.reduce((a, b) => a + b, 0);
            return (
              <div key={team.name} className="score-card">
                <div className="inline" style={{ justifyContent: 'space-between' }}>
                  <span className="team-pill">
                    <span style={{ background: TEAM_COLORS[idx % TEAM_COLORS.length] }} />
                    {team.name}
                  </span>
                  <span className="pill">Total {total}</span>
                </div>
                {team.rounds.map((score, rIdx) => (
                  <div key={rIdx} className="score-row">
                    <span>Round {rIdx + 1}</span>
                    <strong>{score}</strong>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
