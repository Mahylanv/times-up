'use client';

import { useEffect, useMemo, useState } from 'react';

type TeamScore = {
  name: string;
  rounds: number[];
};

const ROUNDS = 3;
const TURN_DURATION = 60;

const TEAM_COLORS = ['#f59e0b', '#22d3ee'];

const BASE_CARDS = [
  "Chanter du yodel en trottinette",
  "Dinosaure végétarien stressé",
  "Chef d'orchestre de klaxons",
  "Pilote de drone en pantoufles",
  "Mannequin de gilets de sauvetage",
  "Vendeur de sable lunaire",
  "Pingouin qui fait du yoga",
  "Inventeur de parapluies invisibles",
  "Poète spécialiste du fromage",
  "Capitaine de péniche spatiale",
  "Chasseur de moustiques géant",
  "Gardien de phare portable",
  "Magicien des horaires de trains",
  "Jongleur de cactus",
  "Facteur en montgolfière",
  "Coach d'escargots",
  "Ninja allergique aux ombres",
  "Champion de curling sur tapis",
  "DJ de silence total",
  "Dompteur de trombones",
  "Astronaute claustrophobe",
  "Conducteur de bus aquatique",
  "Sommelier de sirops",
  "Spationaute qui craint le vide",
  "Architecte de châteaux gonflables",
  "Barbier de licornes",
  "Skateur sur savon",
  "Surfeur sur marelle",
  "Guitariste de feu de camp polaire",
  "Inventeur de chaussettes parlantes",
  "Testeur de toboggans géants",
  "Guide touristique du sous-sol",
  "Agent secret qui murmure",
  "Plombier pour robots",
  "Pilote d'avion en origami",
  "Présentateur météo sous-marine",
  "Horloger de nuages",
  "Rédacteur de cartes postales vides",
  "Acrobate en slow motion",
  "Coureur de marathons en marche arrière",
  "Maquilleur de statues",
  "Dresseur de moustaches",
  "Chef pâtissier en apesanteur",
  "Capitaine de bateau sur sable",
  "Jardinier de plantes carnivores timides",
  "Arbitre de combats de coussins",
  "Collectionneur de sons",
  "Phare humain",
  "Cavalier de vélos à bascule",
  "Bibliothécaire de cris",
];

const shuffle = (items: string[]) => {
  const deck = [...items];
  for (let i = deck.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const createTeams = (): TeamScore[] => [
  { name: 'Équipe A', rounds: Array(ROUNDS).fill(0) },
  { name: 'Équipe B', rounds: Array(ROUNDS).fill(0) },
];

export default function Home() {
  const [round, setRound] = useState(1);
  const [deck, setDeck] = useState<string[]>(() => shuffle(BASE_CARDS));
  const [teams, setTeams] = useState<TeamScore[]>(createTeams);
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

  const endTurn = () => {
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
    setRound(nextRound);
    setDeck(shuffle(BASE_CARDS));
    setRoundFinished(false);
    setIsRunning(false);
    setTimeLeft(TURN_DURATION);
    setMessage(`Round ${nextRound} lancé, à ${teams[0].name} de jouer !`);
    setCurrentTeam(0);
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

  return (
    <main>
      <div className="hero">
        <div>
          <div className="badge">Times Up express - 50 cartes - 3 rounds</div>
          <h1>Times Up Sprint</h1>
          <p>
            2 équipes, 60 secondes par tour. Valide ou passe chaque carte, les 50 doivent tomber
            avant de passer au round suivant.
          </p>
          <div className="chips" style={{ marginTop: 12 }}>
            <div className="pill">Round {round} / {ROUNDS}</div>
            <div className="pill">{cardsValidatedThisRound} cartes validées - {cardsRemaining} restantes</div>
          </div>
        </div>
        <div className="surface" style={{ minWidth: 260 }}>
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
          <div className="actions" style={{ marginTop: 12 }}>
            <button className="btn-primary" onClick={startTurn} disabled={isRunning || roundFinished || gameOver}>
              {isRunning ? 'En cours...' : 'Lancer le tour'}
            </button>
            <button className="btn-ghost" onClick={() => setCurrentTeam((t) => (t + 1) % teams.length)} disabled={isRunning}>
              Passer à l'autre équipe
            </button>
            <button className="btn-ghost" onClick={resetGame} disabled={isRunning}>
              Relancer la partie
            </button>
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
              className="btn-success"
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

      {(message || roundFinished || gameOver) && (
        <div className="status">
          {message ||
            (gameOver
              ? 'Partie terminée ! Relance pour une nouvelle série.'
              : 'Round terminé, relance la pioche pour la suite.')}
        </div>
      )}
      <p className="footer">Prêt pour Vercel : `npm run build` puis déploiement.</p>
    </main>
  );
}
