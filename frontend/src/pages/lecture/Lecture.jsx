import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import { useCourse } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Lecture = () => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("video"); // Default tab
  const [videoUrl, setVideoUrl] = useState(""); // Store video URL for playback
  
  // Admin state for quiz, notes, resources
  const [isAdmin, setIsAdmin] = useState(false); // This should come from your auth context
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [showResourcesForm, setShowResourcesForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [notes, setNotes] = useState("");
  const [resources, setResources] = useState("");
  const [quiz, setQuiz] = useState("");
  
  // For editing existing content
  const [editingNotes, setEditingNotes] = useState(false);
  const [editingResources, setEditingResources] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const { course, fetchCourse, addLecture, getVideoData, updateLectureContent, deleteLecture } = useCourse();
  const { user } = UserData(); // Get user data from UserContext

  // Add these state variables at the top with other state declarations
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0
  });

  // Add these state variables for quiz taking
  const [userAnswers, setUserAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Check if user is admin based on their role from UserContext
  useEffect(() => {
    const checkAdmin = () => {
      // Check if user exists and has admin role
      const isAdminUser = user && user.role === "admin";
      setIsAdmin(isAdminUser);
      console.log("Admin status:", isAdminUser);
      
      // If not admin, hide all admin controls
      if (!isAdminUser) {
        setShow(false);
        setShowNotesForm(false);
        setShowResourcesForm(false);
        setShowQuizForm(false);
        setEditingNotes(false);
        setEditingResources(false);
        setEditingQuiz(false);
      }
    };
    
    checkAdmin();
  }, [user]);

  // Fetch course data only when id changes
  useEffect(() => {
    if (id) {
      fetchCourse(id);
    }
  }, [id]); // Remove fetchCourse from dependencies

  // Update lectures when course changes
  useEffect(() => {
    if (course && course.lectures) {
      setLectures(course.lectures);
      setLoading(false);
    }
  }, [course]);

  // Load video and content when lecture changes
  useEffect(() => {
    if (lecture) {
      loadVideoForLecture(lecture);
      // Load other content if available
      if (lecture.notes) {
        setNotes(lecture.notes);
        console.log("Notes loaded:", lecture.notes);
      } else {
        setNotes("");
      }
      if (lecture.resources) {
        setResources(lecture.resources);
        console.log("Resources loaded:", lecture.resources);
      } else {
        setResources("");
      }
      if (lecture.quiz) {
        setQuiz(lecture.quiz);
        console.log("Quiz loaded:", lecture.quiz);
      }
    }
  }, [lecture]);

  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 50MB for IndexedDB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Video file is too large. Please use a file smaller than 50MB.");
        e.target.value = null;
        return;
      }
      
      setVideo(file);
      // Create a preview URL for the video
      const videoUrl = URL.createObjectURL(file);
      setVideoPrev(videoUrl);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    // Only allow admins to add lectures
    if (!isAdmin) {
      toast.error("You don't have permission to add lectures");
      return;
    }
    
    setBtnLoading(true);
    
    try {
      if (!video) {
        toast.error("Please select a video file");
        setBtnLoading(false);
        return;
      }

      // Convert video file to base64 for storage
      const reader = new FileReader();
      reader.readAsDataURL(video);
      
      reader.onloadend = async () => {
        const base64Video = reader.result;
        
        const lectureData = {
          title,
          description,
          video: base64Video
        };

        try {
          await addLecture(id, lectureData);
          toast.success("Lecture added successfully");
          
          // Reset form
      setShow(false);
      setTitle("");
      setDescription("");
          setVideo(null);
      setVideoPrev("");
          
          // Refresh course data
          fetchCourse(id);
        } catch (error) {
          console.error("Error adding lecture:", error);
          toast.error("Failed to add lecture");
        } finally {
          setBtnLoading(false);
        }
      };
    } catch (error) {
      console.error("Error processing video:", error);
      toast.error("Failed to process video");
      setBtnLoading(false);
    }
  };

  // Admin functions for managing content
  const handleSaveNotes = async () => {
    if (!lecture || !isAdmin) return;
    
    try {
      await updateLectureContent(id, lecture._id, "notes", notes);
      setShowNotesForm(false);
      setEditingNotes(false);
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  };

  const handleSaveResources = async () => {
    if (!lecture || !isAdmin) return;
    
    try {
      await updateLectureContent(id, lecture._id, "resources", resources);
      setShowResourcesForm(false);
      setEditingResources(false);
    } catch (error) {
      console.error("Error saving resources:", error);
    }
  };

  // Add this function to handle adding a new question
  const handleAddQuestion = () => {
    if (!isAdmin) return;
    
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt)) {
      toast.error("Please fill in all question fields");
      return;
    }
    
    setQuestions([...questions, { ...currentQuestion }]);
    setCurrentQuestion({
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    });
    toast.success("Question added successfully");
  };

  // Add this function to handle removing a question
  const handleRemoveQuestion = (index) => {
    if (!isAdmin) return;
    
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    toast.success("Question removed successfully");
  };

  // Update the handleSaveQuiz function
  const handleSaveQuiz = async () => {
    if (!isAdmin) return;
    
    try {
      if (!lecture) {
        toast.error("No lecture selected");
        return;
      }

      // Validate quiz data
      if (!quizTitle.trim()) {
        toast.error("Please enter a quiz title");
        return;
      }

      if (!questions.length) {
        toast.error("Please add at least one question");
        return;
      }

      // Validate each question
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        if (!q.question.trim()) {
          toast.error(`Please enter a question for question ${i + 1}`);
          return;
        }
        if (!q.options.length || q.options.length < 2) {
          toast.error(`Please add at least 2 options for question ${i + 1}`);
          return;
        }
        if (q.correctAnswer === undefined || q.correctAnswer === null) {
          toast.error(`Please select a correct answer for question ${i + 1}`);
          return;
        }
      }

      // Create quiz object
      const quizData = {
        title: quizTitle.trim(),
        questions: questions.map(q => ({
          question: q.question.trim(),
          options: q.options.map(opt => opt.trim()),
          correctAnswer: q.correctAnswer
        }))
      };

      // Update lecture with new quiz data
      const updatedLecture = {
        ...lecture,
        quiz: quizData
      };

      // Update lectures array
      const updatedLectures = lectures.map(l => 
        l._id === lecture._id ? updatedLecture : l
      );

      // Update in context
      await updateLectureContent(id, lecture._id, "quiz", quizData);

      // Update local state
      setLecture(updatedLecture);
      setLectures(updatedLectures);
      setShowQuizForm(false);
      setEditingQuiz(false);
      toast.success("Quiz saved successfully");
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz");
    }
  };

  // Update the handleDeleteQuiz function
  const handleDeleteQuiz = async () => {
    if (!lecture || !isAdmin) return;
    
    try {
      // Update the lecture in the local state first
      const updatedLecture = {
        ...lecture,
        quiz: null
      };
      
      // Update the lectures array with the updated lecture
      const updatedLectures = lectures.map(l => 
        l._id === lecture._id ? updatedLecture : l
      );
      
      // Update the local state
      setLectures(updatedLectures);
      setLecture(updatedLecture);
      
      // Then update in the context
      await updateLectureContent(id, lecture._id, "quiz", null);
      
      setQuizTitle("");
      setQuestions([]);
      toast.success("Quiz deleted successfully");
      setShowQuizForm(false);
      setEditingQuiz(false);
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  const handleLectureClick = (selectedLecture) => {
    console.log("Selected lecture:", selectedLecture);
    setLecture(selectedLecture);
    setActiveTab("video");
    
    // Reset form states - only for admin users
    if (isAdmin) {
      setShowNotesForm(false);
      setShowResourcesForm(false);
      setShowQuizForm(false);
      setEditingNotes(false);
      setEditingResources(false);
      setEditingQuiz(false);
    }
    
    // Reset quiz taking state
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    
    // Set notes, resources, and quiz states
    setNotes(selectedLecture.notes || "");
    setResources(selectedLecture.resources || "");
    
    // Handle quiz data
    if (selectedLecture.quiz) {
      if (typeof selectedLecture.quiz === 'string') {
        // Old format - just set the quiz text
        setQuizTitle("Quiz");
        setQuestions([]);
      } else {
        // New format - set title and questions
        setQuizTitle(selectedLecture.quiz.title || "");
        setQuestions(selectedLecture.quiz.questions || []);
        
        // Log quiz data for debugging
        console.log("Quiz data loaded:", {
          title: selectedLecture.quiz.title,
          questionsCount: selectedLecture.quiz.questions ? selectedLecture.quiz.questions.length : 0
        });
      }
    } else {
      // No quiz data
      setQuizTitle("");
      setQuestions([]);
    }
    
    // Load video for the selected lecture
    loadVideoForLecture(selectedLecture._id);
  };

  // Load video for the selected lecture
  const loadVideoForLecture = async (selectedLecture) => {
    if (!selectedLecture) return;
    
    try {
      const videoData = await getVideoData(selectedLecture);
      if (videoData) {
        setVideoUrl(videoData);
      } else {
        setVideoUrl("");
        toast.error("Video not found");
      }
    } catch (error) {
      console.error("Error loading video:", error);
      toast.error("Failed to load video");
      setVideoUrl("");
    }
  };

  // Add this function to check if a quiz exists
  const hasQuiz = (lecture) => {
    if (!lecture) return false;
    
    // Check if quiz exists and is not null
    if (!lecture.quiz) return false;
    
    // If quiz is a string, it's the old format
    if (typeof lecture.quiz === 'string') return true;
    
    // If quiz is an object, check if it has questions
    if (lecture.quiz.questions && lecture.quiz.questions.length > 0) return true;
    
    // If quiz is an object but doesn't have questions, still return true
    // This allows for displaying the quiz title even if there are no questions
    if (lecture.quiz.title) return true;
    
    return false;
  };

  // Add this function to handle quiz submission
  const handleQuizSubmit = () => {
    if (!lecture || !lecture.quiz) {
      toast.error("No quiz available to submit");
      return;
    }
    
    // Handle string format quiz (old format)
    if (typeof lecture.quiz === 'string') {
      toast.error("This quiz format doesn't support submission");
      return;
    }
    
    // Check if quiz has questions
    if (!lecture.quiz.questions || lecture.quiz.questions.length === 0) {
      toast.error("This quiz doesn't have any questions");
      return;
    }
    
    // Check if all questions are answered
    const unansweredQuestions = lecture.quiz.questions.filter((_, index) => 
      userAnswers[index] === undefined || userAnswers[index] === null
    );
    
    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions before submitting`);
      return;
    }
    
    // Calculate score
    let score = 0;
    lecture.quiz.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        score++;
      }
    });
    
    const totalQuestions = lecture.quiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    
    setQuizScore(percentage);
    setQuizSubmitted(true);
    
    toast.success(`Quiz submitted! Your score: ${percentage}%`);
  };

  // Add this function to reset the quiz
  const resetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleDeleteLecture = async (lectureId) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        await deleteLecture(id, lectureId);
        // Refresh the course data
        await fetchCourse(id);
        // If the deleted lecture was the current one, clear it
        if (lecture && lecture._id === lectureId) {
          setLecture(null);
        }
      } catch (error) {
        console.error("Error deleting lecture:", error);
        toast.error("Failed to delete lecture");
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
        <div className="lecture-page">
      <div className="lecture-sidebar">
        <h2>Course Content</h2>
        <div className="lecture-list">
          {lectures.map((lec) => (
            <div
              key={lec._id}
              className={`lecture-item ${lecture?._id === lec._id ? "active" : ""}`}
            >
              <div onClick={() => handleLectureClick(lec)}>
                <h3>{lec.title}</h3>
                <p>{lec.description}</p>
              </div>
              {isAdmin && (
                <button
                  className="delete-lecture-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteLecture(lec._id);
                  }}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
          </div>

        {isAdmin && (
          <button className="add-lecture-btn" onClick={() => setShow(!show)}>
            {show ? "Cancel" : "Add Lecture"}
              </button>
            )}

        {show && isAdmin && (
              <div className="lecture-form">
            <h2>Add New Lecture</h2>
                <form onSubmit={submitHandler}>
              <div className="form-group">
                <label>Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
              </div>

              <div className="form-group">
                <label>Video (max 50MB)</label>
                  <input
                    type="file"
                  accept="video/*"
                    onChange={changeVideoHandler}
                    required
                  />
                <small>Please use a video file smaller than 50MB</small>
                <small className="warning">Note: Videos are stored in your browser and will persist after refresh</small>
              </div>

                  {videoPrev && (
                <div className="video-preview">
                    <video
                      src={videoPrev}
                      controls
                    className="preview-video"
                  />
                </div>
                  )}

                  <button
                type="submit"
                className="submit-btn"
                    disabled={btnLoading}
                  >
                {btnLoading ? "Adding..." : "Add Lecture"}
                  </button>
                </form>
          </div>
        )}
      </div>

      <div className="lecture-content">
        {lecture ? (
          <div className="lecture-container">
            <h2>{lecture.title}</h2>
            <p>{lecture.description}</p>
            
            {/* Tabs Navigation */}
            <div className="tabs">
              <button 
                className={`tab-btn ${activeTab === "video" ? "active" : ""}`}
                onClick={() => setActiveTab("video")}
              >
                Video
              </button>
              <button 
                className={`tab-btn ${activeTab === "notes" ? "active" : ""}`}
                onClick={() => setActiveTab("notes")}
              >
                Notes
              </button>
              <button 
                className={`tab-btn ${activeTab === "resources" ? "active" : ""}`}
                onClick={() => setActiveTab("resources")}
              >
                Resources
              </button>
              <button 
                className={`tab-btn ${activeTab === "quiz" ? "active" : ""}`}
                onClick={() => setActiveTab("quiz")}
              >
                Quiz
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="tab-content">
              {/* Video Tab */}
              {activeTab === "video" && (
                <div className="video-container">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      className="lecture-video"
                      autoPlay
                    />
                  ) : (
                    <p>No video available for this lecture.</p>
                  )}
                </div>
              )}
              
              {/* Notes Tab */}
              {activeTab === "notes" && (
                <div className="notes-container">
                  <div className="content-header">
                    <h3>Lecture Notes</h3>
                    {isAdmin && (
                      <div className="admin-actions">
                        {lecture.notes ? (
                          <>
                            <button 
                              className="edit-btn"
                              onClick={() => {
                                setEditingNotes(true);
                                setShowNotesForm(true);
                              }}
                            >
                              Edit Notes
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => {
                                setNotes("");
                                toast.success("Notes deleted successfully");
                                setShowNotesForm(false);
                                setEditingNotes(false);
                              }}
                            >
                              Delete Notes
                            </button>
                          </>
                        ) : (
                          <button 
                            className="add-btn"
                            onClick={() => setShowNotesForm(true)}
                          >
                            Add Notes
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {showNotesForm && isAdmin ? (
                    <div className="content-form">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter lecture notes..."
                        rows="10"
                      />
                      <div className="form-actions">
                        <button 
                          className="save-btn"
                          onClick={handleSaveNotes}
                        >
                          Save Notes
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={() => {
                            setShowNotesForm(false);
                            setEditingNotes(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="content-display">
                      {lecture.notes ? (
                        <div className="notes-content">
                          {lecture.notes}
                        </div>
                      ) : (
                        <p>No notes available for this lecture.</p>
                      )}
                    </div>
                  )}
              </div>
            )}

              {/* Resources Tab */}
              {activeTab === "resources" && (
                <div className="resources-container">
                  <div className="content-header">
                    <h3>Additional Resources</h3>
                    {isAdmin && (
                      <div className="admin-actions">
                        {lecture.resources ? (
                          <>
                            <button 
                              className="edit-btn"
                              onClick={() => {
                                setEditingResources(true);
                                setShowResourcesForm(true);
                              }}
                            >
                              Edit Resources
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={() => {
                                setResources("");
                                toast.success("Resources deleted successfully");
                                setShowResourcesForm(false);
                                setEditingResources(false);
                              }}
                            >
                              Delete Resources
                            </button>
                          </>
                        ) : (
                          <button 
                            className="add-btn"
                            onClick={() => setShowResourcesForm(true)}
                          >
                            Add Resources
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {showResourcesForm && isAdmin ? (
                    <div className="content-form">
                      <textarea
                        value={resources}
                        onChange={(e) => setResources(e.target.value)}
                        placeholder="Enter additional resources..."
                        rows="10"
                      />
                      <div className="form-actions">
                        <button 
                          className="save-btn"
                          onClick={handleSaveResources}
                        >
                          Save Resources
                        </button>
                    <button
                          className="cancel-btn"
                          onClick={() => {
                            setShowResourcesForm(false);
                            setEditingResources(false);
                          }}
                        >
                          Cancel
                    </button>
                      </div>
                    </div>
                  ) : (
                    <div className="content-display">
                      {lecture.resources ? (
                        <div className="resources-content">
                          {lecture.resources}
                        </div>
                      ) : (
                        <p>No additional resources available for this lecture.</p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Quiz Tab */}
              {activeTab === "quiz" && (
                <div className="quiz-container">
                  <div className="content-header">
                    <h3>Quiz</h3>
                    {isAdmin && (
                      <div className="admin-actions">
                        {hasQuiz(lecture) ? (
                          <>
                            <button 
                              className="edit-btn"
                              onClick={() => {
                                setEditingQuiz(true);
                                setShowQuizForm(true);
                              }}
                            >
                              Edit Quiz
                            </button>
                            <button 
                              className="delete-btn"
                              onClick={handleDeleteQuiz}
                            >
                              Delete Quiz
                            </button>
                          </>
                        ) : (
                          <button 
                            className="add-btn"
                            onClick={() => setShowQuizForm(true)}
                          >
                            Add Quiz
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {showQuizForm && isAdmin ? (
                    <div className="quiz-form">
                      <h3>{editingQuiz ? "Edit Quiz" : "Add Quiz"}</h3>
                      <div className="form-group">
                        <label htmlFor="quizTitle">Quiz Title</label>
                        <input
                          type="text"
                          id="quizTitle"
                          value={quizTitle}
                          onChange={(e) => setQuizTitle(e.target.value)}
                          placeholder="Enter quiz title"
                        />
                      </div>
                      
                      <div className="questions-section">
                        <h4>Questions</h4>
                        {questions.map((question, qIndex) => (
                          <div key={qIndex} className="question-form">
                            <div className="form-group">
                              <label>Question {qIndex + 1}</label>
                              <input
                                type="text"
                                value={question.question}
                                onChange={(e) => {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[qIndex].question = e.target.value;
                                  setQuestions(updatedQuestions);
                                }}
                                placeholder="Enter question"
                              />
                            </div>
                            
                            <div className="options-section">
                              <label>Options</label>
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="option-form">
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => {
                                      const updatedQuestions = [...questions];
                                      updatedQuestions[qIndex].options[oIndex] = e.target.value;
                                      setQuestions(updatedQuestions);
                                    }}
                                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                  />
                                  <input
                                    type="radio"
                                    name={`correct-${qIndex}`}
                                    checked={question.correctAnswer === oIndex}
                                    onChange={() => {
                                      const updatedQuestions = [...questions];
                                      updatedQuestions[qIndex].correctAnswer = oIndex;
                                      setQuestions(updatedQuestions);
                                    }}
                                  />
                                  <label>Correct</label>
                                </div>
                              ))}
                              <button
                                className="add-option-btn"
                                onClick={() => {
                                  const updatedQuestions = [...questions];
                                  updatedQuestions[qIndex].options.push("");
                                  setQuestions(updatedQuestions);
                                }}
                              >
                                Add Option
                              </button>
                            </div>
                            
                            <button
                              className="remove-question-btn"
                              onClick={() => {
                                const updatedQuestions = questions.filter((_, i) => i !== qIndex);
                                setQuestions(updatedQuestions);
                              }}
                            >
                              Remove Question
                            </button>
                          </div>
                        ))}
                        
                        <button
                          className="add-question-btn"
                          onClick={() => {
                            setQuestions([
                              ...questions,
                              {
                                question: "",
                                options: ["", ""],
                                correctAnswer: null
                              }
                            ]);
                          }}
                        >
                          Add Question
                        </button>
                      </div>
                      
                      <div className="form-actions">
                        <button
                          className="cancel-btn"
                          onClick={() => {
                            setShowQuizForm(false);
                            setEditingQuiz(false);
                            // Reset form if not editing
                            if (!editingQuiz) {
                              setQuizTitle("");
                              setQuestions([]);
                            }
                          }}
                        >
                          Cancel
                        </button>
                        <button
                          className="save-btn"
                          onClick={handleSaveQuiz}
                        >
                          Save Quiz
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="content-display">
                      {hasQuiz(lecture) ? (
                        <div className="quiz-content">
                          <h3>{typeof lecture.quiz === 'string' ? "Quiz" : (lecture.quiz.title || "Quiz")}</h3>
                          
                          {quizSubmitted ? (
                            <div className="quiz-results">
                              <h4>Quiz Results</h4>
                              <div className="score-display">
                                <p>Your Score: <span className="score-value">{quizScore}%</span></p>
                              </div>
                              <button 
                                className="retry-btn"
                                onClick={resetQuiz}
                              >
                                Try Again
                              </button>
                              
                              <div className="questions-list">
                                {lecture.quiz.questions && lecture.quiz.questions.map((q, index) => (
                                  <div key={index} className="question-item">
                                    <h4>Question {index + 1}</h4>
                                    <p className="question-text">{q.question}</p>
                                    <div className="options-list">
                                      {q.options && q.options.map((option, optIndex) => (
                                        <div 
                                          key={optIndex} 
                                          className={`option ${
                                            q.correctAnswer === optIndex 
                                              ? 'correct' 
                                              : userAnswers[index] === optIndex 
                                                ? 'incorrect' 
                                                : ''
                                          }`}
                                        >
                                          {String.fromCharCode(65 + optIndex)}. {option}
                                          {q.correctAnswer === optIndex && <span className="correct-badge">✓</span>}
                                          {userAnswers[index] === optIndex && q.correctAnswer !== optIndex && 
                                            <span className="incorrect-badge">✗</span>
                                          }
                                        </div>
                                      ))}
                                    </div>
                                    <div className="answer-feedback">
                                      {userAnswers[index] === q.correctAnswer ? (
                                        <p className="correct-feedback">Correct!</p>
                                      ) : (
                                        <p className="incorrect-feedback">
                                          Incorrect. The correct answer is option {String.fromCharCode(65 + q.correctAnswer)}.
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : typeof lecture.quiz === 'string' ? (
                            <div className="quiz-text">
                              {lecture.quiz}
                            </div>
                          ) : lecture.quiz && lecture.quiz.questions && lecture.quiz.questions.length > 0 ? (
                            <div className="quiz-taking">
                              <div className="questions-list">
                                {lecture.quiz.questions.map((q, index) => (
                                  <div key={index} className="question-item">
                                    <h4>Question {index + 1}</h4>
                                    <p className="question-text">{q.question}</p>
                                    <div className="options-list">
                                      {q.options && q.options.map((option, optIndex) => (
                                        <div 
                                          key={optIndex} 
                                          className={`option ${userAnswers[index] === optIndex ? 'selected' : ''}`}
                                          onClick={() => {
                                            setUserAnswers({
                                              ...userAnswers,
                                              [index]: optIndex
                                            });
                                          }}
                                        >
                                          {String.fromCharCode(65 + optIndex)}. {option}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="quiz-actions">
                                <button 
                                  className="submit-btn"
                                  onClick={handleQuizSubmit}
                                >
                                  Submit Quiz
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p>No questions in this quiz.</p>
                          )}
                        </div>
                      ) : (
                        <p>No quiz available for this lecture.</p>
                      )}
                    </div>
                  )}
                </div>
            )}
          </div>
        </div>
        ) : (
          <div className="no-lecture">
            <h2>Select a lecture to begin learning</h2>
          </div>
      )}
      </div>
    </div>
  );
};

export default Lecture;
