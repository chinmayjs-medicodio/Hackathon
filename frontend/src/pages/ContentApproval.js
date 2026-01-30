import React, { useState, useEffect } from 'react';
import './ContentApproval.css';
import { getPendingContent, approveContent, editContent, deleteContent, regenerateContent, getClients } from '../services/api';
import BackButton from '../components/BackButton';
import WorkflowProgress from '../components/WorkflowProgress';
import { useToastContext } from '../context/ToastContext';

const ContentApproval = () => {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');
  const [regeneratingIds, setRegeneratingIds] = useState(new Set());
  const [clients, setClients] = useState([]);
  const [workflowStep, setWorkflowStep] = useState('approval');
  const [completedSteps, setCompletedSteps] = useState(['onboarding', 'generating']);
  const [postingItemId, setPostingItemId] = useState(null);
  const toast = useToastContext();

  useEffect(() => {
    loadContent();
    loadClients();
  }, [selectedClient]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getPendingContent(selectedClient);
      setContentItems(data.content || []);
    } catch (error) {
      console.error('Error loading content:', error);
      toast.error('Failed to load pending content');
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await getClients();
      setClients(data.clients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error('Failed to load clients');
    }
  };

  const handleApprove = async (itemId) => {
    try {
      // Step 1: Show approval step
      setWorkflowStep('approval');
      setCompletedSteps(['onboarding', 'generating']);
      
      // Step 2: Move to posting step
      setWorkflowStep('posting');
      setPostingItemId(itemId);
      setCompletedSteps(['onboarding', 'generating', 'approval']);
      
      toast.info('Approving content and posting to platforms...');
      
      // Step 3: Post to n8n
      await approveContent(itemId);
      
      // Step 4: Complete workflow
      setCompletedSteps(['onboarding', 'generating', 'approval', 'posting']);
      setPostingItemId(null);
      
      // Reload content
      await loadContent();
      
      // Show success message
      toast.success('✅ Content approved and posted successfully to all platforms!');
      
      // Reset workflow after 2 seconds
      setTimeout(() => {
        setWorkflowStep('approval');
        setCompletedSteps(['onboarding', 'generating']);
      }, 2000);
    } catch (error) {
      setPostingItemId(null);
      setWorkflowStep('approval');
      setCompletedSteps(['onboarding', 'generating']);
      toast.error('Error approving content: ' + error.message);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(itemId);
        await loadContent();
        toast.success('Content deleted successfully');
      } catch (error) {
        toast.error('Error deleting content: ' + error.message);
      }
    }
  };

  const handleRegenerate = async (itemId, platform, contentType) => {
    if (window.confirm(`Regenerate ${contentType} for ${platform}?`)) {
      try {
        setRegeneratingIds(prev => new Set(prev).add(itemId));
        toast.info(`Regenerating content for ${platform}...`);
        
        const result = await regenerateContent(itemId, platform, contentType);
        await loadContent();
        
        setRegeneratingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        
        toast.success('Content regenerated successfully!');
      } catch (error) {
        setRegeneratingIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
        toast.error('Error regenerating content: ' + error.message);
      }
    }
  };

  const handleEdit = async (itemId) => {
    if (editingId === itemId) {
      // Save edit
      try {
        await editContent(itemId, editText);
        setEditingId(null);
        setEditText('');
        await loadContent();
        toast.success('Content updated successfully');
      } catch (error) {
        toast.error('Error saving edit: ' + error.message);
      }
    } else {
      // Start editing
      const item = contentItems.find(c => c.id === itemId);
      setEditingId(itemId);
      setEditText(item.content);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      'LinkedIn': '💼',
      'Twitter': '🐦',
      'Instagram': '📷',
      'Facebook': '👥',
      'Reddit': '🤖',
      'Email': '📧',
      'Website': '🌐',
      'YouTube': '📺'
    };
    return icons[platform] || '📱';
  };

  const getContentTypeIcon = (type) => {
    const icons = {
      'post': '📝',
      'blog': '📄',
      'newsletter': '📰',
      'ad_copy': '📢',
      'video_script': '🎬'
    };
    return icons[type] || '📄';
  };

  if (loading) {
    return (
      <div className="content-approval-page">
        <div className="container">
          <div className="loading">Loading content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="content-approval-page">
      <div className="container-wide">
        <BackButton />
        <WorkflowProgress 
          currentStep={workflowStep} 
          completedSteps={completedSteps}
        />
        <div className="page-header">
          <h1>Content Approval</h1>
          <p>Review and approve AI-generated content before publishing</p>
        </div>

        <div className="filters">
          <select 
            value={selectedClient} 
            onChange={(e) => setSelectedClient(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Clients</option>
            {clients.map((client) => (
              <option key={client.client_id} value={client.client_id}>
                {client.company_name} ({client.client_id})
              </option>
            ))}
          </select>
        </div>

        {contentItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No Pending Content</h3>
            <p>All content has been reviewed and approved.</p>
          </div>
        ) : (
          <div className="content-grid">
            {contentItems.map((item) => (
              <div key={item.id} className={`content-card ${regeneratingIds.has(item.id) ? 'regenerating' : ''} ${postingItemId === item.id ? 'posting' : ''}`}>
                {regeneratingIds.has(item.id) && (
                  <div className="content-loading-overlay">
                    <div className="content-spinner">
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                    </div>
                    <p>Regenerating content...</p>
                  </div>
                )}
                {postingItemId === item.id && (
                  <div className="content-loading-overlay posting-overlay">
                    <div className="content-spinner">
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                      <div className="spinner-ring"></div>
                    </div>
                    <p>📤 Posting to platforms...</p>
                  </div>
                )}
                <div className="content-header">
                  <div className="content-meta">
                    <span className="platform-badge">
                      {getPlatformIcon(item.platform)} {item.platform}
                    </span>
                    <span className="content-type-badge">
                      {getContentTypeIcon(item.content_type)} {item.content_type.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="content-client">
                    <strong>{item.client_name}</strong>
                  </div>
                </div>

                <div className="content-body">
                  {/* Display uploaded images */}
                  {item.uploaded_images && item.uploaded_images.length > 0 && (
                    <div className="content-images-section">
                      <div className="images-section-header">
                        <span className="images-section-title">📎 Uploaded Images</span>
                      </div>
                      <div className="uploaded-images-grid">
                        {item.uploaded_images.map((imgUrl, idx) => (
                          <div key={idx} className="content-image-container uploaded-image">
                            <img 
                              src={`http://localhost:8000${imgUrl}`}
                              alt={`Uploaded image ${idx + 1} for ${item.platform}`}
                              className="content-image"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                            <div className="image-badge uploaded-badge">📎 Uploaded</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Display AI generated image */}
                  {item.generated_image_url && (
                    <div className="content-images-section">
                      <div className="images-section-header">
                        <span className="images-section-title">🎨 AI Generated Image</span>
                      </div>
                      <div className="content-image-container generated-image">
                        <img 
                          src={item.generated_image_url} 
                          alt={`Generated image for ${item.platform}`}
                          className="content-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <div className="image-badge generated-badge">🎨 AI Generated</div>
                      </div>
                    </div>
                  )}
                  
                  {editingId === item.id ? (
                    <textarea
                      className="edit-textarea"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows="6"
                    />
                  ) : (
                    <div className="content-text">{item.content}</div>
                  )}
                </div>

                <div className="content-footer">
                  <div className="content-stats">
                    <span>Generated: {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="content-actions">
                    {editingId === item.id ? (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleEdit(item.id)}
                        >
                          Save
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handleApprove(item.id)}
                        >
                          ✓ Approve
                        </button>
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(item.id)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn btn-warning btn-sm"
                          onClick={() => handleRegenerate(item.id, item.platform, item.content_type)}
                          disabled={regeneratingIds.has(item.id)}
                        >
                          {regeneratingIds.has(item.id) ? '⏳ Regenerating...' : '🔄 Regenerate'}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentApproval;
