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
  ProgressBar,
  Tabs,
  Tab
} from 'react-bootstrap';
import axios from 'axios';

const ManualPost = () => {
  const [activeStep, setActiveStep] = useState('script');
  const [formData, setFormData] = useState({
    // Script step
    custom_script: '',
    persona_id: 'tech_guru_hindi',
    
    // Voice step
    voice_type: 'bark',
    voice_speed: 1.0,
    voice_pitch: 1.0,
    
    // Visual step
    face_prompt: '',
    background_type: 'gradient',
    background_color: '#1a1a2e',
    
    // Video step
    duration: 30,
    resolution: '1080p',
    overlay_text: '',
    
    // Upload step
    platforms: ['youtube'],
    title: '',
    description: '',
    tags: '',
    thumbnail_style: 'modern'
  });
  
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [generatedAssets, setGeneratedAssets] = useState({
    audio: null,
    face: null,
    video: null
  });

  const personas = [
    { id: 'tech_guru_hindi', name: 'TechShree - Hindi Tech Guru' },
    { id: 'fitness_coach', name: 'Aarohi FitAI - Fitness Coach' },
    { id: 'fashion_influencer', name: 'Ritika AI - Fashion Influencer' }
  ];

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

  const generateAudio = async () => {
    if (!formData.custom_script.trim()) {
      setAlert({ show: true, type: 'warning', message: 'Please enter a script first!' });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-audio', {
        script: formData.custom_script,
        voice_type: formData.voice_type,
        persona_id: formData.persona_id,
        speed: formData.voice_speed,
        pitch: formData.voice_pitch
      });
      
      setGeneratedAssets(prev => ({ ...prev, audio: response.data.audio_url }));
      setAlert({ show: true, type: 'success', message: 'Audio generated successfully!' });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: `Audio generation failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const generateFace = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/generate-face', {
        persona_id: formData.persona_id,
        custom_prompt: formData.face_prompt
      });
      
      setGeneratedAssets(prev => ({ ...prev, face: response.data.face_url }));
      setAlert({ show: true, type: 'success', message: 'Face generated successfully!' });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: `Face generation failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const generateVideo = async () => {
    if (!generatedAssets.audio || !generatedAssets.face) {
      setAlert({ show: true, type: 'warning', message: 'Please generate audio and face first!' });
      return;
    }

    setLoading(true);
    setProgress(0);
    
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => prev < 90 ? prev + 10 : 90);
      }, 3000);

      const response = await axios.post('http://localhost:5000/api/generate-video', {
        audio_url: generatedAssets.audio,
        face_url: generatedAssets.face,
        background_type: formData.background_type,
        background_color: formData.background_color,
        resolution: formData.resolution,
        overlay_text: formData.overlay_text
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      setGeneratedAssets(prev => ({ ...prev, video: response.data.video_url }));
      setAlert({ show: true, type: 'success', message: 'Video generated successfully!' });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: `Video generation failed: ${error.message}` });
    } finally {
      setLoading(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  const downloadVideo = async () => {
    if (!generatedAssets.video) {
      setAlert({ show: true, type: 'warning', message: 'Please generate video first!' });
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = generatedAssets.video;
      link.download = `buzzsnip-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setAlert({ show: true, type: 'success', message: 'Video download started!' });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: `Download failed: ${error.message}` });
    }
  };

  const uploadVideo = async () => {
    if (!generatedAssets.video) {
      setAlert({ show: true, type: 'warning', message: 'Please generate video first!' });
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/upload', {
        video_url: generatedAssets.video,
        platforms: formData.platforms,
        title: formData.title,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        thumbnail_style: formData.thumbnail_style
      });
      
      setAlert({ show: true, type: 'success', message: 'Video uploaded successfully to selected platforms!' });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: `Upload failed: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card className="shadow-sm">
        <Card.Header className="bg-success text-white">
          <h5 className="mb-0">✋ Manual Video Creation</h5>
        </Card.Header>
        <Card.Body>
          <p className="text-muted mb-4">
            Take full control over each step of the video creation process.
          </p>

          {alert.show && (
            <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
              {alert.message}
            </Alert>
          )}

          <Tabs activeKey={activeStep} onSelect={setActiveStep} className="mb-4">
            <Tab eventKey="script" title="📝 Script">
              <Card className="border-0">
                <Card.Body>
                  <h6>Write Your Script</h6>
                  <Form.Group className="mb-3">
                    <Form.Label>AI Persona</Form.Label>
                    <Form.Select
                      name="persona_id"
                      value={formData.persona_id}
                      onChange={handleInputChange}
                    >
                      {personas.map(persona => (
                        <option key={persona.id} value={persona.id}>
                          {persona.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Custom Script</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="custom_script"
                      value={formData.custom_script}
                      onChange={handleInputChange}
                      placeholder="Enter your video script here... (Keep it under 200 words for 30-second videos)"
                    />
                    <Form.Text className="text-muted">
                      Character count: {formData.custom_script.length} | Estimated duration: ~{Math.ceil(formData.custom_script.split(' ').length / 3)}s
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="voice" title="🎙️ Voice">
              <Card className="border-0">
                <Card.Body>
                  <h6>Voice Configuration</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Voice Engine</Form.Label>
                        <Form.Select
                          name="voice_type"
                          value={formData.voice_type}
                          onChange={handleInputChange}
                        >
                          <option value="bark">Bark (High Quality)</option>
                          <option value="tortoise">Tortoise TTS (Slower)</option>
                          <option value="gtts">Google TTS (Fast)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Voice Speed</Form.Label>
                        <Form.Range
                          name="voice_speed"
                          min={0.5}
                          max={2.0}
                          step={0.1}
                          value={formData.voice_speed}
                          onChange={handleInputChange}
                        />
                        <div className="d-flex justify-content-between">
                          <small>0.5x</small>
                          <Badge bg="info">{formData.voice_speed}x</Badge>
                          <small>2.0x</small>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Button 
                    variant="primary" 
                    onClick={generateAudio}
                    disabled={loading || !formData.custom_script.trim()}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : '🎵'} Generate Audio
                  </Button>
                  
                  {generatedAssets.audio && (
                    <Alert variant="success" className="mt-3">
                      ✅ Audio generated! <audio controls src={generatedAssets.audio} className="ms-2" />
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="visual" title="👤 Visual">
              <Card className="border-0">
                <Card.Body>
                  <h6>Face & Background</h6>
                  <Form.Group className="mb-3">
                    <Form.Label>Custom Face Prompt (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="face_prompt"
                      value={formData.face_prompt}
                      onChange={handleInputChange}
                      placeholder="e.g., professional woman, confident expression, studio lighting"
                    />
                    <Form.Text className="text-muted">
                      Leave empty to use default persona appearance
                    </Form.Text>
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Background Type</Form.Label>
                        <Form.Select
                          name="background_type"
                          value={formData.background_type}
                          onChange={handleInputChange}
                        >
                          <option value="gradient">Gradient</option>
                          <option value="solid">Solid Color</option>
                          <option value="blur">Blurred</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Background Color</Form.Label>
                        <Form.Control
                          type="color"
                          name="background_color"
                          value={formData.background_color}
                          onChange={handleInputChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Button 
                    variant="primary" 
                    onClick={generateFace}
                    disabled={loading}
                  >
                    {loading ? <Spinner animation="border" size="sm" /> : '👤'} Generate Face
                  </Button>
                  
                  {generatedAssets.face && (
                    <Alert variant="success" className="mt-3">
                      ✅ Face generated! <img src={generatedAssets.face} alt="Generated face" style={{width: '100px', height: '100px', objectFit: 'cover'}} className="ms-2 rounded" />
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="video" title="🎬 Video">
              <Card className="border-0">
                <Card.Body>
                  <h6>Video Composition</h6>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Resolution</Form.Label>
                        <Form.Select
                          name="resolution"
                          value={formData.resolution}
                          onChange={handleInputChange}
                        >
                          <option value="720p">720p (HD)</option>
                          <option value="1080p">1080p (Full HD)</option>
                          <option value="4k">4K (Ultra HD)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Overlay Text (Optional)</Form.Label>
                        <Form.Control
                          type="text"
                          name="overlay_text"
                          value={formData.overlay_text}
                          onChange={handleInputChange}
                          placeholder="e.g., Tech Tips, Follow for more"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  {loading && progress > 0 && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span>Generating video...</span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar now={progress} animated />
                    </div>
                  )}
                  
                  <div className="d-flex gap-2">
                    <Button 
                      variant="primary" 
                      onClick={generateVideo}
                      disabled={loading || !generatedAssets.audio || !generatedAssets.face}
                      className="flex-grow-1"
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : '🎬'} Generate Video
                    </Button>
                    
                    {generatedAssets.video && (
                      <Button 
                        variant="success" 
                        onClick={downloadVideo}
                        disabled={loading}
                      >
                        📥 Download
                      </Button>
                    )}
                  </div>
                  
                  {generatedAssets.video && (
                    <Alert variant="success" className="mt-3">
                      ✅ Video generated successfully! 
                      <video controls width="200" className="ms-2 d-block mt-2">
                        <source src={generatedAssets.video} type="video/mp4" />
                      </video>
                      <div className="mt-2">
                        <small className="text-muted">
                          Click the download button above to save the video to your device.
                        </small>
                      </div>
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="upload" title="🚀 Upload">
              <Card className="border-0">
                <Card.Body>
                  <h6>Upload Configuration</h6>
                  
                  {!generatedAssets.video && (
                    <Alert variant="info">
                      <strong>ℹ️ Video Required:</strong> Please generate a video first before configuring upload settings.
                    </Alert>
                  )}
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Platforms</Form.Label>
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
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter video title"
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter video description"
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tags (comma-separated)</Form.Label>
                        <Form.Control
                          type="text"
                          name="tags"
                          value={formData.tags}
                          onChange={handleInputChange}
                          placeholder="tech, ai, shorts, viral"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Thumbnail Style</Form.Label><Form.Select
                          name="thumbnail_style"
                          value={formData.thumbnail_style}
                          onChange={handleInputChange}
                        >
                          <option value="modern">Modern</option>
                          <option value="bold">Bold</option>
                          <option value="minimal">Minimal</option>
                          <option value="gradient">Gradient</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <div className="d-flex gap-2">
                    {generatedAssets.video && (
                      <Button 
                        variant="info" 
                        onClick={downloadVideo}
                        disabled={loading}
                      >
                        📥 Download Video
                      </Button>
                    )}
                    
                    <Button 
                      variant="success" 
                      onClick={uploadVideo}
                      disabled={loading || !generatedAssets.video || formData.platforms.length === 0}
                      className="flex-grow-1"
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : '🚀'} Upload to Platforms
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      <Card className="mt-4 shadow-sm">
        <Card.Header>
          <h6 className="mb-0">📋 Manual Creation Checklist</h6>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <div className="d-flex align-items-center mb-2">
                <Badge bg={formData.custom_script ? 'success' : 'secondary'} className="me-2">
                  {formData.custom_script ? '✓' : '1'}
                </Badge>
                <span>Write Script</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center mb-2">
                <Badge bg={generatedAssets.audio ? 'success' : 'secondary'} className="me-2">
                  {generatedAssets.audio ? '✓' : '2'}
                </Badge>
                <span>Generate Audio</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center mb-2">
                <Badge bg={generatedAssets.face ? 'success' : 'secondary'} className="me-2">
                  {generatedAssets.face ? '✓' : '3'}
                </Badge>
                <span>Generate Face</span>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-center mb-2">
                <Badge bg={generatedAssets.video ? 'success' : 'secondary'} className="me-2">
                  {generatedAssets.video ? '✓' : '4'}
                </Badge>
                <span>Create Video</span>
              </div>
            </Col>
          </Row>
          
          {generatedAssets.video && (
            <div className="mt-3 pt-3 border-top">
              <Row>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-2">
                    <Badge bg="success" className="me-2">📥</Badge>
                    <span>Download Available</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="d-flex align-items-center mb-2">
                    <Badge bg={formData.platforms.length > 0 ? 'warning' : 'secondary'} className="me-2">
                      {formData.platforms.length > 0 ? '🚀' : '5'}
                    </Badge>
                    <span>Upload to Platforms</span>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManualPost;