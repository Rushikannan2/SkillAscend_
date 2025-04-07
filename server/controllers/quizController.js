import { Quiz } from "../models/Quiz.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";

export const createQuiz = catchAsyncError(async (req, res, next) => {
  const { title, description, lectureId, questions, timeLimit, passingScore } = req.body;

  if (!title || !description || !lectureId || !questions || !questions.length)
    return next(new ErrorHandler("Please add all fields", 400));

  // Validate questions format
  for (const question of questions) {
    if (!question.question || !question.options || question.options.length < 2) {
      return next(new ErrorHandler("Invalid question format", 400));
    }

    // Ensure at least one correct answer
    const hasCorrectAnswer = question.options.some(option => option.isCorrect);
    if (!hasCorrectAnswer) {
      return next(new ErrorHandler("Each question must have at least one correct answer", 400));
    }
  }

  await Quiz.create({
    title,
    description,
    lecture: lectureId,
    questions,
    timeLimit: timeLimit || 30,
    passingScore: passingScore || 70,
  });

  res.status(201).json({
    success: true,
    message: "Quiz created successfully",
  });
});

export const getQuiz = catchAsyncError(async (req, res, next) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);

  if (!quiz) return next(new ErrorHandler("Quiz not found", 404));

  res.status(200).json({
    success: true,
    quiz,
  });
});

export const getLectureQuizzes = catchAsyncError(async (req, res, next) => {
  const { lectureId } = req.params;

  const quizzes = await Quiz.find({ lecture: lectureId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    quizzes,
  });
});

export const updateQuiz = catchAsyncError(async (req, res, next) => {
  const { quizId } = req.params;
  const { title, description, questions, timeLimit, passingScore } = req.body;

  const quiz = await Quiz.findById(quizId);

  if (!quiz) return next(new ErrorHandler("Quiz not found", 404));

  if (title) quiz.title = title;
  if (description) quiz.description = description;
  if (timeLimit) quiz.timeLimit = timeLimit;
  if (passingScore) quiz.passingScore = passingScore;

  if (questions && questions.length > 0) {
    // Validate questions format
    for (const question of questions) {
      if (!question.question || !question.options || question.options.length < 2) {
        return next(new ErrorHandler("Invalid question format", 400));
      }

      // Ensure at least one correct answer
      const hasCorrectAnswer = question.options.some(option => option.isCorrect);
      if (!hasCorrectAnswer) {
        return next(new ErrorHandler("Each question must have at least one correct answer", 400));
      }
    }
    quiz.questions = questions;
  }

  await quiz.save();

  res.status(200).json({
    success: true,
    message: "Quiz updated successfully",
  });
});

export const deleteQuiz = catchAsyncError(async (req, res, next) => {
  const { quizId } = req.params;

  const quiz = await Quiz.findById(quizId);

  if (!quiz) return next(new ErrorHandler("Quiz not found", 404));

  await quiz.deleteOne();

  res.status(200).json({
    success: true,
    message: "Quiz deleted successfully",
  });
});

export const submitQuiz = catchAsyncError(async (req, res, next) => {
  const { quizId } = req.params;
  const { answers } = req.body;

  const quiz = await Quiz.findById(quizId);

  if (!quiz) return next(new ErrorHandler("Quiz not found", 404));

  if (!answers || !Array.isArray(answers)) {
    return next(new ErrorHandler("Please provide answers", 400));
  }

  let score = 0;
  const totalQuestions = quiz.questions.length;

  // Calculate score
  quiz.questions.forEach((question, index) => {
    const userAnswer = answers[index];
    if (!userAnswer) return;

    const correctAnswers = question.options
      .filter(option => option.isCorrect)
      .map(option => option._id.toString());

    const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
    
    // Check if user selected all correct answers and only correct answers
    if (
      correctAnswers.length === userAnswers.length &&
      correctAnswers.every(answer => userAnswers.includes(answer))
    ) {
      score++;
    }
  });

  const percentage = (score / totalQuestions) * 100;
  const passed = percentage >= quiz.passingScore;

  res.status(200).json({
    success: true,
    score,
    totalQuestions,
    percentage,
    passed,
  });
}); 