import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Nav, Navbar, Tab, Tabs, Button, Dropdown, Spinner } from 'react-bootstrap';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import AutomatedPost from './components/AutomatedPost';
import ManualPost from './components/ManualPost';
import PostHistory from './components/PostHistory';
import PersonaManager from './components/PersonaManager';
import ContentScheduler from './components/ContentScheduler';
import AdminSettings from './components/AdminSettings';
import './App.css';

function AppContent() {
  const [activeTab, setActiveTab] = useState('automated');
  const { isAuthenticated, adminEmail, loading, login, logout } = useAuth();

  const handleLogin = (email) => {
    login(email);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading BuzzSnip...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="App">
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#home">
            <strong>🤖 BuzzSnip</strong> - AI Video Creator
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" size="sm">
                  👤 {adminEmail}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Header>Admin Panel</Dropdown.Header>
                  <Dropdown.Item onClick={() => setActiveTab('settings')}>
                    ⚙️ Settings
                  </Dropdown.Item>
                  <Dropdown.Item>
                    📊 System Status
                  </Dropdown.Item>
                  <Dropdown.Item>
                    📁 File Manager
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <div className="hero-section text-center mb-5">
          <h1 className="display-4 mb-3">AI-Powered Video Content Creation</h1>
          <p className="lead text-muted">
            Create stunning Instagram Reels and YouTube Shorts with AI personas
          </p>
          <div className="d-flex justify-content-center align-items-center mt-3">
            <span className="badge bg-success me-2">🟢 Admin Access</span>
            <small className="text-muted">Logged in as {adminEmail}</small>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-4"
          fill
        >
          <Tab eventKey="automated" title="🤖 Automated Creation">
            <AutomatedPost />
          </Tab>
          <Tab eventKey="manual" title="✋ Manual Creation">
            <ManualPost />
          </Tab>
          <Tab eventKey="personas" title="👥 Manage Personas">
            <PersonaManager />
          </Tab>
          <Tab eventKey="scheduler" title="📅 Scheduler">
            <ContentScheduler />
          </Tab>
          <Tab eventKey="history" title="📊 Post History">
            <PostHistory />
          </Tab>
          <Tab eventKey="settings" title="⚙️ Settings">
            <AdminSettings />
          </Tab>
        </Tabs>
      </Container>

      <footer className="bg-dark text-light py-4 mt-5">
        <Container>
          <div className="row">
            <div className="col-md-6">
              <h5>BuzzSnip</h5>
              <p className="mb-0">AI-powered video content automation platform</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0">
                <small>Built with React & Bootstrap | Admin Panel v1.0</small>
              </p>
              <Button 
                variant="outline-light" 
                size="sm" 
                onClick={handleLogout}
                className="mt-1"
              >
                🚪 Logout
              </Button>
            </div>
          </div>
        </Container>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;