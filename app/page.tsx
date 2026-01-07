'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type TeamScore = {
  name: string;
  rounds: number[];
};

const ROUNDS = 3;
const DEFAULT_TURN_DURATION = 60;
const DEFAULT_CARDS_PER_ROUND = 50;

const MIN_TEAMS = 2;
const MAX_TEAMS = 5;
const TEAM_LABELS = ['A', 'B', 'C', 'D', 'E'];
const TEAM_COLORS = ['#f59e0b', '#22d3ee', '#f472b6', '#34d399', '#a78bfa'];
const ROUND_RULES = ['Description libre', 'Un seul mot', 'Mimes'];
const TURN_OPTIONS = [15, 30, 60, 90, 120];
const CARD_OPTIONS = [10, 20, 30, 50, 100];

const OBJECT_CARDS = [
  "Planche a repasser",
  "Tronconneuse",
  "Guitare",
  "Telephone portable",
  "Lampe de chevet",
  "Aspirateur",
  "Casserole",
  "Verre a vin",
  "Tasse a cafe",
  "Couteau",
  "Fourchette",
  "Cuillere",
  "Bouteille d eau",
  "Parapluie",
  "Sac a dos",
  "Chaussure",
  "Casque audio",
  "Clavier",
  "Souris",
  "Ecran",
  "Camera",
  "Boussole",
  "Carte au tresor",
  "Bougie",
  "Velo",
  "Trottinette",
  "Planche de surf",
  "Raquette de tennis",
  "Ballon de basket",
  "Masque",
  "Lunettes de soleil",
  "Chapeau",
  "Echarpe",
  "Montre",
  "Bracelet",
  "Pinceau",
  "Cahier",
  "Stylo",
  "Crayon",
  "Gomme",
  "Regle",
  "Marteau",
  "Scie",
  "Tournevis",
  "Cle a molette",
  "Pince",
  "Valise",
  "Sac de couchage",
  "Tente",
  "Micro",
  "Haut parleur",
  "Manette",
  "Console",
  "Telecommande",
  "Tablette",
  "Ordinateur",
  "Imprimante",
  "Tableau blanc",
  "Thermos",
  "Gourde",
  "Panier de pique nique",
  "Tapis de yoga",
  "Perche a selfie",
  "Batterie externe",
  "Chargeur",
  "Drone",
  "Jumelles",
  "Tondeuse",
  "Perceuse",
  "Rouleau de peinture",
  "Poubelle",
  "Cafetiere",
  "Fer a repasser",
  "Seche cheveux",
  "Ancre",
  "Sablier",
  "Microscope",
  "Telescope",
  "Thermometre",
  "Parachute",
  "Gilet de sauvetage",
  "Katana",
  "Accordeon",
  "Ukulele",
  "Vinyle",
  "Projecteur",
  "Pompe a velo",
  "Casque de chantier",
  "Toque de chef",
];

const ACTION_CARDS = [
  "Courir",
  "Sauter",
  "Danser",
  "Chanter",
  "Nager",
  "Cuisiner",
  "Laver",
  "Balayer",
  "Conduire",
  "Voler",
  "Escalader",
  "Dessiner",
  "Peindre",
  "Bricoler",
  "Dormir",
  "Rire",
  "Pleurer",
  "Crier",
  "Murmurer",
  "Se battre",
  "Se cacher",
  "Ramper",
  "Glisser",
  "Tomber",
  "Se relever",
  "Applaudir",
  "Siffler",
  "Boire",
  "Manger",
  "Vomir",
  "Tousser",
  "Eternuer",
  "Telephoner",
  "Ecrire",
  "Lire",
  "Compter",
  "Jouer",
  "Lancer",
  "Attraper",
  "Pousser",
  "Tirer",
  "Porter",
  "Soulever",
  "Boxer",
  "Dribbler",
  "Patiner",
  "Skier",
  "Ramer",
  "Surfer",
  "Plonger",
  "Jardiner",
  "Coudre",
  "Reparer",
  "Nettoyer",
  "Chercher",
  "Trouver",
  "Frapper",
  "Explorer",
  "Sauver",
  "Poursuivre",
  "Se maquiller",
  "Se deguiser",
  "Se baigner",
];

const CHARACTER_CARDS = [
  "Dark Vador",
  "Indiana Jones",
  "Terminator",
  "Harry Potter",
  "Ron Weasley",
  "Gandalf",
  "Gollum",
  "Spiderman",
  "Batman",
  "Superman",
  "Wonder Woman",
  "Joker",
  "Harley Quinn",
  "Iron Man",
  "Captain America",
  "Thor",
  "Hulk",
  "Sherlock Holmes",
  "James Bond",
  "Lara Croft",
  "Katniss Everdeen",
  "Zelda",
  "Mario",
  "Luigi",
  "Pikachu",
  "Sonic",
  "Kratos",
  "Asterix",
  "Obelix",
  "Tintin",
  "Zorro",
  "Shrek",
  "Jack Sparrow",
  "Bob Marley",
  "Elon Musk",
  "Moise",
  "Albert Einstein",
  "Cleopatre",
  "Napoleon",
  "Charlie Chaplin",
  "Michael Jackson",
  "Bruce Lee",
  "Goku",
  "Daenerys Targaryen",
  "Jackie Chan",
  "Beyonce",
  "Serena Williams",
  "Lionel Messi",
  "Luffy",
];

const BASE_CARDS = [...OBJECT_CARDS, ...ACTION_CARDS, ...CHARACTER_CARDS];

const shuffle = (items: string[]) => {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const buildDeck = (count: number) => shuffle(BASE_CARDS).slice(0, count);

const createTeams = (count = MIN_TEAMS): TeamScore[] =>
  Array.from({ length: count }, (_, idx) => ({
    name: `Équipe ${TEAM_LABELS[idx]}`,
    rounds: Array(ROUNDS).fill(0),
  }));

export default function Home() {
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState<string[]>(() => buildDeck(DEFAULT_CARDS_PER_ROUND));
  const [teams, setTeams] = useState<TeamScore[]>(() => createTeams());
  const [currentTeam, setCurrentTeam] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [turnDuration, setTurnDuration] = useState(DEFAULT_TURN_DURATION);
  const [cardsPerRound, setCardsPerRound] = useState(DEFAULT_CARDS_PER_ROUND);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TURN_DURATION);
  const [roundFinished, setRoundFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioUnlockedRef = useRef(false);

  const cardsRemaining = deck.length;
  const currentCard = deck[0];

  const cardsValidatedThisRound = useMemo(
    () => teams.reduce((acc, team) => acc + team.rounds[round - 1], 0),
    [round, teams],
  );
  const canEditSettings = !isRunning && (roundFinished || cardsValidatedThisRound === 0);

  useEffect(() => {
    if (!isRunning) return undefined;
    if (timeLeft <= 0) {
      endTurn();
      return undefined;
    }
    const timer = window.setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [isRunning, timeLeft]);

  const unlockAudio = () => {
    if (audioUnlockedRef.current) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const unlock = () => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        gain.gain.value = 0.0001;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.02);
        audioUnlockedRef.current = true;
      };
      if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(unlock).catch(() => {});
      } else {
        unlock();
      }
    } catch {
      // Ignore audio errors.
    }
  };

  const playBuzzer = () => {
    try {
      const audioCtx = audioCtxRef.current;
      if (!audioCtx) return;
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
        osc2.onended = () => {};
      };
      audioCtx.resume().then(play).catch(() => {});
    } catch {
      // Ignore audio errors.
    }
  };

  const endTurn = () => {
    playBuzzer();
    setIsRunning(false);
    setTimeLeft(turnDuration);
    setMessage("Temps écoulé ! À l'équipe suivante.");
    setCurrentTeam((prev) => (prev + 1) % teams.length);
  };

  const completeRound = () => {
    setIsRunning(false);
    setRoundFinished(true);
    setTimeLeft(turnDuration);
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
    setDeck(buildDeck(cardsPerRound));
    setRoundFinished(false);
    setIsRunning(false);
    setTimeLeft(turnDuration);
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
    unlockAudio();
    setMessage('');
    setIsRunning(true);
    setTimeLeft(turnDuration);
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
    setDeck(buildDeck(cardsPerRound));
    setTeams(createTeams());
    setCurrentTeam(0);
    setIsRunning(false);
    setTimeLeft(turnDuration);
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

  const handleTurnDurationChange = (value: number) => {
    if (!canEditSettings) return;
    setTurnDuration(value);
    setTimeLeft(value);
  };

  const handleCardsPerRoundChange = (value: number) => {
    if (!canEditSettings) return;
    setCardsPerRound(value);
    if (!roundFinished) {
      setDeck(buildDeck(value));
    }
  };

  return (
    <main>
      <div className="hero">
        <div className="hero-copy">
          <div className="badge">Thempo - {cardsPerRound} cartes - {ROUNDS} rounds</div>
          <h1>Thempo</h1>
          <p>
            {teams.length} équipes, {turnDuration} secondes par tour. Décris, puis un mot, puis mimes.
            Valide ou passe chaque carte, les {cardsPerRound} doivent tomber avant de passer au round suivant.
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
          <div className="timer-row">
            <div className="timer">
              {timeLeft}s <small>chrono</small>
            </div>
            <button
              className="btn-ghost btn-gear"
              onClick={() => setShowSettings((prev) => !prev)}
              aria-label="Ouvrir les réglages"
              disabled={isRunning}
            >
              ⚙
            </button>
          </div>
          {showSettings && (
            <div className="settings-panel">
              <div className="settings-block">
                <p className="muted small-text">Durée du chrono</p>
                <div className="settings-options">
                  {TURN_OPTIONS.map((value) => (
                    <button
                      key={value}
                      className={`btn-chip${turnDuration === value ? ' active' : ''}`}
                      onClick={() => handleTurnDurationChange(value)}
                      disabled={!canEditSettings}
                    >
                      {value}s
                    </button>
                  ))}
                </div>
              </div>
              <div className="settings-block">
                <p className="muted small-text">Nombre de cartes</p>
                <div className="settings-options">
                  {CARD_OPTIONS.map((value) => (
                    <button
                      key={value}
                      className={`btn-chip${cardsPerRound === value ? ' active' : ''}`}
                      onClick={() => handleCardsPerRoundChange(value)}
                      disabled={!canEditSettings}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
              {!canEditSettings && (
                <p className="muted small-text">Réglages verrouillés pendant le round.</p>
              )}
            </div>
          )}
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
            <h2
              className={`card-title${!isRunning && currentCard && !roundFinished && !gameOver ? ' card-title-blur' : ''}`}
            >
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
            <span className="pill">{cardsValidatedThisRound}/{cardsPerRound} validées</span>
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
              <strong>{turnDuration}s</strong>
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
          <span className="pill">{ROUNDS} rounds - {cardsPerRound} cartes remises en jeu à chaque manche</span>
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
