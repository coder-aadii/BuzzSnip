import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Row, 
  Col, 
  Form,
  Alert,
  Badge,
  Table,
  Spinner,
  Tabs,
  Tab,
  ProgressBar,
  Modal
} from 'react-bootstrap';
import axios from 'axios';

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [activeTab, setActiveTab] = useState('general');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');

  const [settings, setSettings] = useState({
    general: {
      app_name: 'BuzzSnip',
      app_version: '1.0.0',
      max_video_duration: 60,
      default_resolution: '1080p',
      auto_cleanup_days: 30,
      max_concurrent_jobs: 3
    },
    ai_models: {
      stable_diffusion_model: 'realistic-vision-v5',
      voice_model: 'bark',
      lip_sync_model: 'sadtalker',
      upscaling_model: 'real-esrgan',
      llm_model: 'tinyllama'
    },
    social_media: {
      youtube_api_key: '••••••••••••••••',
      instagram_username: '••••••••••••••••',
      auto_upload_enabled: true,
      max_upload_retries: 3,
      upload_timeout: 300
    },
    storage: {
      output_directory: '/app/output',
      temp_directory: '/app/temp',
      models_directory: '/app/models',
      max_storage_gb: 100,
      auto_cleanup_enabled: true
    }
  });

  const [systemStatus, setSystemStatus] = useState({
    cpu_usage: 45,
    memory_usage: 62,
    gpu_usage: 78,
    disk_usage: 34,
    active_jobs: 2,
    queue_length: 5,
    uptime: '2 days, 14 hours',
    last_backup: '2024-01-15T10:30:00Z'
  });

  const [modelStatus, setModelStatus] = useState([
    { name: 'Stable Diffusion', status: 'loaded', size: '4.2 GB', last_used: '2024-01-15T14:30:00Z' },
    { name: 'Bark TTS', status: 'loaded', size: '2.8 GB', last_used: '2024-01-15T14:25:00Z' },
    { name: 'SadTalker', status: 'loaded', size: '1.5 GB', last_used: '2024-01-15T14:20:00Z' },
    { name: 'Real-ESRGAN', status: 'unloaded', size: '67 MB', last_used: '2024-01-14T16:45:00Z' },
    { name: 'TinyLlama', status: 'loaded', size: '2.2 GB', last_used: '2024-01-15T14:35:00Z' }
  ]);

  useEffect(() => {
    fetchSettings();
    fetchSystemStatus();
  }, []);

  const fetchSettings = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('http://localhost:5000/api/admin/settings');
      // setSettings(response.data);
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to fetch settings' });
    }
  };

  const fetchSystemStatus = async () => {
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('http://localhost:5000/api/admin/status');
      // setSystemStatus(response.data);
    } catch (error) {
      console.error('Failed to fetch system status');
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async (category) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/admin/settings/${category}`, settings[category]);
      setAlert({ show: true, type: 'success', message: `${category} settings saved successfully!` });
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to save settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleModelAction = async (modelName, action) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:5000/api/admin/models/${modelName}/${action}`);
      setAlert({ show: true, type: 'success', message: `Model ${action} successful!` });
      // Refresh model status
      fetchSystemStatus();
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: `Failed to ${action} model` });
    } finally {
      setLoading(false);
    }
  };

  const handleSystemAction = async (action) => {
    if (window.confirm(`Are you sure you want to ${action} the system?`)) {
      setLoading(true);
      try {
        await axios.post(`http://localhost:5000/api/admin/system/${action}`);
        setAlert({ show: true, type: 'success', message: `System ${action} initiated!` });
      } catch (error) {
        setAlert({ show: true, type: 'danger', message: `Failed to ${action} system` });
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      loaded: 'success',
      unloaded: 'secondary',
      loading: 'warning',
      error: 'danger'
    };
    return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getUsageColor = (usage) => {
    if (usage < 50) return 'success';
    if (usage < 80) return 'warning';
    return 'danger';
  };

  return (
    <div>
      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false })}>
          {alert.message}
        </Alert>
      )}

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-4">
        <Tab eventKey="general" title="⚙️ General">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">⚙️ General Settings</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Application Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.general.app_name}
                        onChange={(e) => handleSettingChange('general', 'app_name', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Version</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.general.app_version}
                        disabled
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Video Duration (seconds)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.general.max_video_duration}
                        onChange={(e) => handleSettingChange('general', 'max_video_duration', parseInt(e.target.value))}
                        min="15"
                        max="300"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Default Resolution</Form.Label>
                      <Form.Select
                        value={settings.general.default_resolution}
                        onChange={(e) => handleSettingChange('general', 'default_resolution', e.target.value)}
                      >
                        <option value="720p">720p (HD)</option>
                        <option value="1080p">1080p (Full HD)</option>
                        <option value="4k">4K (Ultra HD)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Auto Cleanup (days)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.general.auto_cleanup_days}
                        onChange={(e) => handleSettingChange('general', 'auto_cleanup_days', parseInt(e.target.value))}
                        min="1"
                        max="365"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Concurrent Jobs</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.general.max_concurrent_jobs}
                        onChange={(e) => handleSettingChange('general', 'max_concurrent_jobs', parseInt(e.target.value))}
                        min="1"
                        max="10"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Button 
                  variant="primary" 
                  onClick={() => handleSaveSettings('general')}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Save General Settings'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="ai_models" title="🤖 AI Models">
          <Row>
            <Col md={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">🤖 AI Model Configuration</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Stable Diffusion Model</Form.Label>
                      <Form.Select
                        value={settings.ai_models.stable_diffusion_model}
                        onChange={(e) => handleSettingChange('ai_models', 'stable_diffusion_model', e.target.value)}
                      >
                        <option value="realistic-vision-v5">Realistic Vision v5.0</option>
                        <option value="dreamshaper">DreamShaper</option>
                        <option value="deliberate">Deliberate</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Voice Synthesis Model</Form.Label>
                      <Form.Select
                        value={settings.ai_models.voice_model}
                        onChange={(e) => handleSettingChange('ai_models', 'voice_model', e.target.value)}
                      >
                        <option value="bark">Bark (High Quality)</option>
                        <option value="tortoise">Tortoise TTS</option>
                        <option value="gtts">Google TTS</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Lip Sync Model</Form.Label>
                      <Form.Select
                        value={settings.ai_models.lip_sync_model}
                        onChange={(e) => handleSettingChange('ai_models', 'lip_sync_model', e.target.value)}
                      >
                        <option value="sadtalker">SadTalker</option>
                        <option value="wav2lip">Wav2Lip</option>
                      </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Upscaling Model</Form.Label>
                      <Form.Select
                        value={settings.ai_models.upscaling_model}
                        onChange={(e) => handleSettingChange('ai_models', 'upscaling_model', e.target.value)}
                      >
                        <option value="real-esrgan">Real-ESRGAN</option>
                        <option value="codeformer">CodeFormer</option>
                      </Form.Select>
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      onClick={() => handleSaveSettings('ai_models')}
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" size="sm" /> : 'Save AI Model Settings'}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">📊 Model Status</h6>
                </Card.Header>
                <Card.Body className="p-0">
                  <Table size="sm" className="mb-0">
                    <tbody>
                      {modelStatus.map((model, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <small className="fw-bold">{model.name}</small><br/>
                              <small className="text-muted">{model.size}</small>
                            </div>
                          </td>
                          <td>{getStatusBadge(model.status)}</td>
                          <td>
                            <Button
                              size="sm"
                              variant={model.status === 'loaded' ? 'outline-warning' : 'outline-success'}
                              onClick={() => handleModelAction(model.name, model.status === 'loaded' ? 'unload' : 'load')}
                            >
                              {model.status === 'loaded' ? '⏹️' : '▶️'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="social_media" title="📱 Social Media">
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">📱 Social Media Integration</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>YouTube API Key</Form.Label>
                  <Form.Control
                    type="password"
                    value={settings.social_media.youtube_api_key}
                    onChange={(e) => handleSettingChange('social_media', 'youtube_api_key', e.target.value)}
                    placeholder="Enter YouTube API key"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Instagram Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings.social_media.instagram_username}
                    onChange={(e) => handleSettingChange('social_media', 'instagram_username', e.target.value)}
                    placeholder="Enter Instagram username"
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Max Upload Retries</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.social_media.max_upload_retries}
                        onChange={(e) => handleSettingChange('social_media', 'max_upload_retries', parseInt(e.target.value))}
                        min="1"
                        max="10"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Upload Timeout (seconds)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.social_media.upload_timeout}
                        onChange={(e) => handleSettingChange('social_media', 'upload_timeout', parseInt(e.target.value))}
                        min="60"
                        max="1800"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Enable Auto Upload"
                    checked={settings.social_media.auto_upload_enabled}
                    onChange={(e) => handleSettingChange('social_media', 'auto_upload_enabled', e.target.checked)}
                  />
                </Form.Group>

                <Button 
                  variant="primary" 
                  onClick={() => handleSaveSettings('social_media')}
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" size="sm" /> : 'Save Social Media Settings'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="system" title="🖥️ System">
          <Row>
            <Col md={8}>
              <Card className="shadow-sm mb-4">
                <Card.Header>
                  <h5 className="mb-0">🖥️ System Status</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>CPU Usage</span>
                          <span>{systemStatus.cpu_usage}%</span>
                        </div>
                        <ProgressBar now={systemStatus.cpu_usage} variant={getUsageColor(systemStatus.cpu_usage)} />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Memory Usage</span>
                          <span>{systemStatus.memory_usage}%</span>
                        </div>
                        <ProgressBar now={systemStatus.memory_usage} variant={getUsageColor(systemStatus.memory_usage)} />
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>GPU Usage</span>
                          <span>{systemStatus.gpu_usage}%</span>
                        </div>
                        <ProgressBar now={systemStatus.gpu_usage} variant={getUsageColor(systemStatus.gpu_usage)} />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-3">
                        <div className="d-flex justify-content-between mb-1">
                          <span>Disk Usage</span>
                          <span>{systemStatus.disk_usage}%</span>
                        </div>
                        <ProgressBar now={systemStatus.disk_usage} variant={getUsageColor(systemStatus.disk_usage)} />
                      </div>
                    </Col>
                  </Row>

                  <Row className="text-center">
                    <Col md={3}>
                      <h4 className="text-primary">{systemStatus.active_jobs}</h4>
                      <p className="mb-0">Active Jobs</p>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-warning">{systemStatus.queue_length}</h4>
                      <p className="mb-0">Queue Length</p>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-success">{systemStatus.uptime}</h4>
                      <p className="mb-0">Uptime</p>
                    </Col>
                    <Col md={3}>
                      <h4 className="text-info">
                        {new Date(systemStatus.last_backup).toLocaleDateString()}
                      </h4>
                      <p className="mb-0">Last Backup</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header>
                  <h5 className="mb-0">🔧 System Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button 
                      variant="outline-primary"
                      onClick={() => handleSystemAction('restart')}
                    >
                      🔄 Restart System
                    </Button>
                    <Button 
                      variant="outline-warning"
                      onClick={() => handleSystemAction('backup')}
                    >
                      💾 Create Backup
                    </Button>
                    <Button 
                      variant="outline-info"
                      onClick={() => handleSystemAction('cleanup')}
                    >
                      🧹 Cleanup Files
                    </Button>
                    <Button 
                      variant="outline-success"
                      onClick={() => handleSystemAction('update')}
                    >
                      ⬆️ Check Updates
                    </Button>
                    <Button 
                      variant="outline-secondary"
                      onClick={() => handleSystemAction('logs')}
                    >
                      📋 View Logs
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">📁 Storage Settings</h6>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Output Directory</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.storage.output_directory}
                        onChange={(e) => handleSettingChange('storage', 'output_directory', e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Max Storage (GB)</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.storage.max_storage_gb}
                        onChange={(e) => handleSettingChange('storage', 'max_storage_gb', parseInt(e.target.value))}
                        min="10"
                        max="1000"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Auto Cleanup Enabled"
                        checked={settings.storage.auto_cleanup_enabled}
                        onChange={(e) => handleSettingChange('storage', 'auto_cleanup_enabled', e.target.checked)}
                      />
                    </Form.Group>

                    <Button 
                      variant="primary" 
                      size="sm"
                      onClick={() => handleSaveSettings('storage')}
                      disabled={loading}
                    >
                      Save Storage Settings
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminSettings;