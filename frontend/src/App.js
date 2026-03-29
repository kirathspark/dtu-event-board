import React, { useState, useEffect } from 'react';
import './App.css';

const heroImages = [
  'https://media.collegedekho.com/media/img/institute/crawled_images/dl1.jpg?width=640',
  'https://media.collegedekho.com/media/img/institute/crawled_images/None/SDGFGHGHGHFH.jpeg?width=640',
  'https://dtu.ac.in/modules/hrdc/images/Carousel2new.png',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQBpY-D5QFjMXzuLkRFso8Tvij6e6zkoFpkyQ&s',
];
 

const cardGradients = [
  'linear-gradient(135deg, #1a0030, #4a0080)',
  'linear-gradient(135deg, #001a4a, #0040a0)',
  'linear-gradient(135deg, #1a0020, #800040)',
  'linear-gradient(135deg, #001a1a, #004040)',
  'linear-gradient(135deg, #1a1a00, #404000)',
  'linear-gradient(135deg, #1a0010, #600030)',
];

function App() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [formLink, setFormLink] = useState('');
  const [search, setSearch] = useState('');
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  function fetchEvents() {
    fetch('https://dtu-event-board-backend.onrender.com/api/events')
      .then(res => res.json())
      .then(data => setEvents(data));
  }

  function handleAddClick() {
    setEditingEvent(null);
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setFormLink('');
    setShowForm(true);
  }

  function handleEditClick(event) {
    setEditingEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setDate(event.date);
    setTime(event.time);
    setLocation(event.location);
    setFormLink(event.formLink);
    setShowForm(true);
  }

  function handleSubmit() {
    const eventData = { title, description, date, time, location, formLink };
    if (editingEvent) {
      fetch('https://dtu-event-board-backend.onrender.com/api/events/' + editingEvent._id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      }).then(() => {
        fetchEvents();
        setShowForm(false);
      });
    } else {
      fetch('https://dtu-event-board-backend.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      }).then(() => {
        fetchEvents();
        setShowForm(false);
      });
    }
  }

  function deleteEvent(_id) {
    fetch('https://dtu-event-board-backend.onrender.com/api/events/' + _id, {
      method: 'DELETE'
    }).then(() => fetchEvents());
  }

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  if (showForm) {
    return (
      <div>
        <nav className="navbar">
          <span className="navbar-logo">DTU Event Board</span>
          <span className="navbar-tagline">Delhi Technological University</span>
        </nav>
        <div className="form-page">
          <div className="form-container">
            <h2>{editingEvent ? 'Edit Event' : 'Add New Event'}</h2>
            <p className="form-subtitle">{editingEvent ? 'Update the event details below' : 'Fill in the details to post a new event'}</p>

            <label className="form-label">Event Title *</label>
            <input className="form-input" placeholder="e.g. Tech Fest 2026" value={title} onChange={e => setTitle(e.target.value)} />

            <label className="form-label">Description *</label>
            <input className="form-input" placeholder="What is this event about?" value={description} onChange={e => setDescription(e.target.value)} />

            <label className="form-label">Date *</label>
            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} style={{ colorScheme: 'dark' }} />

            <label className="form-label">Time (optional)</label>
            <input className="form-input" placeholder="e.g. 10:00 AM" value={time} onChange={e => setTime(e.target.value)} />

            <label className="form-label">Location *</label>
            <input className="form-input" placeholder="e.g. DTU Auditorium" value={location} onChange={e => setLocation(e.target.value)} />

            <label className="form-label">Registration Link (optional)</label>
            <input className="form-input" placeholder="e.g. https://forms.google.com" value={formLink} onChange={e => setFormLink(e.target.value)} />

            <button className="submit-btn" onClick={handleSubmit}>
              {editingEvent ? 'Update Event' : 'Post Event'}
            </button>
            <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
        <footer className="footer">© 2026 DTU Event Board — Delhi Technological University</footer>
      </div>
    );
  }

  return (
    <div>
      <nav className="navbar">
        <span className="navbar-logo">DTU Event Board</span>
        <span className="navbar-tagline">Delhi Technological University</span>
      </nav>

      <div className="hero">
        <img
          className="hero-bg"
          src={heroImages[heroIndex]}
          alt="hero"
        />
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>DTU Event Board</h1>
          <p>Discover and share events happening at Delhi Technological University</p>
          <button className="hero-btn" onClick={handleAddClick}>+ Post an Event</button>
        </div>
      </div>

      <div className="search-container">
        <input
          className="search-input"
          placeholder="🔍  Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="events-section">
        <h2>Upcoming Events</h2>
        <div className="events-grid">
          {filteredEvents.length === 0 && (
            <p className="no-events">No events found. Be the first to post one!</p>
          )}
          {filteredEvents.map((event, index) => (
            <div key={event._id} className="event-card">
              <div
                className="event-card-gradient"
                style={{ background: cardGradients[index % cardGradients.length] }}
              ></div>
              <div className="event-card-body">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <p className="event-date">
                  📅 {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {event.time && `  •  🕐 ${event.time}`}
                </p>
                <p>📍 {event.location}</p>
                {event.formLink && (
                  <a href={event.formLink} className="register-link" target="_blank" rel="noreferrer">Register Here →</a>
                )}
                <div className="card-actions">
                  <button className="edit-btn" onClick={() => handleEditClick(event)}>Edit</button>
                  <button className="delete-btn" onClick={() => deleteEvent(event._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="footer">© 2026 DTU Event Board — Delhi Technological University</footer>
    </div>
  );
}

export default App;