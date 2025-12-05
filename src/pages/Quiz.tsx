import { useState, useCallback, useEffect } from 'react';
import {
  Question,
  Trophy,
  ArrowRight,
  Check,
  X,
  CircleNotch,
  Confetti,
  Heart,
  Star,
  Medal,
  Warning
} from '@phosphor-icons/react';
import { WEDDING_CONFIG } from '../config';
import './Quiz.css';

const { quiz, api, couple } = WEDDING_CONFIG;

const QUIZ_PLAYED_KEY = 'quiz_played';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

interface FormData {
  nombre: string;
  email: string;
}

type GameState = 'intro' | 'playing' | 'result' | 'already_played';

function Quiz() {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Verificar si ya jugó desde localStorage
    const played = localStorage.getItem(QUIZ_PLAYED_KEY);
    return played ? 'already_played' : 'intro';
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [formData, setFormData] = useState<FormData>({ nombre: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [timerActive, setTimerActive] = useState(false);

  const questions: QuizQuestion[] = quiz.questions;
  const totalQuestions = questions.length;

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleTimeUp = () => {
    setTimerActive(false);
    setShowCorrect(true);
    setTimeout(() => goToNextQuestion(), 2000);
  };

  const startGame = () => {
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(15);
    setTimerActive(true);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null || showCorrect) return;
    
    setSelectedAnswer(index);
    setTimerActive(false);
    
    const isCorrect = index === questions[currentQuestion].correctIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    
    setShowCorrect(true);
    setTimeout(() => goToNextQuestion(), 1500);
  };

  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowCorrect(false);
      setTimeLeft(15);
      setTimerActive(true);
    } else {
      setGameState('result');
      setTimerActive(false);
    }
  };

  const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmitResult = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre.trim() || !formData.email.trim()) return;

    setIsSubmitting(true);
    setEmailError(false);
    
    try {
      const response = await fetch(api.quiz, {
        redirect: 'follow',
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          tipo: 'quiz',
          nombre: formData.nombre,
          email: formData.email,
          puntuacion: score,
          totalPreguntas: totalQuestions,
          porcentaje: Math.round((score / totalQuestions) * 100),
          fecha: new Date().toISOString(),
        }),
      });

      const result = await response.json();
      
      if (result.message === 'email_exists') {
        setEmailError(true);
      } else if (response.ok) {
        setIsSubmitted(true);
        localStorage.setItem(QUIZ_PLAYED_KEY, 'true');
      }
    } catch {
      setIsSubmitted(true);
      localStorage.setItem(QUIZ_PLAYED_KEY, 'true');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResultMessage = () => {
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return { icon: <Trophy size={64} weight="light" />, title: '¡Perfecto! 🎉', message: `¡Conoces a ${couple.fullNames} mejor que nadie!` };
    if (percentage >= 70) return { icon: <Star size={64} weight="light" />, title: '¡Muy bien! ⭐', message: 'Eres un gran amigo de los novios.' };
    if (percentage >= 50) return { icon: <Medal size={64} weight="light" />, title: '¡Nada mal! 👏', message: 'Conoces bastante bien a la pareja.' };
    return { icon: <Heart size={64} weight="light" />, title: '¡Sigue intentándolo! 💪', message: 'Tendrás que conocerlos mejor en la boda.' };
  };

  const restartGame = () => {
    setGameState('intro');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowCorrect(false);
    setFormData({ nombre: '', email: '' });
    setIsSubmitted(false);
    setTimeLeft(15);
  };

  return (
    <main className="quiz-container page-enter" role="main" aria-label="Quiz sobre los novios">
      {/* Already played */}
      {gameState === 'already_played' && (
        <div className="quiz-intro">
          <div className="quiz-icon">
            <Check size={64} weight="light" />
          </div>
          <h1>Ya has jugado</h1>
          <p className="quiz-subtitle">
            Solo se permite una participación por persona. ¡Gracias por jugar!
          </p>
        </div>
      )}

      {/* Intro */}
      {gameState === 'intro' && (
        <div className="quiz-intro">
          <div className="quiz-icon">
            <Question size={64} weight="light" />
          </div>
          <h1>¿Cuánto sabes de nosotros?</h1>
          <p className="quiz-subtitle">
            Pon a prueba tus conocimientos sobre {couple.fullNames}.
          </p>
          <div className="quiz-rules">
            <div className="rule">
              <span className="rule-number">1</span>
              <span>{totalQuestions} preguntas sobre los novios</span>
            </div>
            <div className="rule">
              <span className="rule-number">2</span>
              <span>15 segundos por pregunta</span>
            </div>
            <div className="rule">
              <span className="rule-number">3</span>
              <span>Solo tienes una oportunidad</span>
            </div>
          </div>
          <button className="start-btn" onClick={startGame}>
            <span>Empezar quiz</span>
            <ArrowRight size={20} weight="light" />
          </button>
        </div>
      )}

      {/* Playing */}
      {gameState === 'playing' && (
        <div className="quiz-playing">
          {/* Progress bar */}
          <div className="quiz-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
              />
            </div>
            <span className="progress-text">
              {currentQuestion + 1} / {totalQuestions}
            </span>
          </div>

          {/* Timer */}
          <div className={`quiz-timer ${timeLeft <= 5 ? 'urgent' : ''}`}>
            <span className="timer-value">{timeLeft}</span>
            <span className="timer-label">segundos</span>
          </div>

          {/* Question */}
          <div className="quiz-question">
            <h2>{questions[currentQuestion].question}</h2>
          </div>

          {/* Options */}
          <div className="quiz-options">
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === questions[currentQuestion].correctIndex;
              const showAsCorrect = showCorrect && isCorrect;
              const showAsWrong = showCorrect && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  className={`option-btn ${isSelected ? 'selected' : ''} ${showAsCorrect ? 'correct' : ''} ${showAsWrong ? 'wrong' : ''}`}
                  onClick={() => handleAnswer(index)}
                  disabled={showCorrect}
                >
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">{option}</span>
                  {showAsCorrect && <Check size={20} weight="bold" className="option-icon" />}
                  {showAsWrong && <X size={20} weight="bold" className="option-icon" />}
                </button>
              );
            })}
          </div>

          {/* Score */}
          <div className="quiz-score">
            <span>Puntuación: {score}</span>
          </div>
        </div>
      )}

      {/* Result */}
      {gameState === 'result' && (
        <div className="quiz-result">
          <div className="result-icon">
            {getResultMessage().icon}
          </div>
          <h2>{getResultMessage().title}</h2>
          <p className="result-message">{getResultMessage().message}</p>
          
          <div className="result-score">
            <span className="score-value">{score}</span>
            <span className="score-separator">/</span>
            <span className="score-total">{totalQuestions}</span>
          </div>
          <p className="score-percentage">{Math.round((score / totalQuestions) * 100)}% de aciertos</p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmitResult} className="result-form">
              <p className="form-intro">Registra tu puntuación</p>
              
              {emailError && (
                <div className="email-error">
                  <Warning size={18} weight="light" />
                  <span>Este email ya ha sido registrado</span>
                </div>
              )}
              
              <div className="form-field">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleFormChange}
                  placeholder=" "
                  id="nombre"
                  required
                />
                <label htmlFor="nombre">Tu nombre *</label>
              </div>
              <div className="form-field">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder=" "
                  id="email"
                  required
                />
                <label htmlFor="email">Tu email *</label>
              </div>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <CircleNotch size={18} className="spinner" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Trophy size={18} weight="light" />
                    Registrar puntuación
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="result-submitted">
              <Confetti size={48} weight="light" />
              <p>¡Puntuación registrada!</p>
              <span>Gracias por participar</span>
            </div>
          )}

          <button className="retry-btn" onClick={restartGame} style={{ display: 'none' }}>
            Volver a intentarlo
          </button>
        </div>
      )}
    </main>
  );
}

export default Quiz;
