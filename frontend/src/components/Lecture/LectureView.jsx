import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './LectureView.css';

// Components for each section
import VideoPlayer from './VideoPlayer';
import NotesSection from './NotesSection';
import ResourcesSection from './ResourcesSection';
import QuizSection from './QuizSection';

const LectureView = () => {
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('notes');
  const { lectureId } = useParams();
  const [isAdmin] = useState(localStorage.getItem('role') === 'admin' || localStorage.getItem('role') === 'superadmin');

  // Debug logging function
  const debugLog = (message, data) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Debug] ${message}:`, data);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchLecture = async () => {
      try {
        setLoading(true);
        setError(null);

        debugLog('Fetching lecture with ID', lectureId);
        
        // Add baseURL from environment variable or default
        const baseURL = process.env.REACT_APP_API_URL || '';
        const { data } = await axios.get(`${baseURL}/api/v1/lecture/${lectureId}`, {
          signal: controller.signal,
          timeout: 30000,
          withCredentials: true // Important for cookies/auth
        });
        
        if (!isMounted) return;

        debugLog('Received lecture data', data);

        if (!data || !data.lecture) {
          throw new Error('Invalid lecture data received');
        }

        // Safely extract and transform data
        const lectureData = {
          id: data.lecture.id || lectureId,
          title: data.lecture.title || 'Untitled Lecture',
          description: data.lecture.description || 'No description available',
          notes: Array.isArray(data.lecture.notes) ? data.lecture.notes.map(note => ({
            id: note.id || '',
            title: note.title || '',
            content: note.content || '',
            createdAt: note.createdAt || new Date().toISOString()
          })) : [],
          resources: Array.isArray(data.lecture.resources) ? data.lecture.resources.map(resource => ({
            id: resource.id || '',
            title: resource.title || '',
            url: resource.url || '',
            type: resource.type || 'unknown'
          })) : [],
          quizzes: Array.isArray(data.lecture.quizzes) ? data.lecture.quizzes.map(quiz => ({
            id: quiz.id || '',
            title: quiz.title || '',
            questions: Array.isArray(quiz.questions) ? quiz.questions : []
          })) : [],
          video: data.lecture.video && typeof data.lecture.video === 'object' 
            ? {
                url: data.lecture.video.url || '',
                duration: data.lecture.video.duration || 0,
                title: data.lecture.video.title || ''
              }
            : { url: '', duration: 0, title: '' }
        };
        
        debugLog('Transformed lecture data', lectureData);
        setLecture(lectureData);
      } catch (error) {
        if (!isMounted) return;
        
        console.error('Error fetching lecture:', error);
        debugLog('Error details', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });

        const errorMessage = error.response?.data?.message || error.message || 'Error fetching lecture';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (lectureId) {
      fetchLecture();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [lectureId]);

  // Early return for loading state
  if (loading) {
    return (
      <div className="lecture-loading">
        <div className="spinner"></div>
        <p>Loading lecture content...</p>
      </div>
    );
  }

  // Early return for error state
  if (error || !lecture) {
    return (
      <div className="lecture-error">
        <h2>Error Loading Lecture</h2>
        <p>{error || 'The requested lecture could not be loaded.'}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry Loading
        </button>
      </div>
    );
  }

  // Safely check for empty content
  const hasNotes = Array.isArray(lecture.notes) && lecture.notes.length > 0;
  const hasResources = Array.isArray(lecture.resources) && lecture.resources.length > 0;
  const hasQuizzes = Array.isArray(lecture.quizzes) && lecture.quizzes.length > 0;

  return (
    <div className="lecture-container">
      <div className="lecture-header">
        <h1>{lecture.title}</h1>
        <p className="lecture-description">{lecture.description}</p>
      </div>

      <div className="lecture-content">
        <div className="video-section">
          {lecture.video?.url ? (
            <VideoPlayer videoUrl={lecture.video.url} />
          ) : (
            <div className="no-video-message">
              <p>No video available for this lecture.</p>
            </div>
          )}
        </div>

        <div className="content-tabs">
          <div className="tab-buttons">
            <button 
              className={`tab-button ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes {hasNotes && `(${lecture.notes.length})`}
            </button>
            <button 
              className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`}
              onClick={() => setActiveTab('resources')}
            >
              Resources {hasResources && `(${lecture.resources.length})`}
            </button>
            <button 
              className={`tab-button ${activeTab === 'quiz' ? 'active' : ''}`}
              onClick={() => setActiveTab('quiz')}
            >
              Quiz {hasQuizzes && `(${lecture.quizzes.length})`}
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'notes' && (
              <NotesSection 
                notes={lecture.notes || []} 
                lectureId={lectureId}
                isAdmin={isAdmin}
              />
            )}
            {activeTab === 'resources' && (
              <ResourcesSection 
                resources={lecture.resources || []} 
                lectureId={lectureId}
                isAdmin={isAdmin}
              />
            )}
            {activeTab === 'quiz' && (
              <QuizSection 
                quizzes={lecture.quizzes || []} 
                lectureId={lectureId}
                isAdmin={isAdmin}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureView; 