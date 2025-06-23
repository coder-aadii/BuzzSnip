import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Button, 
  Row, 
  Col, 
  Alert, 
  Badge, 
  Spinner,
  ProgressBar 
} from 'react-bootstrap';
import axios from 'axios';

const AutomatedPost = () => {
  const [formData, setFormData] = useState({
    persona_id: 'tech_guru_hindi',
    theme: 'gadget_reviews',
    duration: 30,
    platforms: ['youtube', 'instagram'],
    schedule_time: '',
    auto_upload: true
  });
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  const personas = [
    { id: 'tech_guru_hindi', name: 'TechShree - Hindi Tech Guru', niche: 'Technology' },
    { id: 'fitness_coach', name: 'Aarohi FitAI - Fitness Coach', niche: 'Fitness' },
    { id: 'fashion_influencer', name: 'Ritika AI - Fashion Influencer', niche: 'Fashion' }
  ];

  const themes = {
    tech_guru_hindi: ['gadget_reviews', 'ai_tips', 'coding_hacks', 'tech_news'],
    fitness_coach: ['workout_tips', 'nutrition_advice', 'motivation', 'exercise_demos'],
    fashion_influencer: ['outfit_ideas', 'style_tips', 'fashion_trends', 'beauty_hacks']
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'platforms') {
      const platforms = [...formData.platforms];
      if (checked) {
        platforms.push(value);
      } else {
        const index = platforms.indexOf(value);
        if (index > -1) platforms.splice(index, 1);
      }
      setFormData({ ...formData, platforms });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress(0);
    setAlert({ show: false, type: '', message: '' });

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 2000);

      const response = await axios.post('http://localhost:5000/api/generate', formData);
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setAlert({
        show: true,
        type: 'success',
        message: `Video generation started successfully! Job ID: ${response.data.job_id || 'N/A'}`
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: `Error: ${error.response?.data?.message || error.message}`
      });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <div>
      <Card className="shadow-sm">
        <Card.Header className="bg-primary text-white">
          <h5 className="mb-0">🤖 Automated Video Creation</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-4">
            Let AI handle everything - from script generation to posting on social media platforms.
          </p>

          {alert.show && (
            <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
              {alert.message}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>AI Persona</Form.Label>
                  <Form.Select
                    name="persona_id"
                    value={formData.persona_id}
                    onChange={handleInputChange}
                    required
                  >
                    {personas.map(persona => (
                      <option key={persona.id} value={persona.id}>
                        {persona.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Choose your AI influencer persona
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Content Theme</Form.Label>
                  <Form.Select
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    required
                  >
                    {themes[formData.persona_id]?.map(theme => (
                      <option key={theme} value={theme}>
                        {theme.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Select content category for the video
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Video Duration (seconds)</Form.Label>
                  <Form.Range
                    name="duration"
                    min={15}
                    max={60}
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                  <div className="d-flex justify-content-between">
                    <small>15s</small>
                    <Badge bg="info">{formData.duration}s</Badge>
                    <small>60s</small>
                  </div>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Schedule Time (Optional)</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="schedule_time"
                    value={formData.schedule_time}
                    onChange={handleInputChange}
                  />
                  <Form.Text className="text-muted">
                    Leave empty for immediate generation
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Upload Platforms</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="checkbox"
                  name="platforms"
                  value="youtube"
                  label="📺 YouTube Shorts"
                  checked={formData.platforms.includes('youtube')}
                  onChange={handleInputChange}
                />
                <Form.Check
                  inline
                  type="checkbox"
                  name="platforms"
                  value="instagram"
                  label="📸 Instagram Reels"
                  checked={formData.platforms.includes('instagram')}
                  onChange={handleInputChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Check
                type="checkbox"
                name="auto_upload"
                label="🚀 Auto-upload after generation"
                checked={formData.auto_upload}
                onChange={handleInputChange}
              />
              <Form.Text className="text-muted">
                Automatically post to selected platforms when video is ready
              </Form.Text>
            </Form.Group>

            {loading && (
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Generating video...</span>
                  <span>{progress}%</span>
                </div>
                <ProgressBar now={progress} animated />
                <small className="text-muted">
                  This may take 10-30 minutes depending on your system
                </small>
              </div>
            )}

            <div className="d-grid">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading || formData.platforms.length === 0}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Generating Video...
                  </>
                ) : (
                  '🎬 Generate & Post Video'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mt-4 shadow-sm">
        <Card.Header>
          <h6 className="mb-0">ℹ️ How Automated Creation Works</h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <div className="text-center mb-3">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <span style={{fontSize: '24px'}}>🧠</span>
                </div>
                <h6 className="mt-2">AI Script Generation</h6>
                <small className="text-muted">TinyLlama creates engaging scripts</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center mb-3">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <span style={{fontSize: '24px'}}>🎭</span>
                </div>
                <h6 className="mt-2">Voice & Face Sync</h6>
                <small className="text-muted">Bark TTS + SadTalker lip-sync</small>
              </div>
            </Col>
            <Col md={4}>
              <div className="text-center mb-3">
                <div className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center" style={{width: '60px', height: '60px'}}>
                  <span style={{fontSize: '24px'}}>🚀</span>
                </div>
                <h6 className="mt-2">Auto Upload</h6>
                <small className="text-muted">Direct posting to social platforms</small>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AutomatedPost;