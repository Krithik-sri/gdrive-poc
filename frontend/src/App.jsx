
import { useState, useEffect } from 'react';
import './App.css';
import driveLogo from './assets/image.png';

function App() {
  const [email, setEmail] = useState(null);
  const [files, setFiles] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setLoading(true);
      fetchData(emailParam);
      const interval = setInterval(() => fetchData(emailParam), 5000);
      return () => clearInterval(interval);
    }
  }, []);

  const fetchData = async (userEmail) => {
    await Promise.all([fetchFiles(userEmail), fetchTeams(userEmail)]);
    setLoading(false);
  };

  const fetchFiles = async (userEmail) => {
    try {
      const res = await fetch(`http://localhost:3000/files?email=${userEmail}`);
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error('Error fetching files', err);
    }
  };

  const fetchTeams = async (userEmail) => {
    try {
        const res = await fetch(`http://localhost:3000/teams?email=${userEmail}`);
        const data = await res.json();
        setTeams(data);
    } catch (err) {
        console.error('Error fetching teams', err);
    }
  };

  const handleConnect = () => {
    window.location.href = 'http://localhost:3000/auth/google';
  };

  const handleConnectTeams = () => {
    window.location.href = 'http://localhost:3000/auth/microsoft';
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <img src={driveLogo} alt="Drive Logo" className="logo-icon" />
          Drive & Teams Connector
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
                <h2>Connect to Start</h2>
                <p>Authorize access to view and sync your files and teams.</p>
                <div className="button-group">
                    <button className="connect-btn" onClick={handleConnect}>
                    Sign in with Google
                    </button>
                    {/* Optional: Add Microsoft Sign In here too if desired as primary entry */}
                     <button className="connect-btn" style={{marginTop: '10px', backgroundColor: '#464eb8'}} onClick={handleConnectTeams}>
                    Sign in with Microsoft
                    </button>
                </div>
            </div>
          </div>
        ) : (
          <div className="dashboard">
             {/* GOOGLE DRIVE SECTION */}
            <div className="files-section">
                <div className="files-header">
                    My Google Files ({files.length})
                </div>
                
                {loading && files.length === 0 ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <div>Syncing...</div>
                    </div>
                ) : (
                    <>
                        {files.length === 0 ? (
                            <div className="empty-state">
                                <p>No files found.</p>
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

            {/* MICROSOFT TEAMS SECTION */}
            <div className="files-section" style={{marginTop: '40px'}}>
                <div className="files-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span>My Teams ({teams.length})</span>
                    <button className="small-connect-btn" onClick={handleConnectTeams} style={{fontSize: '0.8rem', padding: '5px 10px', backgroundColor: '#464eb8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}>
                        Sync Teams
                    </button>
                </div>
                
                {teams.length === 0 && !loading ? (
                     <div className="empty-state">
                        <p>No teams found. Click Sync Teams to connect.</p>
                    </div>
                ) : (
                    <div className="files-grid">
                        {teams.map((team) => (
                        <a key={team.id} href={team.webUrl} target="_blank" rel="noreferrer" className="file-card team-card">
                            <div className="file-icon" style={{backgroundColor: '#e0e0f8'}}>
                                {/* Simple Team Icon Placeholder */}
                                <span style={{fontSize: '24px', fontWeight: 'bold', color: '#464eb8'}}>T</span>
                            </div>
                            <div className="file-details">
                                <span className="file-name">{team.name}</span>
                                <span className="file-meta">{team.description || 'No description'}</span>
                            </div>
                        </a>
                        ))}
                    </div>
                )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
