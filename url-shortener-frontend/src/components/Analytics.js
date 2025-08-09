import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function Analytics({ shortCode }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (shortCode) {
      fetchAnalytics();
    }
  }, [shortCode]);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/analytics/${shortCode}`);
      setAnalytics(response.data);
    } catch (err) {
      setError('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center">Loading analytics...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!analytics) return null;

  const { url, analytics: data } = analytics;

  return (
    <div className="mt-4">
      <h4>Analytics for: {url.longUrl}</h4>
      
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary">{data.totalClicks}</h5>
              <p className="card-text">Total Clicks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-success">{data.uniqueClicks}</h5>
              <p className="card-text">Unique Visitors</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-info">{data.clicksToday}</h5>
              <p className="card-text">Today's Clicks</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning">{data.clicksThisWeek}</h5>
              <p className="card-text">This Week</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6>Top Referrers</h6>
            </div>
            <div className="card-body">
              {data.topReferrers.length > 0 ? (
                <ul className="list-group list-group-flush">
                  {data.topReferrers.map((ref, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between">
                      <span>{ref.referer}</span>
                      <span className="badge bg-primary">{ref.count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No referrer data available</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h6>Device Statistics</h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-6">
                  <h5 className="text-primary">{data.deviceStats.desktop}</h5>
                  <small>Desktop</small>
                </div>
                <div className="col-6">
                  <h5 className="text-success">{data.deviceStats.mobile}</h5>
                  <small>Mobile</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {data.clicksByDate.length > 0 && (
        <div className="card mt-3">
          <div className="card-header">
            <h6>Clicks Over Time</h6>
          </div>
          <div className="card-body">
            <div className="row">
              {data.clicksByDate.slice(-7).map((day, index) => (
                <div key={index} className="col text-center">
                  <div className="mb-2">
                    <div 
                      className="bg-primary" 
                      style={{
                        height: `${Math.max(day.count * 10, 5)}px`,
                        width: '20px',
                        margin: '0 auto'
                      }}
                    ></div>
                  </div>
                  <small>{new Date(day.date).toLocaleDateString()}</small>
                  <br />
                  <small className="text-muted">{day.count} clicks</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;