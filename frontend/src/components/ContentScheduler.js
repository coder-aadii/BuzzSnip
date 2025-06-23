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
  Tab,
  Calendar
} from 'react-bootstrap';
import axios from 'axios';

const ContentScheduler = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [activeTab, setActiveTab] = useState('schedules');

  const [formData, setFormData] = useState({
    id: '',
    persona_id: '',
    name: '',
    frequency: 'daily',
    time: '12:00',
    days: [],
    platforms: ['youtube'],
    theme: '',
    duration: 30,
    auto_post: true,
    status: 'active',
    next_run: ''
  });

  // Mock personas for dropdown
  const personas = [
    { id: 'tech_guru_hindi', name: 'TechShree' },
    { id: 'fitness_coach', name: 'Aarohi FitAI' },
    { id: 'fashion_influencer', name: 'Ritika AI' }
  ];

  // Mock schedules data
  const mockSchedules = [
    {
      id: 'schedule_001',
      persona_id: 'tech_guru_hindi',
      persona_name: 'TechShree',
      name: 'Daily Tech Tips',
      frequency: 'daily',
      time: '14:00',
      days: [],
      platforms: ['youtube', 'instagram'],
      theme: 'ai_tips',
      duration: 30,
      auto_post: true,
      status: 'active',
      next_run: '2024-01-16T14:00:00Z',
      last_run: '2024-01-15T14:00:00Z',
      total_runs: 25,
      success_rate: 96
    },
    {
      id: 'schedule_002',
      persona_id: 'fitness_coach',
      persona_name: 'Aarohi FitAI',
      name: 'Weekly Workout',
      frequency: 'weekly',
      time: '08:00',
      days: ['monday', 'wednesday', 'friday'],
      platforms: ['instagram'],
      theme: 'workout_tips',
      duration: 25,
      auto_post: true,
      status: 'active',
      next_run: '2024-01-17T08:00:00Z',
      last_run: '2024-01-15T08:00:00Z',
      total_runs: 12,
      success_rate: 100
    },
    {
      id: 'schedule_003',
      persona_id: 'fashion_influencer',
      persona_name: 'Ritika AI',
      name: 'Fashion Friday',
      frequency: 'weekly',
      time: '16:00',
      days: ['friday'],
      platforms: ['youtube', 'instagram'],
      theme: 'fashion_trends',
      duration: 35,
      auto_post: false,
      status: 'paused',
      next_run: '2024-01-19T16:00:00Z',
      last_run: '2024-01-12T16:00:00Z',
      total_runs: 8,
      success_rate: 87.5
    }
  ];

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('http://localhost:5000/api/schedules');
      // setSchedules(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setSchedules(mockSchedules);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to fetch schedules' });
      setLoading(false);
    }
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
    } else if (name === 'days') {
      const days = [...formData.days];
      if (checked) {
        days.push(value);
      } else {
        const index = days.indexOf(value);
        if (index > -1) days.splice(index, 1);
      }
      setFormData({ ...formData, days });
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

    try {
      if (editingSchedule) {
        // Update existing schedule
        await axios.put(`http://localhost:5000/api/schedules/${editingSchedule.id}`, formData);
        setAlert({ show: true, type: 'success', message: 'Schedule updated successfully!' });
      } else {
        // Create new schedule
        await axios.post('http://localhost:5000/api/schedules', formData);
        setAlert({ show: true, type: 'success', message: 'Schedule created successfully!' });
      }
      
      setShowModal(false);
      setEditingSchedule(null);
      resetForm();
      fetchSchedules();
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to save schedule' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule(schedule);
    setFormData({
      ...schedule,
      days: schedule.days || [],
      platforms: schedule.platforms || []
    });
    setShowModal(true);
  };

  const handleDelete = async (scheduleId) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      try {
        await axios.delete(`http://localhost:5000/api/schedules/${scheduleId}`);
        setAlert({ show: true, type: 'success', message: 'Schedule deleted successfully!' });
        fetchSchedules();
      } catch (error) {
        setAlert({ show: true, type: 'danger', message: 'Failed to delete schedule' });
      }
    }
  };

  const handleToggleStatus = async (scheduleId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await axios.patch(`http://localhost:5000/api/schedules/${scheduleId}/status`, { status: newStatus });
      setAlert({ show: true, type: 'success', message: `Schedule ${newStatus}!` });
      fetchSchedules();
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to update schedule status' });
    }
  };

  const handleRunNow = async (scheduleId) => {
    try {
      await axios.post(`http://localhost:5000/api/schedules/${scheduleId}/run`);
      setAlert({ show: true, type: 'success', message: 'Schedule triggered successfully!' });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to run schedule' });
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      persona_id: '',
      name: '',
      frequency: 'daily',
      time: '12:00',
      days: [],
      platforms: ['youtube'],
      theme: '',
      duration: 30,
      auto_post: true,
      status: 'active',
      next_run: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      paused: 'warning',
      error: 'danger'
    };
    const icons = {
      active: '🟢',
      paused: '⏸️',
      error: '🔴'
    };
    return (
      <Badge bg={variants[status]}>
        {icons[status]} {status.toUpperCase()}
      </Badge>
    );
  };

  const getFrequencyText = (frequency, days) => {
    if (frequency === 'daily') return 'Daily';
    if (frequency === 'weekly') {
      if (days.length === 0) return 'Weekly';
      return `Weekly (${days.join(', ')})`;
    }
    return frequency;
  };

  const getPlatformBadges = (platforms) => {
    return platforms.map(platform => (
      <Badge key={platform} bg="secondary" className="me-1">
        {platform === 'youtube' ? '📺 YouTube' : '📸 Instagram'}
      </Badge>
    ));
  };

  if (loading && schedules.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading schedules...</p>
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
        <Tab eventKey="schedules" title="📅 All Schedules">
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">📅 Content Scheduling</h5>
              <Button 
                variant="primary" 
                onClick={() => {
                  resetForm();
                  setEditingSchedule(null);
                  setShowModal(true);
                }}
              >
                ➕ Add New Schedule
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Schedule Name</th>
                    <th>Persona</th>
                    <th>Frequency</th>
                    <th>Time</th>
                    <th>Platforms</th>
                    <th>Status</th>
                    <th>Next Run</th>
                    <th>Performance</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(schedule => (
                    <tr key={schedule.id}>
                      <td>
                        <div>
                          <div className="fw-bold">{schedule.name}</div>
                          <small className="text-muted">Theme: {schedule.theme}</small>
                        </div>
                      </td>
                      <td>
                        <Badge bg="info">{schedule.persona_name}</Badge>
                      </td>
                      <td>{getFrequencyText(schedule.frequency, schedule.days)}</td>
                      <td>{schedule.time}</td>
                      <td>{getPlatformBadges(schedule.platforms)}</td>
                      <td>{getStatusBadge(schedule.status)}</td>
                      <td>
                        <small>
                          {new Date(schedule.next_run).toLocaleString()}
                        </small>
                      </td>
                      <td>
                        <div>
                          <small>🎬 {schedule.total_runs} runs</small><br/>
                          <small>✅ {schedule.success_rate}% success</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button
                            size="sm"
                            variant="outline-success"
                            onClick={() => handleRunNow(schedule.id)}
                            title="Run Now"
                          >
                            ▶️
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => handleEdit(schedule)}
                            title="Edit"
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant={schedule.status === 'active' ? 'outline-warning' : 'outline-success'}
                            onClick={() => handleToggleStatus(schedule.id, schedule.status)}
                            title={schedule.status === 'active' ? 'Pause' : 'Resume'}
                          >
                            {schedule.status === 'active' ? '⏸️' : '▶️'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDelete(schedule.id)}
                            title="Delete"
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

        <Tab eventKey="calendar" title="📆 Calendar View">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">📆 Scheduled Content Calendar</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center py-5">
                <h4>📅 Calendar View</h4>
                <p className="text-muted">Visual calendar showing all scheduled content</p>
                <div className="row">
                  {schedules.filter(s => s.status === 'active').map(schedule => (
                    <div key={schedule.id} className="col-md-4 mb-3">
                      <Card className="border-start border-primary border-4">
                        <Card.Body>
                          <h6>{schedule.name}</h6>
                          <p className="mb-1">
                            <Badge bg="info">{schedule.persona_name}</Badge>
                          </p>
                          <p className="mb-1">
                            <small>⏰ {schedule.time} - {getFrequencyText(schedule.frequency, schedule.days)}</small>
                          </p>
                          <p className="mb-0">
                            <small>📅 Next: {new Date(schedule.next_run).toLocaleDateString()}</small>
                          </p>
                        </Card.Body>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="analytics" title="📊 Analytics">
          <Row>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h6>📊 Schedule Performance</h6>
                </Card.Header>
                <Card.Body>
                  {schedules.map(schedule => (
                    <div key={schedule.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span>{schedule.name}</span>
                        <Badge bg="info">{schedule.success_rate}%</Badge>
                      </div>
                      <div className="progress" style={{ height: '8px' }}>
                        <div 
                          className="progress-bar" 
                          style={{ width: `${schedule.success_rate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="mb-4">
                <Card.Header>
                  <h6>📈 Schedule Statistics</h6>
                </Card.Header>
                <Card.Body>
                  <div className="row text-center">
                    <div className="col-6">
                      <h3 className="text-primary">{schedules.length}</h3>
                      <p className="mb-0">Total Schedules</p>
                    </div>
                    <div className="col-6">
                      <h3 className="text-success">{schedules.filter(s => s.status === 'active').length}</h3>
                      <p className="mb-0">Active Schedules</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row text-center">
                    <div className="col-6">
                      <h3 className="text-info">{schedules.reduce((sum, s) => sum + s.total_runs, 0)}</h3>
                      <p className="mb-0">Total Runs</p>
                    </div>
                    <div className="col-6">
                      <h3 className="text-warning">
                        {Math.round(schedules.reduce((sum, s) => sum + s.success_rate, 0) / schedules.length)}%
                      </h3>
                      <p className="mb-0">Avg Success Rate</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Add/Edit Schedule Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingSchedule ? '✏️ Edit Schedule' : '➕ Add New Schedule'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Schedule Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Daily Tech Tips"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Persona</Form.Label>
                  <Form.Select
                    name="persona_id"
                    value={formData.persona_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Persona</option>
                    {personas.map(persona => (
                      <option key={persona.id} value={persona.id}>
                        {persona.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Frequency</Form.Label>
                  <Form.Select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleInputChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Time</Form.Label>
                  <Form.Control
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (seconds)</Form.Label>
                  <Form.Control
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    min="15"
                    max="60"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.frequency === 'weekly' && (
              <Form.Group className="mb-3">
                <Form.Label>Days of Week</Form.Label>
                <div>
                  {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                    <Form.Check
                      key={day}
                      inline
                      type="checkbox"
                      name="days"
                      value={day}
                      label={day.charAt(0).toUpperCase() + day.slice(1)}
                      checked={formData.days.includes(day)}
                      onChange={handleInputChange}
                    />
                  ))}
                </div>
              </Form.Group>
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

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Content Theme</Form.Label>
                  <Form.Control
                    type="text"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    placeholder="e.g., ai_tips, workout_tips"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="auto_post"
                label="🚀 Auto-post after generation"
                checked={formData.auto_post}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : (editingSchedule ? 'Update' : 'Create')} Schedule
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ContentScheduler;