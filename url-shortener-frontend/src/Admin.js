import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Analytics from './components/Analytics';

const API_BASE_URL = process.env.REACT_APP_API_URL;

function Admin() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchUrls();
  }, [currentPage, searchTerm, sortBy, sortOrder]);

  const fetchUrls = async () => {
    try {
      const params = {
        page: currentPage,
        limit: 10,
        sortBy,
        order: sortOrder,
        ...(searchTerm && { search: searchTerm })
      };

      const response = await axios.get(`${API_BASE_URL}/api/admin/urls`, { params });
      setUrls(response.data.urls);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchUrls();
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const showUrlAnalytics = (url) => {
    setSelectedUrl(url);
    setShowAnalytics(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (showAnalytics && selectedUrl) {
    return (
      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>URL Analytics</h1>
          <div>
            <button 
              className="btn btn-secondary me-2"
              onClick={() => setShowAnalytics(false)}
            >
              Back to Admin
            </button>
            <a href="/" className="btn btn-primary">Back to Home</a>
          </div>
        </div>
        <Analytics shortCode={selectedUrl.shortCode || selectedUrl.customAlias} />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Admin Panel - URL Management</h1>
            <a href="/" className="btn btn-primary">Back to Home</a>
          </div>
          
          {/* Search and Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <form onSubmit={handleSearch} className="row g-3">
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search URLs, short codes, or aliases..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="createdAt">Created Date</option>
                    <option value="clickCount">Click Count</option>
                    <option value="longUrl">Original URL</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <button type="submit" className="btn btn-outline-primary w-100">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {urls.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No URLs found.
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('longUrl')}
                      >
                        Original URL {sortBy === 'longUrl' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Short Code/Alias</th>
                      <th>Short URL</th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('clickCount')}
                      >
                        Clicks {sortBy === 'clickCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Tags</th>
                      <th 
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleSort('createdAt')}
                      >
                        Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                      <th>Expires</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {urls.map((url) => (
                      <tr key={url._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <a 
                              href={url.longUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-truncate d-inline-block me-2" 
                              style={{maxWidth: '250px'}}
                              title={url.longUrl}
                            >
                              {url.longUrl}
                            </a>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => copyToClipboard(url.longUrl)}
                              title="Copy URL"
                            >
                              📋
                            </button>
                          </div>
                        </td>
                        <td>
                          <code className="bg-light p-1 rounded">
                            {url.customAlias || url.shortCode}
                          </code>
                          {url.password && <span className="badge bg-warning ms-1">🔒</span>}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <a 
                              href={`${API_BASE_URL}/${url.customAlias || url.shortCode}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="me-2"
                            >
                              {API_BASE_URL}/{url.customAlias || url.shortCode}
                            </a>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => copyToClipboard(`${API_BASE_URL}/${url.customAlias || url.shortCode}`)}
                              title="Copy Short URL"
                            >
                              📋
                            </button>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary fs-6">{url.clickCount}</span>
                        </td>
                        <td>
                          {url.tags && url.tags.length > 0 ? (
                            <div>
                              {url.tags.map((tag, index) => (
                                <span key={index} className="badge bg-secondary me-1">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted">No tags</span>
                          )}
                        </td>
                        <td>
                          <small>{formatDate(url.createdAt)}</small>
                          {url.createdBy && url.createdBy !== 'anonymous' && (
                            <div className="text-muted small">by {url.createdBy}</div>
                          )}
                        </td>
                        <td>
                          {url.expiresAt ? (
                            <small className={new Date(url.expiresAt) < new Date() ? 'text-danger' : 'text-warning'}>
                              {formatDate(url.expiresAt)}
                            </small>
                          ) : (
                            <span className="text-success small">Never</span>
                          )}
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={() => showUrlAnalytics(url)}
                              title="View Analytics"
                            >
                              📊
                            </button>
                            {url.qrCode && (
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => {
                                  const link = document.createElement('a');
                                  link.download = `qr-${url.shortCode}.png`;
                                  link.href = url.qrCode;
                                  link.click();
                                }}
                                title="Download QR Code"
                              >
                                📱
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav className="mt-4">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                    </li>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                        <button 
                          className="page-link"
                          onClick={() => setCurrentPage(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;