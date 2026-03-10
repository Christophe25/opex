import React, { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, Award, RotateCcw } from 'lucide-react';
import { quizzes } from '../data/quizzes';

export function Quiz({ episodeId }) {
    const questions = quizzes[episodeId];

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    if (!questions || questions.length === 0) {
        return null;
    }

    const currentQuestion = questions[currentQuestionIndex];

    const handleOptionSelect = (index) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);

        if (index === currentQuestion.correctAnswer) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleRetry = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setIsFinished(false);
    };

    if (isFinished) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="quiz-container">
                <div className="quiz-result">
                    <Award size={48} className="quiz-icon-award" />
                    <h4>Quiz Terminé !</h4>
                    <p className="quiz-score-final">Votre score : <span className="highlight">{score} / {questions.length}</span> ({percentage}%)</p>
                    <button className="btn" onClick={handleRetry}>
                        <RotateCcw size={16} style={{ marginRight: '8px' }} />
                        Recommencer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <span className="quiz-progress">Question {currentQuestionIndex + 1} sur {questions.length}</span>
                <span className="quiz-score">Score: {score}</span>
            </div>

            <h4 className="quiz-question">{currentQuestion.question}</h4>

            <div className="quiz-options">
                {currentQuestion.options.map((option, index) => {
                    let className = "quiz-option";
                    if (isAnswered) {
                        if (index === currentQuestion.correctAnswer) {
                            className += " quiz-option-correct";
                        } else if (index === selectedOption) {
                            className += " quiz-option-incorrect";
                        } else {
                            className += " quiz-option-disabled";
                        }
                    }

                    return (
                        <button
                            key={index}
                            className={className}
                            onClick={() => handleOptionSelect(index)}
                            disabled={isAnswered}
                        >
                            <span className="quiz-option-text">{option}</span>
                            {isAnswered && index === currentQuestion.correctAnswer && <CheckCircle size={18} className="quiz-icon-correct" />}
                            {isAnswered && index === selectedOption && index !== currentQuestion.correctAnswer && <XCircle size={18} className="quiz-icon-incorrect" />}
                        </button>
                    )
                })}
            </div>

            {isAnswered && (
                <div className="quiz-explanation">
                    <p>{currentQuestion.explanation}</p>
                    <button className="btn btn-next" onClick={handleNext}>
                        {currentQuestionIndex < questions.length - 1 ? 'Question suivante' : 'Voir les résultats'}
                        <ChevronRight size={16} style={{ marginLeft: '8px' }} />
                    </button>
                </div>
            )}
        </div>
    );
}
