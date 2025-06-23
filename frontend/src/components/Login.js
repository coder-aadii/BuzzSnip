import React, { useState } from 'react';
import { 
  Container, 
  Card, 
  Form, 
  Button, 
  Alert, 
  Spinner,
  Row,
  Col
} from 'react-bootstrap';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      // In a real application, this would be an API call to verify credentials
      // For now, we'll check against environment variables on the frontend
      // Note: In production, this should be handled by the backend for security
      
      const adminEmail = process.env.REACT_APP_ADMIN_EMAIL || 'aditya.admin@buzzsnip.com';
      const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD || '9074_Qwerty';

      if (formData.email === adminEmail && formData.password === adminPassword) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Login successful! Redirecting...'
        });

        // Call the onLogin callback after a short delay
        setTimeout(() => {
          onLogin(formData.email);
        }, 1500);
      } else {
        setAlert({
          show: true,
          type: 'danger',
          message: 'Invalid email or password. Please try again.'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Login failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={4}>
            <div className="text-center mb-4">
              <h1 className="display-4 text-white mb-3">
                🤖 <strong>BuzzSnip</strong>
              </h1>
              <p className="text-white-50 lead">
                AI Video Creator Admin Panel
              </p>
            </div>

            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white text-center">
                <h5 className="mb-0">🔐 Admin Login</h5>
              </Card.Header>
              <Card.Body className="p-4">
                {alert.show && (
                  <Alert variant={alert.type} className="mb-3">
                    {alert.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      📧 Admin Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter admin email"
                      required
                      autoComplete="username"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>
                      🔒 Password
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter password"
                      required
                      autoComplete="current-password"
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading || !formData.email || !formData.password}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          🚀 Login to Dashboard
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                <hr className="my-4" />
                
                <div className="text-center">
                  <small className="text-muted">
                    🛡️ Secure Admin Access Only
                  </small>
                  <div className="mt-2">
                    <small className="text-muted">
                      Demo Credentials: aditya.admin@buzzsnip.com
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <small className="text-white-50">
                BuzzSnip v1.0 | AI-Powered Video Creation Platform
              </small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;