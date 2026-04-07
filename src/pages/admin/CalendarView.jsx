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
import { Users, Clock, MapPin, ChevronRight, Info, Calendar as LucideCalendar } from 'lucide-react';

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
  const [selectedDateClasses, setSelectedDateClasses] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await api.get('/classes');
        setClasses(data);
        
        // Transform classes into calendar events
        const parsedEvents = data.map((cls) => {
          // This uses the 'schedule' string which we'll assume is a Date string for this revamped version
          // If it's still textual "Monday 8:00 AM", we'd need a parser. 
          // For now, we'll try to parse it or fallback to today.
          const startDate = new Date(cls.schedule);
          const validDate = !isNaN(startDate.getTime()) ? startDate : new Date();
          
          const endDate = new Date(validDate);
          endDate.setMinutes(validDate.getMinutes() + (cls.duration || 60));

          return {
            id: cls._id,
            title: cls.title,
            start: validDate,
            end: endDate,
            resource: cls
          };
        });
        
        setEvents(parsedEvents);
      } catch (error) {
        toast.error('Failed to load schedule');
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const handleSelectSlot = ({ start }) => {
    const dateStr = start.toDateString();
    const classesOnDate = events.filter(e => e.start.toDateString() === dateStr).map(e => e.resource);
    setSelectedDateClasses(classesOnDate);
    setSelectedDate(start);
  };

  const handleSelectEvent = (event) => {
    setSelectedDateClasses([event.resource]);
    setSelectedDate(event.start);
  };

  // Function to determine day background color based on density
  const dayPropGetter = (date) => {
    const dateStr = date.toDateString();
    const count = events.filter(e => e.start.toDateString() === dateStr).length;
    
    if (count > 3) return { style: { backgroundColor: '#fee2e2' } }; // Very busy (Red-ish)
    if (count > 0) return { style: { backgroundColor: '#f0fdf4' } }; // Has classes (Green-ish)
    return {};
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Calendar...</div>;

  return (
    <div style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: '#1e293b', margin: 0 }}>Class Schedule Manager</h1>
          <p style={{ color: '#64748b', margin: '0.25rem 0 0 0' }}>Monitor session density and manage instructor availability.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
        <Card style={{ padding: '1rem', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            dayPropGetter={dayPropGetter}
            views={['month', 'week', 'day']}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: 'var(--primary)',
                borderRadius: '4px',
                border: 'none',
                fontSize: '0.8rem',
                padding: '2px 5px'
              }
            })}
          />
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
          <Card style={{ padding: '1.5rem', borderTop: '4px solid var(--primary)' }}>
            <h3 style={{ margin: '0 0 1.25rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LucideCalendar size={20} style={{ color: 'var(--primary)' }} />
              {selectedDate ? `Classes on ${selectedDate.toLocaleDateString()}` : 'Select a date or class'}
            </h3>

            {selectedDateClasses.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {selectedDateClasses.map((cls) => (
                  <div key={cls._id} style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{cls.title}</h4>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.5rem', borderRadius: '1rem', backgroundColor: '#e2e8f0', color: '#475569' }}>
                        {cls.difficulty}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                        <Clock size={14} /> <span>{new Date(cls.schedule).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({cls.duration} min)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                        <Users size={14} /> <span>Max Capacity: {cls.maxSlots}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                <Info size={40} style={{ marginBottom: '1rem', opacity: 0.3 }} />
                <p style={{ fontSize: '0.9rem', margin: 0 }}>No classes scheduled for this time.</p>
              </div>
            )}
          </Card>

          <Card style={{ padding: '1.5rem' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Density Legend</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }} />
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Scheduled Sessions (1-3)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '4px', backgroundColor: '#fee2e2', border: '1px solid #fecaca' }} />
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>High Density Days (4+)</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        .rbc-calendar { font-family: 'Inter', sans-serif; background: white; }
        .rbc-month-view, .rbc-time-view { border-radius: 8px; overflow: hidden; }
        .rbc-today { background-color: #f8fafc !important; }
        .rbc-active { background-color: var(--primary) !important; color: white !important; }
        .rbc-toolbar button { border-radius: 4px; font-size: 0.85rem; padding: 5px 10px; }
        .rbc-toolbar button:active, .rbc-toolbar button.rbc-active { box-shadow: none !important; background-color: #f1f5f9; }
        .rbc-event { transition: all 0.2s; }
        .rbc-event:hover { filter: brightness(0.9); }
      `}</style>
    </div>
  );
};

export default CalendarView;
