import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Modal,
  Form,
  Alert,
  Badge,
  Table,
  Spinner,
  Tabs,
  Tab
} from 'react-bootstrap';
import axios from 'axios';

const PersonaManager = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [activeTab, setActiveTab] = useState('list');

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    language: 'Hindi-English (Hinglish)',
    voice_type: 'bark',
    prompt: '',
    themes: [],
    personality_traits: [],
    signature_phrases: [],
    social_media: {
      youtube: { username: '', password: '' },
      instagram: { username: '', password: '' }
    },
    avatar_url: '',
    status: 'active'
  });

  // Mock personas data
  const mockPersonas = [
    {
      id: 'tech_guru_hindi',
      name: 'TechShree',
      language: 'Hindi-English (Hinglish)',
      voice_type: 'bark',
      prompt: 'A confident, sharp Indian tech influencer, photorealistic, 8k, focused lighting',
      themes: ['gadget_reviews', 'ai_tips', 'coding_hacks'],
      personality_traits: ['smart', 'calm', 'helpful'],
      signature_phrases: [
        'Aaj ka tech secret...',
        'Yeh feature bilkul next-level hai!',
        'Agar aap coder ho toh yeh zaroor try karo!'
      ],
      avatar_url: '/api/avatars/tech_guru_hindi.jpg',
      status: 'active',
      created_at: '2024-01-10T10:00:00Z',
      last_used: '2024-01-15T14:30:00Z',
      total_videos: 45,
      total_views: 125000
    },
    {
      id: 'fitness_coach',
      name: 'Aarohi FitAI',
      language: 'Hindi-English (Hinglish)',
      voice_type: 'tortoise',
      prompt: 'A energetic Indian fitness coach, athletic build, motivational expression, gym background',
      themes: ['workout_tips', 'nutrition_advice', 'motivation', 'exercise_demos'],
      personality_traits: ['energetic', 'motivational', 'disciplined', 'caring'],
      signature_phrases: [
        'Aaj ka workout challenge...',
        'Fitness is not a destination, it\'s a journey!',
        'Strong body, strong mind!'
      ],
      avatar_url: '/api/avatars/fitness_coach.jpg',
      status: 'active',
      created_at: '2024-01-08T09:00:00Z',
      last_used: '2024-01-14T16:20:00Z',
      total_videos: 32,
      total_views: 89000
    },
    {
      id: 'fashion_influencer',
      name: 'Ritika AI',
      language: 'Hindi-English (Hinglish)',
      voice_type: 'gtts',
      prompt: 'A glamorous Indian fashion model, stylish outfit, confident pose, modern background',
      themes: ['outfit_ideas', 'style_tips', 'fashion_trends', 'beauty_hacks'],
      personality_traits: ['stylish', 'confident', 'trendy', 'inspiring'],
      signature_phrases: [
        'Aaj ka fashion mantra...',
        'Style is a way to say who you are!',
        'Fashion fades, but style is eternal!'
      ],
      avatar_url: '/api/avatars/fashion_influencer.jpg',
      status: 'inactive',
      created_at: '2024-01-05T11:30:00Z',
      last_used: '2024-01-12T13:45:00Z',
      total_videos: 28,
      total_views: 67000
    }
  ];

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('http://localhost:5000/api/personas');
      // setPersonas(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setPersonas(mockPersonas);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to fetch personas' });
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayInputChange = (field, value) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: array
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingPersona) {
        // Update existing persona
        await axios.put(`http://localhost:5000/api/personas/${editingPersona.id}`, formData);
        setAlert({ show: true, type: 'success', message: 'Persona updated successfully!' });
      } else {
        // Create new persona
        await axios.post('http://localhost:5000/api/personas', formData);
        setAlert({ show: true, type: 'success', message: 'Persona created successfully!' });
      }
      
      setShowModal(false);
      setEditingPersona(null);
      resetForm();
      fetchPersonas();
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to save persona' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (persona) => {
    setEditingPersona(persona);
    setFormData({
      ...persona,
      themes: persona.themes || [],
      personality_traits: persona.personality_traits || [],
      signature_phrases: persona.signature_phrases || []
    });
    setShowModal(true);
  };

  const handleDelete = async (personaId) => {
    if (window.confirm('Are you sure you want to delete this persona?')) {
      try {
        await axios.delete(`http://localhost:5000/api/personas/${personaId}`);
        setAlert({ show: true, type: 'success', message: 'Persona deleted successfully!' });
        fetchPersonas();
      } catch (error) {
        setAlert({ show: true, type: 'danger', message: 'Failed to delete persona' });
      }
    }
  };

  const handleToggleStatus = async (personaId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await axios.patch(`http://localhost:5000/api/personas/${personaId}/status`, { status: newStatus });
      setAlert({ show: true, type: 'success', message: `Persona ${newStatus === 'active' ? 'activated' : 'deactivated'}!` });
      fetchPersonas();
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to update persona status' });
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      language: 'Hindi-English (Hinglish)',
      voice_type: 'bark',
      prompt: '',
      themes: [],
      personality_traits: [],
      signature_phrases: [],
      social_media: {
        youtube: { username: '', password: '' },
        instagram: { username: '', password: '' }
      },
      avatar_url: '',
      status: 'active'
    });
  };

  const getStatusBadge = (status) => {
    return (
      <Badge bg={status === 'active' ? 'success' : 'secondary'}>
        {status === 'active' ? '🟢 Active' : '⚫ Inactive'}
      </Badge>
    );
  };

  if (loading && personas.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading personas...</p>
      </div>
    );
  }

  return (
    <div>
      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="list" title="👥 All Personas">
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">👥 AI Personas Management</h5>
              <Button 
                variant="primary" 
                onClick={() => {
                  resetForm();
                  setEditingPersona(null);
                  setShowModal(true);
                }}
              >
                ➕ Add New Persona
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Avatar</th>
                    <th>Name</th>
                    <th>Language</th>
                    <th>Voice</th>
                    <th>Themes</th>
                    <th>Status</th>
                    <th>Performance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {personas.map(persona => (
                    <tr key={persona.id}>
                      <td>
                        <div 
                          className="rounded-circle bg-light d-flex align-items-center justify-content-center"
                          style={{ width: '50px', height: '50px' }}
                        >
                          {persona.avatar_url ? (
                            <img 
                              src={persona.avatar_url} 
                              alt={persona.name}
                              className="rounded-circle"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            <span style={{ fontSize: '24px' }}>👤</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="fw-bold">{persona.name}</div>
                          <small className="text-muted">ID: {persona.id}</small>
                        </div>
                      </td>
                      <td>{persona.language}</td>
                      <td>
                        <Badge bg="info">{persona.voice_type.toUpperCase()}</Badge>
                      </td>
                      <td>
                        <div>
                          {persona.themes.slice(0, 2).map(theme => (
                            <Badge key={theme} bg="secondary" className="me-1 mb-1">
                              {theme.replace('_', ' ')}
                            </Badge>
                          ))}
                          {persona.themes.length > 2 && (
                            <Badge bg="light" className="text-dark">
                              +{persona.themes.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td>{getStatusBadge(persona.status)}</td>
                      <td>
                        <div>
                          <small>📹 {persona.total_videos} videos</small><br/>
                          <small>👁️ {persona.total_views?.toLocaleString()} views</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEdit(persona)}
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant={persona.status === 'active' ? 'outline-warning' : 'outline-success'}
                            onClick={() => handleToggleStatus(persona.id, persona.status)}
                          >
                            {persona.status === 'active' ? '⏸️' : '▶️'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(persona.id)}
                          >
                            🗑️
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="analytics" title="📊 Analytics">
          <Row>
            {personas.map(persona => (
              <Col md={4} key={persona.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div 
                        className="rounded-circle bg-light d-flex align-items-center justify-content-center me-3"
                        style={{ width: '50px', height: '50px' }}
                      >
                        {persona.avatar_url ? (
                          <img 
                            src={persona.avatar_url} 
                            alt={persona.name}
                            className="rounded-circle"
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '24px' }}>👤</span>
                        )}
                      </div>
                      <div>
                        <h6 className="mb-0">{persona.name}</h6>
                        {getStatusBadge(persona.status)}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>Total Videos:</span>
                        <strong>{persona.total_videos}</strong>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>Total Views:</span>
                        <strong>{persona.total_views?.toLocaleString()}</strong>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>Avg Views/Video:</span>
                        <strong>{Math.round(persona.total_views / persona.total_videos).toLocaleString()}</strong>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="d-flex justify-content-between">
                        <span>Last Used:</span>
                        <small>{new Date(persona.last_used).toLocaleDateString()}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>

      {/* Add/Edit Persona Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPersona ? '✏️ Edit Persona' : '➕ Add New Persona'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Persona ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    placeholder="e.g., tech_guru_hindi"
                    required
                    disabled={editingPersona}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Display Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., TechShree"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                  >
                    <option value="Hindi-English (Hinglish)">Hindi-English (Hinglish)</option>
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Voice Type</Form.Label>
                  <Form.Select
                    name="voice_type"
                    value={formData.voice_type}
                    onChange={handleInputChange}
                  >
                    <option value="bark">Bark (High Quality)</option>
                    <option value="tortoise">Tortoise TTS</option>
                    <option value="gtts">Google TTS</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image Generation Prompt</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="prompt"
                value={formData.prompt}
                onChange={handleInputChange}
                placeholder="Describe the persona's appearance for AI image generation..."
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content Themes (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.themes.join(', ')}
                onChange={(e) => handleArrayInputChange('themes', e.target.value)}
                placeholder="e.g., gadget_reviews, ai_tips, coding_hacks"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Personality Traits (comma-separated)</Form.Label>
              <Form.Control
                type="text"
                value={formData.personality_traits.join(', ')}
                onChange={(e) => handleArrayInputChange('personality_traits', e.target.value)}
                placeholder="e.g., smart, calm, helpful"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Signature Phrases (comma-separated)</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={formData.signature_phrases.join(', ')}
                onChange={(e) => handleArrayInputChange('signature_phrases', e.target.value)}
                placeholder="e.g., Aaj ka tech secret..., Yeh feature bilkul next-level hai!"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : (editingPersona ? 'Update' : 'Create')} Persona
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PersonaManager;