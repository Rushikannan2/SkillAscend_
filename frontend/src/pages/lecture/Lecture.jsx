import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";

const Lecture = ({ user }) => {
  // Existing state variables...
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
<<<<<<< HEAD
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setvideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);
=======
  
  // New state variables for notes, resources, and quizzes
  const [notes, setNotes] = useState([]);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [showResourcesForm, setShowResourcesForm] = useState(false);
  const [showQuizzesForm, setShowQuizzesForm] = useState(false);
  
  // Form states
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceFile, setResourceFile] = useState("");
  const [resourcePrev, setResourcePrev] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [quizAnswer, setQuizAnswer] = useState("");
>>>>>>> 76a25aa (Updated)

  // Existing code for lectures...
  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return navigate("/");

  // Fetch functions
  async function fetchNotes() {
    try {
      const { data } = await axios.get(`${server}/api/notes/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setNotes(data.notes);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchResources() {
    try {
      const { data } = await axios.get(`${server}/api/resources/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setResources(data.resources);
    } catch (error) {
      console.log(error);
    }
  }

<<<<<<< HEAD
  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setvideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);
=======
  async function fetchQuizzes() {
    try {
      const { data } = await axios.get(`${server}/api/quizzes/${params.id}`, {
        headers: { token: localStorage.getItem("token") },
      });
      setQuizzes(data.quizzes);
    } catch (error) {
      console.log(error);
    }
  }

  // CRUD Handlers
  const submitNoteHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/api/notes/${params.id}`,
        { title: noteTitle, content: noteContent },
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      fetchNotes();
      setShowNotesForm(false);
      setNoteTitle("");
      setNoteContent("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const submitResourceHandler = async (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.append("title", resourceTitle);
    myForm.append("file", resourceFile);
>>>>>>> 76a25aa (Updated)

    try {
      const { data } = await axios.post(
        `${server}/api/resources/${params.id}`,
        myForm,
<<<<<<< HEAD
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
=======
        { headers: { token: localStorage.getItem("token") } }
>>>>>>> 76a25aa (Updated)
      );
      toast.success(data.message);
<<<<<<< HEAD
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setvideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
=======
      fetchResources();
      setShowResourcesForm(false);
      setResourceTitle("");
      setResourceFile("");
      setResourcePrev("");
    } catch (error) {
      toast.error(error.response.data.message);
>>>>>>> 76a25aa (Updated)
    }
  };

  const submitQuizHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${server}/api/quizzes/${params.id}`,
        { question: quizQuestion, options: quizOptions, correctAnswer: quizAnswer },
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      fetchQuizzes();
      setShowQuizzesForm(false);
      setQuizQuestion("");
      setQuizOptions(["", "", "", ""]);
      setQuizAnswer("");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const deleteHandler = async (type, id) => {
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        const { data } = await axios.delete(`${server}/api/${type}/${id}`, {
          headers: { token: localStorage.getItem("token") },
        });
        toast.success(data.message);
        if (type === "notes") fetchNotes();
        if (type === "resources") fetchResources();
        if (type === "quizzes") fetchQuizzes();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };

  const changeResourceHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setResourcePrev(reader.result);
      setResourceFile(file);
    };
  };

  useEffect(() => {
    fetchLectures();
    fetchProgress();
    fetchNotes();
    fetchResources();
    fetchQuizzes();
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="lecture-page">
          {/* Existing lecture content */}
          <div className="left">
            {/* Existing video player code */}
          </div>
          
          <div className="right">
            {/* Existing lecture list */}
            
            {/* Additional Content Section */}
            <div className="additional-content">
              {/* Notes Section */}
              <div className="notes-section">
                <h3>Notes</h3>
                {user.role === "admin" && (
                  <button 
                    className="common-btn" 
                    onClick={() => setShowNotesForm(!showNotesForm)}
                  >
                    {showNotesForm ? "Close" : "Add Note +"}
                  </button>
                )}
                
                {showNotesForm && user.role === "admin" && (
                  <form onSubmit={submitNoteHandler}>
                    <input
                      type="text"
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Note Title"
                      required
                    />
                    <textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Note Content"
                      required
                    />
<<<<<<< HEAD

                    <input
                      type="file"
                      placeholder="choose video"
                      onChange={changeVideoHandler}
                      required
                    />

                    {videoPrev && (
                      <video
                        src={videoPrev}
                        alt=""
                        width={300}
                        controls
                      ></video>
                    )}

                    <button
                      disabled={btnLoading}
                      type="submit"
                      className="common-btn"
                    >
                      {btnLoading ? "Please Wait..." : "Add"}
                    </button>
=======
                    <button type="submit" className="common-btn">Add Note</button>
>>>>>>> 76a25aa (Updated)
                  </form>
                )}
                
                {notes.map((note) => (
                  <div key={note._id} className="note-item">
                    <h4>{note.title}</h4>
                    <p>{note.content}</p>
                    {user.role === "admin" && (
                      <button
                        className="common-btn"
                        style={{ background: "red" }}
                        onClick={() => deleteHandler("notes", note._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Resources Section */}
              <div className="resources-section">
                <h3>Resources</h3>
                {user.role === "admin" && (
                  <button 
                    className="common-btn" 
                    onClick={() => setShowResourcesForm(!showResourcesForm)}
                  >
                    {showResourcesForm ? "Close" : "Add Resource +"}
                  </button>
                )}
                
                {showResourcesForm && user.role === "admin" && (
                  <form onSubmit={submitResourceHandler}>
                    <input
                      type="text"
                      value={resourceTitle}
                      onChange={(e) => setResourceTitle(e.target.value)}
                      placeholder="Resource Title"
                      required
                    />
                    <input
                      type="file"
                      onChange={changeResourceHandler}
                      required
                    />
                    <button type="submit" className="common-btn">Add Resource</button>
                  </form>
                )}
                
                {resources.map((resource) => (
                  <div key={resource._id} className="resource-item">
                    <a href={`${server}/${resource.file}`} target="_blank">
                      {resource.title}
                    </a>
                    {user.role === "admin" && (
                      <button
                        className="common-btn"
                        style={{ background: "red" }}
                        onClick={() => deleteHandler("resources", resource._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Quizzes Section */}
              <div className="quizzes-section">
                <h3>Quizzes</h3>
                {user.role === "admin" && (
                  <button 
                    className="common-btn" 
                    onClick={() => setShowQuizzesForm(!showQuizzesForm)}
                  >
                    {showQuizzesForm ? "Close" : "Add Quiz +"}
                  </button>
                )}
                
                {showQuizzesForm && user.role === "admin" && (
                  <form onSubmit={submitQuizHandler}>
                    <input
                      type="text"
                      value={quizQuestion}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                      placeholder="Question"
                      required
                    />
                    {quizOptions.map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...quizOptions];
                          newOptions[index] = e.target.value;
                          setQuizOptions(newOptions);
                        }}
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    ))}
                    <input
                      type="text"
                      value={quizAnswer}
                      onChange={(e) => setQuizAnswer(e.target.value)}
                      placeholder="Correct Answer"
                      required
                    />
                    <button type="submit" className="common-btn">Add Quiz</button>
                  </form>
                )}
                
                {quizzes.map((quiz) => (
                  <div key={quiz._id} className="quiz-item">
                    <h4>{quiz.question}</h4>
                    <ul>
                      {quiz.options.map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ul>
                    {user.role === "admin" && (
                      <>
                        <p>Answer: {quiz.correctAnswer}</p>
                        <button
                          className="common-btn"
                          style={{ background: "red" }}
                          onClick={() => deleteHandler("quizzes", quiz._id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Lecture;