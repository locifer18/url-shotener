import React from 'react';

function QRCodeDisplay({ qrCode, shortUrl }) {
  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = qrCode;
    link.click();
  };

  if (!qrCode) return null;

  return (
    <div className="text-center mt-3">
      <div className="card" style={{ maxWidth: '300px', margin: '0 auto' }}>
        <div className="card-header">
          <h6>QR Code</h6>
        </div>
        <div className="card-body">
          <img 
            src={qrCode} 
            alt="QR Code" 
            className="img-fluid mb-3"
            style={{ maxWidth: '200px' }}
          />
          <div className="d-grid gap-2">
            <button 
              className="btn btn-outline-primary btn-sm"
              onClick={downloadQR}
            >
              Download QR Code
            </button>
            <small className="text-muted">
              Scan to visit: {shortUrl}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRCodeDisplay;