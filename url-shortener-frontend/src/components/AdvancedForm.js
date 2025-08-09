import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function AdvancedForm({ onUrlCreated }) {
  const [formData, setFormData] = useState({
    longUrl: '',
    customAlias: '',
    expiresIn: '',
    tags: '',
    password: '',
    createdBy: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Ensure URL has protocol
      let longUrl = formData.longUrl.trim();
      if (longUrl && !longUrl.match(/^https?:\/\//)) {
        longUrl = 'https://' + longUrl;
      }

      const payload = {
        ...formData,
        longUrl,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
      };

      console.log('Sending payload:', payload); // Debug log
      const response = await axios.post(`${API_BASE_URL}/api/shorten`, payload);
      onUrlCreated(response.data);
      
      // Reset form
      setFormData({
        longUrl: '',
        customAlias: '',
        expiresIn: '',
        tags: '',
        password: '',
        createdBy: ''
      });
    } catch (err) {
      console.error('Full error:', err.response?.data); // Debug log
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div className="input-group mb-3">
        <input
          type="url"
          className="form-control"
          name="longUrl"
          value={formData.longUrl}
          onChange={handleChange}
          placeholder="Enter a long URL here"
          required
          disabled={loading}
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Shorten URL'}
        </button>
      </div>

      <div className="text-center mb-3">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>
      </div>

      {showAdvanced && (
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Custom Alias (Optional)</label>
            <input
              type="text"
              className="form-control"
              name="customAlias"
              value={formData.customAlias}
              onChange={handleChange}
              placeholder="my-custom-link"
              pattern="[a-zA-Z0-9\-_]+"
              title="Only letters, numbers, hyphens, and underscores allowed"
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Expires In</label>
            <select
              className="form-select"
              name="expiresIn"
              value={formData.expiresIn}
              onChange={handleChange}
            >
              <option value="">Never</option>
              <option value="1h">1 Hour</option>
              <option value="1d">1 Day</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="marketing, social, campaign"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Password Protection (Optional)</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <div className="col-12">
            <label className="form-label">Created By</label>
            <input
              type="text"
              className="form-control"
              name="createdBy"
              value={formData.createdBy}
              onChange={handleChange}
              placeholder="Your name or identifier"
            />
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}
    </form>
  );
}

export default AdvancedForm;