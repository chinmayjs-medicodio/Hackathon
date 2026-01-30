import React, { useState, useEffect } from 'react';
import './ContentApproval.css';
import { getPendingContent, approveContent, editContent, deleteContent, regenerateContent } from '../services/api';

const ContentApproval = () => {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [selectedClient, setSelectedClient] = useState('all');

  useEffect(() => {
    loadContent();
  }, [selectedClient]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await getPendingContent(selectedClient);
      setContentItems(data.content || []);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      await approveContent(itemId);
      await loadContent();
    } catch (error) {
      alert('Error approving content: ' + error.message);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(itemId);
        await loadContent();
      } catch (error) {
        alert('Error deleting content: ' + error.message);
      }
    }
  };

  const handleRegenerate = async (itemId, platform, contentType) => {
    if (window.confirm(`Regenerate ${contentType} for ${platform}?`)) {
      try {
        await regenerateContent(itemId, platform, contentType);
        await loadContent();
      } catch (error) {
        alert('Error regenerating content: ' + error.message);
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
      } catch (error) {
        alert('Error saving edit: ' + error.message);
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
            <option value="CLIENT_0001">Client 1</option>
            <option value="CLIENT_0002">Client 2</option>
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
              <div key={item.id} className="content-card">
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
                        >
                          🔄 Regenerate
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
