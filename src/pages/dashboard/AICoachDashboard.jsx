import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import AuthContext from '../../context/AuthContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Recommendations from '../../components/Recommendations';
import { Sparkles, Utensils, Activity, RotateCw, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

const AICoachDashboard = () => {
  const { user } = useContext(AuthContext);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchPlan = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/coach/plan');
      setPlan(data);
    } catch (error) {
      console.error("Failed to fetch coach plan:", error);
      toast.error("Failed to load your AI Wellness Plan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPlan();
    }
  }, [user]);

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await api.post('/coach/generate');
      setPlan(data);
      toast.success("New wellness plan generated successfully!");
    } catch (error) {
      console.error("Failed to generate plan:", error);
      toast.error("Failed to generate a new plan.");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh', gap: '1rem' }}>
        <RotateCw className="animate-spin" size={48} color="var(--primary)" />
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Fetching your personalized plan...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ animation: 'fadeIn 0.8s ease-out' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start', 
        flexWrap: 'wrap', 
        gap: '1.5rem',  
        marginBottom: '2.5rem',
        background: 'linear-gradient(to right, var(--white), transparent)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        borderLeft: '5px solid var(--primary)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}>
            <Sparkles size={32} color="var(--primary)" /> My AI Wellness Coach
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>
            Your personalized guide to <span style={{ color: 'var(--primary-dark)', fontWeight: 600 }}>{user?.wellnessGoal ? user.wellnessGoal.toLowerCase() : 'wellness'}</span>. 
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={16} /> {user?.timeAvailable || 30} min session</span>
             <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Utensils size={16} /> {user?.dietPreference || 'Balanced'} diet</span>
          </div>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleRegenerate} 
          disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', boxShadow: 'var(--shadow-md)' }}
        >
          {generating ? <RotateCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          {generating ? 'Crafting Plan...' : 'Refresh Plan'}
        </Button>
      </div>

      {plan?.weeklySummary && (
        <Card style={{ 
          backgroundColor: 'rgba(74, 124, 89, 0.03)', 
          border: '1px solid var(--primary-light)', 
          marginBottom: '3rem',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
             <Sparkles size={120} color="var(--primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Activity size={24} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Weekly Progress & Motivation</h3>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '1.05rem', position: 'relative', zIndex: 1 }}>{plan.weeklySummary}</p>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
        
        {/* Yoga Routine */}
        <Card style={{ 
          padding: '2.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          borderTop: '4px solid var(--primary)',
          transition: 'transform 0.3s ease'
        }} className="hover-lift">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
             <div style={{ backgroundColor: 'var(--primary)', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: 'var(--white)' }}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
             </div>
             <div>
               <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 700 }}>Today's Yoga Routine</h2>
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Custom sequence for your {user?.experienceLevel || 'Beginner'} level</p>
             </div>
          </div>
          
          <div className="markdown-content" style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, flexGrow: 1 }}>
            {plan?.yogaRoutine ? (
              <ReactMarkdown>{plan.yogaRoutine}</ReactMarkdown>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>No routine generated yet. Click 'Refresh Plan' to begin your journey.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Diet Plan */}
        <Card style={{ 
          padding: '2.5rem', 
          display: 'flex', 
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)',
          borderTop: '4px solid var(--secondary-dark)',
          transition: 'transform 0.3s ease'
        }} className="hover-lift">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
             <div style={{ backgroundColor: 'var(--secondary-dark)', padding: '0.6rem', borderRadius: 'var(--radius-md)', color: 'var(--white)' }}>
               <Utensils size={24} />
             </div>
             <div>
               <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-primary)', fontWeight: 700 }}>Mindful Diet Plan</h2>
               <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Nourishing your body with {user?.dietPreference || 'Balanced'} meals</p>
             </div>
          </div>
          
          <div className="markdown-content" style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, flexGrow: 1 }}>
            {plan?.dietPlan ? (
              <ReactMarkdown>{plan.dietPlan}</ReactMarkdown>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <p>Nutritional guidance will appear here once your plan is ready.</p>
              </div>
            )}
          </div>
        </Card>

      </div>

      <Recommendations />

      {/* Basic inline styles to handle Markdown standard elements gracefully inside the cards */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .hover-lift:hover {
          transform: translateY(-8px);
        }
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: var(--primary-dark);
          font-size: 1.15rem;
          font-weight: 600;
        }
        .markdown-content p {
          margin-bottom: 1.25rem;
        }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1.25rem;
        }
        .markdown-content li {
          margin-bottom: 0.75rem;
        }
        .markdown-content strong {
          color: var(--text-primary);
        }
        .markdown-content blockquote {
          border-left: 3px solid var(--primary-light);
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: var(--text-secondary);
        }
      `}} />

    </div>
  );
};

export default AICoachDashboard;
