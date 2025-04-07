import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './QuizSection.css';

const QuizSection = ({ quizzes: initialQuizzes, lectureId, isAdmin }) => {
  const [quizzes, setQuizzes] = useState(initialQuizzes);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    questions: [
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswers: [],
      },
    ],
  });

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/v1/quizzes/${lectureId}`, newQuiz);
      setQuizzes([data.quiz, ...quizzes]);
      setShowCreateForm(false);
      setNewQuiz({
        title: '',
        description: '',
        timeLimit: 30,
        questions: [
          {
            question: '',
            options: ['', '', '', ''],
            correctAnswers: [],
          },
        ],
      });
      toast.success('Quiz created successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`/api/v1/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
      toast.success('Quiz deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting quiz');
    }
  };

  const handleStartQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setUserAnswers({});
    setQuizResults(null);
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: [...(prev[questionIndex] || []), optionIndex].filter(
        (item, index, self) => self.indexOf(item) === index
      ),
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const { data } = await axios.post(
        `/api/v1/quizzes/${selectedQuiz._id}/submit`,
        { answers: userAnswers }
      );
      setQuizResults(data.results);
      toast.success('Quiz submitted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting quiz');
    }
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [
        ...newQuiz.questions,
        {
          question: '',
          options: ['', '', '', ''],
          correctAnswers: [],
        },
      ],
    });
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...newQuiz.questions];
    if (field === 'correctAnswers') {
      updatedQuestions[index][field] = value
        .split(',')
        .map(num => parseInt(num))
        .filter(num => !isNaN(num) && num >= 0 && num < 4);
    } else if (field === 'options') {
      const [optionIndex, optionValue] = value;
      updatedQuestions[index][field][optionIndex] = optionValue;
    } else {
      updatedQuestions[index][field] = value;
    }
    setNewQuiz({ ...newQuiz, questions: updatedQuestions });
  };

  return (
    <div className="quiz-section">
      {isAdmin && !selectedQuiz && (
        <div className="admin-controls">
          <button
            className="create-quiz-button"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New Quiz'}
          </button>

          {showCreateForm && (
            <form className="quiz-form" onSubmit={handleCreateQuiz}>
              <input
                type="text"
                placeholder="Quiz Title"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Quiz Description"
                value={newQuiz.description}
                onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Time Limit (minutes)"
                value={newQuiz.timeLimit}
                onChange={(e) => setNewQuiz({...newQuiz, timeLimit: parseInt(e.target.value)})}
                min="1"
                required
              />

              {newQuiz.questions.map((question, qIndex) => (
                <div key={qIndex} className="question-form">
                  <input
                    type="text"
                    placeholder="Question"
                    value={question.question}
                    onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                    required
                  />
                  {question.options.map((option, oIndex) => (
                    <input
                      key={oIndex}
                      type="text"
                      placeholder={`Option ${oIndex + 1}`}
                      value={option}
                      onChange={(e) => updateQuestion(qIndex, 'options', [oIndex, e.target.value])}
                      required
                    />
                  ))}
                  <input
                    type="text"
                    placeholder="Correct Answers (comma-separated indices, 0-3)"
                    value={question.correctAnswers.join(',')}
                    onChange={(e) => updateQuestion(qIndex, 'correctAnswers', e.target.value)}
                    required
                  />
                </div>
              ))}
              <button type="button" onClick={addQuestion}>
                Add Question
              </button>
              <button type="submit">Create Quiz</button>
            </form>
          )}
        </div>
      )}

      {!selectedQuiz && (
        <div className="quizzes-list">
          {quizzes.length === 0 ? (
            <p className="no-quizzes">No quizzes available for this lecture.</p>
          ) : (
            quizzes.map(quiz => (
              <div key={quiz._id} className="quiz-card">
                <div className="quiz-info">
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <div className="quiz-meta">
                    <span>{quiz.questions.length} questions</span>
                    <span>{quiz.timeLimit} minutes</span>
                  </div>
                </div>
                <div className="quiz-actions">
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="start-button"
                  >
                    Start Quiz
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => handleDeleteQuiz(quiz._id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedQuiz && !quizResults && (
        <div className="quiz-taking">
          <h2>{selectedQuiz.title}</h2>
          <p>{selectedQuiz.description}</p>
          
          {selectedQuiz.questions.map((question, qIndex) => (
            <div key={qIndex} className="question-card">
              <h3>Question {qIndex + 1}</h3>
              <p>{question.question}</p>
              <div className="options-list">
                {question.options.map((option, oIndex) => (
                  <label key={oIndex} className="option-label">
                    <input
                      type="checkbox"
                      checked={(userAnswers[qIndex] || []).includes(oIndex)}
                      onChange={() => handleAnswerSelect(qIndex, oIndex)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          <button onClick={handleSubmitQuiz} className="submit-button">
            Submit Quiz
          </button>
        </div>
      )}

      {quizResults && (
        <div className="quiz-results">
          <h2>Quiz Results</h2>
          <div className="results-summary">
            <p>Score: {quizResults.score}%</p>
            <p>Correct Answers: {quizResults.correctAnswers}</p>
            <p>Total Questions: {quizResults.totalQuestions}</p>
          </div>
          <button
            onClick={() => {
              setSelectedQuiz(null);
              setQuizResults(null);
            }}
            className="back-button"
          >
            Back to Quizzes
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizSection; 