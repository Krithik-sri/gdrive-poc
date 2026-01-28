
import { useState, useEffect } from 'react';
import './App.css';
import driveLogo from './assets/image.png';

function App() {
  const [email, setEmail] = useState(null);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setLoading(true);
      fetchFiles(emailParam);
      const interval = setInterval(() => fetchFiles(emailParam), 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchFiles = async (userEmail) => {
    try {
      const res = await fetch(`http://localhost:3000/files?email=${userEmail}`);
      const data = await res.json();
      setFiles(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching files', err);
    }
  };

  const handleConnect = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <img src={driveLogo} alt="Drive Logo" className="logo-icon" />
          Drive Connector
        </h1>
        {email && (
            <div className="user-controls">
                <div className="user-badge">
                    <div className="status-dot"></div>
                    {email}
                </div>
            </div>
        )}
      </header>
      
      <main className="main-content">
        {!email ? (
          <div className="connect-wrapper">
            <div className="connect-card">
                <h2>Connect to Google Drive</h2>
                <p>Authorize access to view and sync your Google Drive files securely.</p>
                <button className="connect-btn" onClick={handleConnect}>
                Sign in with Google
                </button>
            </div>
          </div>
        ) : (
          <div className="files-section">
            <div className="files-header">
                My Files ({files.length})
            </div>
            
            {loading && files.length === 0 ? (
                <div className="loading-container">
                    <div className="spinner"></div>
                    <div>Syncing your files...</div>
                </div>
            ) : (
                <>
                    {files.length === 0 ? (
                        <div className="empty-state">
                            <p>No files found. Please wait while we fetch them...</p>
                        </div>
                    ) : (
                        <div className="files-grid">
                            {files.map((file) => (
                            <a key={file.id} href={file.webViewLink} target="_blank" rel="noreferrer" className="file-card">
                                <div className="file-icon">
                                    <img src={file.iconLink || 'https://ssl.gstatic.com/docs/doclist/images/icon_10_generic_list.png'} alt="file type" />
                                </div>
                                <div className="file-details">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-meta">Click to open in Drive</span>
                                </div>
                            </a>
                            ))}
                        </div>
                    )}
                </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
