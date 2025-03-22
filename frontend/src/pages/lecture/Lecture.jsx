import React, { useEffect, useState } from "react";
import "./lecture.css";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { server } from "../../main";
import Loading from "../../components/loading/Loading";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";

const Lecture = ({ user }) => {
  const [lectures, setLectures] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");

  // Notes, Resources, and Quizzes
  const [notes, setNotes] = useState([]);
  const [resources, setResources] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [showResourcesForm, setShowResourcesForm] = useState(false);
  const [showQuizzesForm, setShowQuizzesForm] = useState(false);

  // Form states for additional content
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceFile, setResourceFile] = useState("");
  const [resourcePrev, setResourcePrev] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [quizAnswer, setQuizAnswer] = useState("");

  const params = useParams();
  const navigate = useNavigate();

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

  // Video Upload Handler
  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setVideo(file);
    };
  };

  const submitVideoHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    const myForm = new FormData();
    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("file", video);

    try {
      const { data } = await axios.post(
        `${server}/api/lectures/${params.id}`,
        myForm,
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setVideo("");
      setVideoPrev("");
    } catch (error) {
      toast.error(error.response.data.message);
      setBtnLoading(false);
    }
  };

  // Additional Content Submission Handlers
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

    try {
      const { data } = await axios.post(
        `${server}/api/resources/${params.id}`,
        myForm,
        { headers: { token: localStorage.getItem("token") } }
      );
      toast.success(data.message);
      fetchResources();
      setShowResourcesForm(false);
      setResourceTitle("");
      setResourceFile("");
      setResourcePrev("");
    } catch (error) {
      toast.error(error.response.data.message);
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

  // Fetch all required data
  useEffect(() => {
    fetchLectures();
    fetchNotes();
    fetchResources();
    fetchQuizzes();
  }, []);

  return (
    <div className="lecture-page">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="left">
            {/* Video Player */}
            {videoPrev && <video src={videoPrev} width={300} controls />}
          </div>

          <div className="right">
            <h3>Additional Content</h3>

            {/* Notes Section */}
            <div>
              <h4>Notes</h4>
              {notes.map((note) => (
                <p key={note._id}>{note.content}</p>
              ))}
            </div>

            {/* Resources Section */}
            <div>
              <h4>Resources</h4>
              {resources.map((resource) => (
                <p key={resource._id}>{resource.title}</p>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Lecture;
