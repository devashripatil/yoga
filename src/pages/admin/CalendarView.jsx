import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Setup timezone localizer according to react-big-calendar docs
const locales = {
  'en-US': enUS,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const [classes, setClasses] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get('/classes');
        setClasses(data);
        
        // Very basic mock algorithm to translate textual schedule ("Monday 8:00 AM") into JS Dates for this week
        // In reality, your backend should store proper Date objects or Recurrence rules (RRule)
        const parsedEvents = data.map(cls => {
          // This is a placeholder mock generation mapping textual arrays to today for visual demonstration
          return {
            title: `${cls.title} (${cls.difficulty})`,
            start: new Date(new Date().setHours(10, 0, 0, 0)), // Mock 10am
            end: new Date(new Date().setHours(11, 0, 0, 0)), // Mock 11am
            resource: cls
          }
        });
        
        setEvents(parsedEvents);
      } catch (error) {
        toast.error('Failed to load schedule for calendar');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSelectEvent = (event) => {
    toast.success(`Selected Class: ${event.title}. Editing via this model coming soon!`);
  };

  if (loading) return <div>Loading Calendar...</div>;

  return (
    <div style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#1e293b', flexShrink: 0 }}>Instructor Schedule</h1>
      <p style={{ color: '#64748b', marginBottom: '1.5rem', flexShrink: 0 }}>Note: Visual mockup translating textual schedule data to JS Calendar Events.</p>

      <Card style={{ flex: 1, padding: '1rem', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%', width: '100%' }}
          views={['month', 'week', 'work_week', 'day', 'agenda']}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => {
            return {
              style: {
                backgroundColor: '#10b981',
                borderRadius: '4px',
                opacity: 0.8,
                color: 'white',
                border: 'none',
                display: 'block'
              }
            };
          }}
        />
      </Card>
      
      {/* Scope fix for Big Calendar default CSS */}
      <style>{`
        .rbc-calendar { font-family: 'Inter', sans-serif; }
        .rbc-btn-group button { color: #475569; }
        .rbc-active { background-color: #f1f5f9 !important; color: #0f172a !important; font-weight: 600; box-shadow: none !important; }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active:hover { background-color: #e2e8f0 !important; }
        .rbc-today { background-color: #eff6ff; }
        .rbc-event { padding: 4px 8px; font-weight: 500; font-size: 0.875rem; }
      `}</style>
    </div>
  );
};

export default CalendarView;
