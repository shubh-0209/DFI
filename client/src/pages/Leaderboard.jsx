import SimpleLoader from '../components/common/SimpleLoader';
import React, { useState, useEffect } from 'react';
;
import { getTopVolunteers, getMyRank } from '../services/gamificationService';


const Leaderboard = () => {
  const [topVolunteers, setTopVolunteers] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const ensureArray = (value) => (Array.isArray(value) ? value : []);
    const logMalformed = async (payload) => {
      try {
        // Attempt remote logging; fallback to console if endpoint unavailable
        await import('../services/loggingService').then(m => m.default.logMalformedResponse(payload));
      } catch (e) {
        console.warn('Logging service unavailable:', e);
      }
    };
    const fetchLeaderboard = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const [topRes, myRes] = await Promise.all([
          getTopVolunteers(),
          getMyRank(),
        ]);
        if (topRes?.success) {
          if (!Array.isArray(topRes.data)) {
            // Log malformed payload
            logMalformed(topRes.data);
            setTopVolunteers([]);
          } else {
            setTopVolunteers(topRes.data);
          }
        } else {
          setTopVolunteers([]);
        }
        if (myRes?.success && myRes.data) {
          setMyRank(myRes.data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setErrorMsg("We're unable to load the data right now. Please try again in a few moments.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
    // expose retry for button
    window.__leaderboardRetry = fetchLeaderboard;
  }, []);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return { color: '#FBBF24', badge: '🥇' };
      case 1: return { color: '#CBD5E1', badge: '🥈' };
      case 2: return { color: '#B45309', badge: '🥉' };
      default: return { color: 'transparent', badge: (index + 1).toString() };
    }
  };

  if (loading) return <div className="page-container" style={{ padding: '2rem' }}><SimpleLoader /></div>;

  return (
    <div className="page-container" style={{ padding: '1.5rem 2rem' }}>
      <div style={{
        background: '#FEFCE8',
        border: '1px solid #FEF08A',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <div style={{ color: '#FBBF24', marginBottom: '0.5rem' }}>🏆</div>
        <h2 style={{ color: '#713F12', marginBottom: '0.5rem' }}>Volunteer Leaderboard</h2>
        <p style={{ color: '#713F12', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          Celebrate our community leaders who are dedicating their time and effort to bring social impact across India.
        </p>
      </div>

      {errorMsg ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-error)' }}>
          <p>{errorMsg}</p>
          <button className="btn btn-primary" onClick={() => window.__leaderboardRetry && window.__leaderboardRetry()}>Retry</button>
        </div>
      ) : (
        <>
          <div className="card">
            <h4 style={{ marginBottom: '1.25rem' }}>Top Contributors</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Array.isArray(topVolunteers) && topVolunteers.length > 0 ? (
                topVolunteers.map((vol, index) => {
                  const rankStyle = getRankStyle(index);
                  return (
                    <div
                      key={vol._id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '1rem',
                        border: '1px solid var(--color-border)',
                        borderRadius: 'var(--radius-md)',
                        backgroundColor: index <= 2 ? 'rgba(254, 252, 232, 0.5)' : 'var(--color-card)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: rankStyle.color !== 'transparent' ? rankStyle.color : 'var(--color-border)',
                            color: index <= 2 ? '#ffffff' : 'var(--color-body)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center' }}
                        >
                          {rankStyle.badge}
                        </div>
                        <div>
                          <h4 style={{ margin: 0 }}>{vol.name}</h4>
                          <span className="badge badge-blue" style={{ marginTop: '0.2rem' }}>{vol.volunteerLevel}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: 'var(--color-primary)' }}>{vol.points}</strong>
                        <div style={{ color: 'var(--color-body)' }}>points</div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-muted)' }}>No volunteers data available.</div>
              )}
            </div>
          </div>

          {myRank && (
            <div className="card" style={{ marginTop: '1.5rem', backgroundColor: 'var(--color-primary)', color: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'white' }}>Your Current Rank</h4>
                  <p style={{ margin: 0, opacity: 0.9 }}>Keep volunteering to climb the leaderboard!</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div >{myRank.points} pts</div>
                  <div style={{ opacity: 0.9 }}>{myRank.volunteerLevel}</div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;
