import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Badge, 
  Button, 
  Row, 
  Col, 
  Form,
  Modal,
  Alert,
  Spinner
} from 'react-bootstrap';
import axios from 'axios';

const PostHistory = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Mock data for demonstration
  const mockPosts = [
    {
      id: 'post_001',
      title: 'Latest AI Gadgets Review',
      persona: 'TechShree',
      status: 'completed',
      platforms: ['youtube', 'instagram'],
      created_at: '2024-01-15T10:30:00Z',
      duration: 30,
      views: { youtube: 1250, instagram: 890 },
      engagement: { likes: 156, comments: 23, shares: 12 },
      thumbnail: '/api/thumbnails/post_001.jpg',
      video_url: '/api/videos/post_001.mp4'
    },
    {
      id: 'post_002',
      title: 'Coding Hacks for Beginners',
      persona: 'TechShree',
      status: 'processing',
      platforms: ['youtube'],
      created_at: '2024-01-15T14:20:00Z',
      duration: 25,
      progress: 75
    },
    {
      id: 'post_003',
      title: 'Morning Workout Routine',
      persona: 'Aarohi FitAI',
      status: 'failed',
      platforms: ['instagram'],
      created_at: '2024-01-14T08:15:00Z',
      duration: 20,
      error: 'Voice generation failed'
    },
    {
      id: 'post_004',
      title: 'Fashion Trends 2024',
      persona: 'Ritika AI',
      status: 'scheduled',
      platforms: ['youtube', 'instagram'],
      created_at: '2024-01-16T16:00:00Z',
      scheduled_for: '2024-01-17T12:00:00Z',
      duration: 35
    }
  ];

  useEffect(() => {
    fetchPosts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      // const response = await axios.get('http://localhost:5000/api/posts');
      // setPosts(response.data);
      
      // Using mock data for now
      setTimeout(() => {
        setPosts(mockPosts);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to fetch posts' });
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      completed: 'success',
      processing: 'primary',
      failed: 'danger',
      scheduled: 'warning'
    };
    return <Badge bg={variants[status]}>{status.toUpperCase()}</Badge>;
  };

  const getPlatformBadges = (platforms) => {
    return platforms.map(platform => (
      <Badge key={platform} bg="secondary" className="me-1">
        {platform === 'youtube' ? '📺 YouTube' : '📸 Instagram'}
      </Badge>
    ));
  };

  const filteredPosts = posts.filter(post => {
    if (filter === 'all') return true;
    return post.status === filter;
  });

  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleRetry = async (postId) => {
    try {
      await axios.post(`http://localhost:5000/api/posts/${postId}/retry`);
      setAlert({ show: true, type: 'success', message: 'Post retry initiated' });
      fetchPosts();
    } catch (error) {
      setAlert({ show: true, type: 'danger', message: 'Failed to retry post' });
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${postId}`);
        setAlert({ show: true, type: 'success', message: 'Post deleted successfully' });
        fetchPosts();
      } catch (error) {
        setAlert({ show: true, type: 'danger', message: 'Failed to delete post' });
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTotalStats = () => {
    const completed = posts.filter(p => p.status === 'completed');
    const totalViews = completed.reduce((sum, post) => {
      return sum + (post.views?.youtube || 0) + (post.views?.instagram || 0);
    }, 0);
    const totalEngagement = completed.reduce((sum, post) => {
      return sum + (post.engagement?.likes || 0) + (post.engagement?.comments || 0) + (post.engagement?.shares || 0);
    }, 0);
    
    return { totalViews, totalEngagement, completedPosts: completed.length };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
        <p className="mt-2">Loading post history...</p>
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

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{posts.length}</h3>
              <p className="mb-0">Total Posts</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.totalViews.toLocaleString()}</h3>
              <p className="mb-0">Total Views</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{stats.totalEngagement}</h3>
              <p className="mb-0">Total Engagement</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">📊 Post History</h5>
          <div className="d-flex gap-2">
            <Form.Select
              size="sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="all">All Posts</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
              <option value="scheduled">Scheduled</option>
            </Form.Select>
            <Button size="sm" variant="outline-primary" onClick={fetchPosts}>
              🔄 Refresh
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-5">
              <p className="text-muted">No posts found</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Persona</th>
                  <th>Status</th>
                  <th>Platforms</th>
                  <th>Created</th>
                  <th>Duration</th>
                  <th>Performance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {post.thumbnail && (
                          <img 
                            src={post.thumbnail} 
                            alt="Thumbnail" 
                            className="me-2 rounded"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        )}
                        <div>
                          <div className="fw-bold">{post.title}</div>
                          <small className="text-muted">ID: {post.id}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge bg="info">{post.persona}</Badge>
                    </td>
                    <td>
                      {getStatusBadge(post.status)}
                      {post.status === 'processing' && post.progress && (
                        <div className="mt-1">
                          <small>{post.progress}%</small>
                        </div>
                      )}
                    </td>
                    <td>{getPlatformBadges(post.platforms)}</td>
                    <td>
                      <small>{formatDate(post.created_at)}</small>
                      {post.scheduled_for && (
                        <div>
                          <small className="text-warning">
                            📅 {formatDate(post.scheduled_for)}
                          </small>
                        </div>
                      )}
                    </td>
                    <td>{post.duration}s</td>
                    <td>
                      {post.views ? (
                        <div>
                          <small>
                            👁️ {(post.views.youtube || 0) + (post.views.instagram || 0)}
                          </small>
                          {post.engagement && (
                            <div>
                              <small>
                                ❤️ {post.engagement.likes} 
                                💬 {post.engagement.comments}
                              </small>
                            </div>
                          )}
                        </div>
                      ) : (
                        <small className="text-muted">-</small>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleViewDetails(post)}
                        >
                          👁️
                        </Button>
                        {post.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="outline-warning"
                            onClick={() => handleRetry(post.id)}
                          >
                            🔄
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(post.id)}
                        >
                          🗑️
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Post Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Post Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Basic Information</h6>
                  <p><strong>Title:</strong> {selectedPost.title}</p>
                  <p><strong>Persona:</strong> {selectedPost.persona}</p>
                  <p><strong>Status:</strong> {getStatusBadge(selectedPost.status)}</p>
                  <p><strong>Duration:</strong> {selectedPost.duration} seconds</p>
                  <p><strong>Platforms:</strong> {getPlatformBadges(selectedPost.platforms)}</p>
                </Col>
                <Col md={6}>
                  <h6>Performance Metrics</h6>
                  {selectedPost.views ? (
                    <div>
                      <p><strong>YouTube Views:</strong> {selectedPost.views.youtube || 0}</p>
                      <p><strong>Instagram Views:</strong> {selectedPost.views.instagram || 0}</p>
                      {selectedPost.engagement && (
                        <div>
                          <p><strong>Likes:</strong> {selectedPost.engagement.likes}</p>
                          <p><strong>Comments:</strong> {selectedPost.engagement.comments}</p>
                          <p><strong>Shares:</strong> {selectedPost.engagement.shares}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-muted">No performance data available</p>
                  )}
                </Col>
              </Row>
              
              {selectedPost.error && (
                <Alert variant="danger">
                  <strong>Error:</strong> {selectedPost.error}
                </Alert>
              )}
              
              {selectedPost.video_url && (
                <div className="mt-3">
                  <h6>Video Preview</h6>
                  <video controls width="100%" style={{ maxHeight: '300px' }}>
                    <source src={selectedPost.video_url} type="video/mp4" />
                  </video>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PostHistory;