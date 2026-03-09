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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem',  marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={28} color="var(--primary)" /> My AI Wellness Coach
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Your personalized guide to {user?.wellnessGoal ? user.wellnessGoal.toLowerCase() : 'wellness'}. 
            Updated contextually to fit your {user?.timeAvailable || 30} min schedule on a {user?.dietPreference || 'Balanced'} diet.
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={handleRegenerate} 
          disabled={generating}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {generating ? <RotateCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
          {generating ? 'Generating...' : 'Refresh Plan'}
        </Button>
      </div>

      {plan?.weeklySummary && (
        <Card style={{ backgroundColor: 'rgba(74, 124, 89, 0.05)', border: '1px solid var(--primary-light)', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            <Activity size={20} />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Weekly Progress & Motivation</h3>
          </div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{plan.weeklySummary}</p>
        </Card>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* Yoga Routine */}
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
             <div style={{ backgroundColor: 'var(--primary-light)', padding: '0.5rem', borderRadius: '50%', color: 'var(--white)' }}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
             </div>
             <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-primary)' }}>Today's Yoga Routine</h2>
          </div>
          
          {/* Markdown Content Wrapper */}
          <div className="markdown-content" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1 }}>
            {plan?.yogaRoutine ? (
              <ReactMarkdown>{plan.yogaRoutine}</ReactMarkdown>
            ) : (
              <p>No routine generated yet. Click 'Refresh Plan' to generate.</p>
            )}
          </div>
        </Card>

        {/* Diet Plan */}
        <Card style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
             <div style={{ backgroundColor: 'var(--secondary)', padding: '0.5rem', borderRadius: '50%', color: 'var(--primary-dark)' }}>
               <Utensils size={20} />
             </div>
             <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--text-primary)' }}>Today's Diet Plan</h2>
          </div>
          
          <div className="markdown-content" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, flexGrow: 1 }}>
            {plan?.dietPlan ? (
              <ReactMarkdown>{plan.dietPlan}</ReactMarkdown>
            ) : (
              <p>No diet plan generated yet. Click 'Refresh Plan' to generate.</p>
            )}
          </div>
        </Card>

      </div>

      <Recommendations />

      {/* Basic inline styles to handle Markdown standard elements gracefully inside the cards */}
      <style dangerouslySetInnerHTML={{__html: `
        .markdown-content h1, .markdown-content h2, .markdown-content h3 {
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: var(--text-primary);
          font-size: 1.1rem;
        }
        .markdown-content p {
          margin-bottom: 1rem;
        }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content li {
          margin-bottom: 0.5rem;
        }
        .markdown-content strong {
          color: var(--text-primary);
        }
      `}} />

    </div>
  );
};

export default AICoachDashboard;
