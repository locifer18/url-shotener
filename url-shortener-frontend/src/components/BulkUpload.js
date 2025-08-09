import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function BulkUpload() {
  const [urls, setUrls] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    try {
      const urlList = urls.split('\n')
        .filter(url => url.trim())
        .map(url => ({ longUrl: url.trim() }));

      const response = await axios.post(`${API_BASE_URL}/api/bulk-shorten`, {
        urls: urlList
      });

      setResults(response.data.results);
      setShowResults(true);
      setUrls('');
    } catch (err) {
      console.error('Bulk upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadResults = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Original URL,Short URL,Status\n"
      + results.map(result => 
          `"${result.longUrl}","${result.shortUrl || 'Failed'}","${result.success ? 'Success' : 'Failed'}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "bulk_urls.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4">
      <div className="card">
        <div className="card-header">
          <h5>Bulk URL Shortener</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleBulkUpload}>
            <div className="mb-3">
              <label className="form-label">Enter URLs (one per line):</label>
              <textarea
                className="form-control"
                rows="8"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
                placeholder="https://example1.com&#10;https://example2.com&#10;https://example3.com"
                required
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !urls.trim()}
            >
              {loading ? 'Processing...' : 'Shorten All URLs'}
            </button>
          </form>

          {showResults && results.length > 0 && (
            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6>Results ({results.filter(r => r.success).length}/{results.length} successful)</h6>
                <button className="btn btn-outline-success btn-sm" onClick={downloadResults}>
                  Download CSV
                </button>
              </div>
              
              <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Original URL</th>
                      <th>Short URL</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, index) => (
                      <tr key={index}>
                        <td>
                          <div className="text-truncate" style={{ maxWidth: '300px' }}>
                            {result.longUrl}
                          </div>
                        </td>
                        <td>
                          {result.success ? (
                            <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
                              {result.shortUrl}
                            </a>
                          ) : (
                            <span className="text-muted">Failed</span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${result.success ? 'bg-success' : 'bg-danger'}`}>
                            {result.success ? 'Success' : 'Failed'}
                          </span>
                          {result.error && (
                            <div className="text-danger small">{result.error}</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BulkUpload;