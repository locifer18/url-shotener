import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Admin from './Admin';
import AdvancedForm from './components/AdvancedForm';
import QRCodeDisplay from './components/QRCodeDisplay';
import BulkUpload from './components/BulkUpload';

function Home() {
  const [urlResult, setUrlResult] = useState(null);
  const [activeTab, setActiveTab] = useState('single');

  const handleUrlCreated = (result) => {
    setUrlResult(result);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 mb-3">🔗 URL Shortener</h1>
            <p className="lead text-muted">
              Advanced URL shortening with analytics, QR codes, and bulk processing
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/admin" className="btn btn-outline-primary">
                📊 Admin Panel
              </Link>
              <a 
                href="https://github.com/your-username/url-shortener" 
                className="btn btn-outline-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                📁 GitHub
              </a>
            </div>
          </div>

          {/* Tab Navigation */}
          <ul className="nav nav-tabs mb-4" role="tablist">
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'single' ? 'active' : ''}`}
                onClick={() => setActiveTab('single')}
              >
                Single URL
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button 
                className={`nav-link ${activeTab === 'bulk' ? 'active' : ''}`}
                onClick={() => setActiveTab('bulk')}
              >
                Bulk Upload
              </button>
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'single' && (
              <div className="tab-pane fade show active">
                <div className="card">
                  <div className="card-body">
                    <AdvancedForm onUrlCreated={handleUrlCreated} />
                    
                    {urlResult && (
                      <div className="mt-4">
                        <div className="alert alert-success">
                          <div className="row align-items-center">
                            <div className="col-md-8">
                              <h6 className="alert-heading">✅ URL Shortened Successfully!</h6>
                              <div className="d-flex align-items-center">
                                <strong className="me-2">Short URL:</strong>
                                <a 
                                  href={urlResult.shortUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="me-2"
                                >
                                  {urlResult.shortUrl}
                                </a>
                                <button 
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => copyToClipboard(urlResult.shortUrl)}
                                  title="Copy to clipboard"
                                >
                                  📋
                                </button>
                              </div>
                              
                              {urlResult.expiresAt && (
                                <div className="mt-2">
                                  <small className="text-warning">
                                    ⏰ Expires: {new Date(urlResult.expiresAt).toLocaleString()}
                                  </small>
                                </div>
                              )}
                              
                              <div className="mt-2">
                                <small className="text-muted">
                                  📊 Clicks: {urlResult.analytics?.clicks || 0} | 
                                  📅 Created: {new Date(urlResult.analytics?.created).toLocaleDateString()}
                                </small>
                              </div>
                            </div>
                            
                            <div className="col-md-4">
                              <QRCodeDisplay 
                                qrCode={urlResult.qrCode} 
                                shortUrl={urlResult.shortUrl} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bulk' && (
              <div className="tab-pane fade show active">
                <BulkUpload />
              </div>
            )}
          </div>

          {/* Features Section */}
          <div className="row mt-5">
            <div className="col-12">
              <h3 className="text-center mb-4">🚀 Features</h3>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <div className="display-6 mb-3">📊</div>
                      <h5>Advanced Analytics</h5>
                      <p className="card-text">
                        Track clicks, referrers, devices, and geographic data
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <div className="display-6 mb-3">📱</div>
                      <h5>QR Code Generation</h5>
                      <p className="card-text">
                        Automatic QR code generation for easy mobile sharing
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <div className="display-6 mb-3">🔒</div>
                      <h5>Password Protection</h5>
                      <p className="card-text">
                        Secure your links with password protection
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <div className="display-6 mb-3">⏰</div>
                      <h5>Link Expiration</h5>
                      <p className="card-text">
                        Set expiration dates for temporary links
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <div className="display-6 mb-3">🏷️</div>
                      <h5>Custom Aliases & Tags</h5>
                      <p className="card-text">
                        Create memorable aliases and organize with tags
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card h-100 text-center">
                    <div className="card-body">
                      <div className="display-6 mb-3">📦</div>
                      <h5>Bulk Processing</h5>
                      <p className="card-text">
                        Process multiple URLs at once with CSV export
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="text-center mt-5 py-4 border-top">
            <p className="text-muted">
              Built with using MERN Stack | 
              <a href="https://github.com/your-username/url-shortener" className="text-decoration-none ms-1">
                View Source Code
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;