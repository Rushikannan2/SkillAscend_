import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../Utils/Layout";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaGripVertical } from "react-icons/fa";
import "./dashboard.css";

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState("main");
  const [scheduleData, setScheduleData] = useState([]);
  const [brainstormData, setBrainstormData] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    startTime: "",
    endTime: "",
    description: "",
    priority: "medium"
  });
  const [newNote, setNewNote] = useState({ content: "", color: "#fff9c4" });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (user && user.role !== "admin") navigate("/");
    const savedSchedule = JSON.parse(localStorage.getItem("adminSchedule")) || [];
    const savedBrainstorm = JSON.parse(localStorage.getItem("adminBrainstorm")) || [];
    setScheduleData(savedSchedule);
    setBrainstormData(savedBrainstorm);
  }, [user, navigate]);

  // Schedule Planner Functions
  const handleAddEvent = (e) => {
    e.preventDefault();
    const eventWithId = {
      ...newEvent,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedSchedule = [...scheduleData, eventWithId];
    setScheduleData(updatedSchedule);
    localStorage.setItem("adminSchedule", JSON.stringify(updatedSchedule));
    setNewEvent({
      title: "",
      startTime: "",
      endTime: "",
      description: "",
      priority: "medium"
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      startTime: event.startTime,
      endTime: event.endTime,
      description: event.description,
      priority: event.priority
    });
  };

  const handleUpdateEvent = (e) => {
    e.preventDefault();
    const updatedEvent = {
      ...editingEvent,
      ...newEvent,
      updatedAt: new Date().toISOString()
    };
    const updatedSchedule = scheduleData.map(event =>
      event.id === editingEvent.id ? updatedEvent : event
    );
    setScheduleData(updatedSchedule);
    localStorage.setItem("adminSchedule", JSON.stringify(updatedSchedule));
    setEditingEvent(null);
    setNewEvent({
      title: "",
      startTime: "",
      endTime: "",
      description: "",
      priority: "medium"
    });
  };

  const handleDeleteEvent = (id) => {
    const updatedSchedule = scheduleData.filter(event => event.id !== id);
    setScheduleData(updatedSchedule);
    localStorage.setItem("adminSchedule", JSON.stringify(updatedSchedule));
  };

  // Brainstorming Board Functions
  const handleAddNote = (e) => {
    e.preventDefault();
    const noteWithId = {
      ...newNote,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updatedBrainstorm = [...brainstormData, noteWithId];
    setBrainstormData(updatedBrainstorm);
    localStorage.setItem("adminBrainstorm", JSON.stringify(updatedBrainstorm));
    setNewNote({ content: "", color: "#fff9c4" });
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNewNote({
      content: note.content,
      color: note.color
    });
  };

  const handleUpdateNote = (e) => {
    e.preventDefault();
    const updatedNote = {
      ...editingNote,
      ...newNote,
      updatedAt: new Date().toISOString()
    };
    const updatedBrainstorm = brainstormData.map(note =>
      note.id === editingNote.id ? updatedNote : note
    );
    setBrainstormData(updatedBrainstorm);
    localStorage.setItem("adminBrainstorm", JSON.stringify(updatedBrainstorm));
    setEditingNote(null);
    setNewNote({ content: "", color: "#fff9c4" });
  };

  const handleDeleteNote = (id) => {
    const updatedNotes = brainstormData.filter(note => note.id !== id);
    setBrainstormData(updatedNotes);
    localStorage.setItem("adminBrainstorm", JSON.stringify(updatedNotes));
  };

  const handleColorSelect = (color) => {
    setNewNote(prev => ({ ...prev, color }));
  };

  // Drag and Drop Functions
  const onDragStart = () => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    if (!result.destination) return;

    if (currentView === "schedule") {
      const items = Array.from(scheduleData);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setScheduleData(items);
      localStorage.setItem("adminSchedule", JSON.stringify(items));
    } else {
      const items = Array.from(brainstormData);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setBrainstormData(items);
      localStorage.setItem("adminBrainstorm", JSON.stringify(items));
    }
  };

  return (
    <Layout>
      <div className="admin-dashboard">
        {currentView === "main" && (
          <div className="main-view">
            <div className="dashboard-card" onClick={() => setCurrentView("schedule")}>
              <h2>📅 Schedule Planner</h2>
              <p>Manage your daily schedule and events</p>
            </div>
            <div className="dashboard-card" onClick={() => setCurrentView("brainstorm")}>
              <h2>💡 Brainstorming Board</h2>
              <p>Organize your ideas visually</p>
            </div>
          </div>
        )}

        {currentView === "schedule" && (
          <div className="schedule-view">
            <button className="back-button" onClick={() => setCurrentView("main")}>
              ← Back to Dashboard
            </button>
            <h2>Schedule Planner</h2>
            <form onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent} className="event-form">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                required
              />
              <input
                type="datetime-local"
                value={newEvent.startTime}
                onChange={(e) => setNewEvent({...newEvent, startTime: e.target.value})}
                required
              />
              <input
                type="datetime-local"
                value={newEvent.endTime}
                onChange={(e) => setNewEvent({...newEvent, endTime: e.target.value})}
              />
              <textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
              <select
                value={newEvent.priority}
                onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
              <button type="submit">{editingEvent ? "Update Event" : "Add Event"}</button>
              {editingEvent && (
                <button type="button" onClick={() => {
                  setEditingEvent(null);
                  setNewEvent({
                    title: "",
                    startTime: "",
                    endTime: "",
                    description: "",
                    priority: "medium"
                  });
                }}>
                  Cancel Edit
                </button>
              )}
            </form>

            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <Droppable droppableId="schedule">
                {(provided) => (
                  <div className="schedule-table" {...provided.droppableProps} ref={provided.innerRef}>
                    <table>
                      <thead>
                        <tr>
                          <th style={{ width: '50px' }}></th>
                          <th>#</th>
                          <th>Title</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Description</th>
                          <th>Priority</th>
                          <th>Created</th>
                          <th>Last Updated</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {scheduleData.map((event, index) => (
                          <Draggable key={event.id} draggableId={event.id.toString()} index={index}>
                            {(provided, snapshot) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`priority-${event.priority} ${snapshot.isDragging ? 'dragging' : ''}`}
                              >
                                <td {...provided.dragHandleProps} className="draggable-handle">
                                  <FaGripVertical />
                                </td>
                                <td>{index + 1}</td>
                                <td>{event.title}</td>
                                <td>{new Date(event.startTime).toLocaleString()}</td>
                                <td>{event.endTime ? new Date(event.endTime).toLocaleString() : '-'}</td>
                                <td>{event.description}</td>
                                <td>
                                  <span className={`priority-badge ${event.priority}`}>
                                    {event.priority}
                                  </span>
                                </td>
                                <td>{new Date(event.createdAt).toLocaleString()}</td>
                                <td>{new Date(event.updatedAt).toLocaleString()}</td>
                                <td className="action-buttons">
                                  <button onClick={() => handleEditEvent(event)}>Edit</button>
                                  <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    </table>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        {currentView === "brainstorm" && (
          <div className="brainstorm-view">
            <button className="back-button" onClick={() => setCurrentView("main")}>
              ← Back to Dashboard
            </button>
            <h2>Brainstorming Board</h2>
            <form onSubmit={editingNote ? handleUpdateNote : handleAddNote} className="note-form">
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                placeholder="Write your idea..."
                required
              />
              <div className="color-picker">
                {["#ffcccc", "#fff9c4", "#c4ffd4", "#c4e3ff", "#ffd4c4"].map(color => (
                  <div
                    key={color}
                    className={`color-option ${newNote.color === color ? "selected" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                  />
                ))}
              </div>
              <button type="submit">{editingNote ? "Update Note" : "Add Note"}</button>
              {editingNote && (
                <button type="button" onClick={() => {
                  setEditingNote(null);
                  setNewNote({ content: "", color: "#fff9c4" });
                }}>
                  Cancel Edit
                </button>
              )}
            </form>

            <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
              <Droppable droppableId="brainstorm" direction="horizontal">
                {(provided) => (
                  <div className="notes-grid" {...provided.droppableProps} ref={provided.innerRef}>
                    {brainstormData.map((note, index) => (
                      <Draggable key={note.id} draggableId={note.id.toString()} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`note-card ${snapshot.isDragging ? 'dragging' : ''}`}
                            style={{
                              backgroundColor: note.color,
                              ...provided.draggableProps.style
                            }}
                          >
                            <div className="draggable-handle" {...provided.dragHandleProps}>
                              <FaGripVertical />
                            </div>
                            <p>{note.content}</p>
                            <div className="note-meta">
                              <small>Created: {new Date(note.createdAt).toLocaleString()}</small>
                              <small>Updated: {new Date(note.updatedAt).toLocaleString()}</small>
                            </div>
                            <div className="note-actions">
                              <button onClick={() => handleEditNote(note)}>Edit</button>
                              <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;