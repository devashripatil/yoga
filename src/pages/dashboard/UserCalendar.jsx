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
import { Calendar as LucideCalendar, Clock, MapPin, CheckCircle, Info } from 'lucide-react';

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

const UserCalendar = () => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await api.get('/bookings/my');
        setBookings(data);
        
        // Transform bookings into calendar events
        // Note: For simplicity, we'll map textual schedule to today/tomorrow Mock dates
        // In a real app, this would use the booking's specific date field or RRule.
        const parsedEvents = data.filter(b => b.status === 'confirmed').map((booking, index) => {
          const classData = booking.classId || {};
          // Mocking date logic for demonstration
          const startDate = new Date();
          startDate.setHours(10 + index, 0, 0, 0); // 10am, 11am, etc.
          const endDate = new Date(startDate);
          endDate.setHours(startDate.getHours() + 1);

          return {
            id: booking._id,
            title: classData.title || 'Yoga Session',
            start: startDate,
            end: endDate,
            resource: booking
          };
        });
        
        setEvents(parsedEvents);
      } catch (error) {
        toast.error('Failed to load your personal calendar');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
  };

  if (loading) return <div>Loading your calendar...</div>;

  return (
    <div style={{ padding: '1rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', color: 'var(--text-primary)', margin: 0 }}>My Yoga Schedule</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0' }}>Track your upcoming booked sessions and wellness journey.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', flex: 1, minHeight: '600px' }}>
        <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%', minHeight: '500px' }}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor: 'var(--primary)',
                borderRadius: '6px',
                border: 'none',
                padding: '4px 8px',
                fontSize: '0.85rem'
              }
            })}
          />
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem', backgroundColor: 'var(--secondary)', border: '1px solid var(--primary-light)' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-dark)' }}>
                <LucideCalendar size={18} /> Session Details
            </h3>
            
            {selectedEvent ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                   <h4 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{selectedEvent.classId?.title}</h4>
                   <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedEvent.classId?.difficulty} Level</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <Clock size={16} style={{ color: 'var(--primary)' }} />
                        <span>{selectedEvent.classId?.schedule} ({selectedEvent.classId?.duration} min)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        <MapPin size={16} style={{ color: 'var(--primary)' }} />
                        <span>Sattva Yoga Studio / Online</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>
                        <CheckCircle size={16} />
                        <span>Booking Confirmed</span>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <p style={{ margin: 0 }}><Info size={14} style={{ verticalAlign: 'middle', marginRight: '0.25rem' }} /> Please arrive 5-10 minutes early to settle in and set up your mat.</p>
                </div>
              </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
                    <LucideCalendar size={48} style={{ color: 'var(--border)', marginBottom: '1rem', opacity: 0.5 }} />
                    <p style={{ fontSize: '0.9rem' }}>Select a class on the calendar to view its details.</p>
                </div>
            )}
          </Card>

          <Card style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>Calendar Legend</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Confirmed Session</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#64748b' }} />
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Class Description</span>
                  </div>
              </div>
          </Card>
        </div>
      </div>
      
      <style>{`
        .rbc-calendar { font-family: 'Inter', sans-serif; }
        .rbc-today { background-color: var(--secondary) !important; }
        .rbc-event { cursor: pointer; transition: transform 0.1s; }
        .rbc-event:hover { transform: scale(1.02); }
        .rbc-off-range-bg { background: #f8fafc; }
      `}</style>
    </div>
  );
};

export default UserCalendar;
