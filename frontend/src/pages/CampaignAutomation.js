import React, { useState, useEffect } from 'react';
import './CampaignAutomation.css';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../services/api';
import BackButton from '../components/BackButton';
import { useToastContext } from '../context/ToastContext';

const CampaignAutomation = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const toast = useToastContext();
  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    platform: '',
    budget: '',
    start_date: '',
    end_date: '',
    target_audience: '',
    ad_type: 'display'
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await getCampaigns();
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCampaign(formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        client_id: '',
        platform: '',
        budget: '',
        start_date: '',
        end_date: '',
        target_audience: '',
        ad_type: 'display'
      });
      await loadCampaigns();
      toast.success('Campaign created successfully!');
    } catch (error) {
      toast.error('Error creating campaign: ' + error.message);
    }
  };

  const handleDelete = async (campaignId) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(campaignId);
        await loadCampaigns();
        toast.success('Campaign deleted successfully');
      } catch (error) {
        toast.error('Error deleting campaign: ' + error.message);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'active': { class: 'status-active', label: 'Active' },
      'paused': { class: 'status-paused', label: 'Paused' },
      'completed': { class: 'status-completed', label: 'Completed' },
      'draft': { class: 'status-draft', label: 'Draft' }
    };
    const badge = badges[status] || badges['draft'];
    return <span className={`status-badge ${badge.class}`}>{badge.label}</span>;
  };

  if (loading) {
    return (
      <div className="campaign-automation-page">
        <div className="container-wide">
          <div className="loading">Loading campaigns...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="campaign-automation-page">
      <div className="container-wide">
        <BackButton />
        <div className="page-header">
          <div>
            <h1>Ads & Campaign Automation</h1>
            <p>Create, manage, and optimize your ad campaigns with AI-powered automation</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            + Create Campaign
          </button>
        </div>

        {campaigns.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>No Campaigns Yet</h3>
            <p>Create your first campaign to get started with automated advertising.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              Create Campaign
            </button>
          </div>
        ) : (
          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-header">
                  <div>
                    <h3>{campaign.name}</h3>
                    <p className="campaign-client">{campaign.client_name}</p>
                  </div>
                  {getStatusBadge(campaign.status)}
                </div>

                <div className="campaign-details">
                  <div className="detail-item">
                    <span className="detail-label">Platform:</span>
                    <span className="detail-value">{campaign.platform}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Budget:</span>
                    <span className="detail-value">${campaign.budget}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">
                      {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Impressions:</span>
                    <span className="detail-value">{campaign.impressions?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Clicks:</span>
                    <span className="detail-value">{campaign.clicks?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">CTR:</span>
                    <span className="detail-value">{campaign.ctr || '0'}%</span>
                  </div>
                </div>

                <div className="campaign-actions">
                  <button className="btn btn-secondary btn-sm">View Details</button>
                  <button className="btn btn-warning btn-sm">Edit</button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(campaign.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Campaign Modal */}
        {showCreateModal && (
          <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create New Campaign</h2>
                <button 
                  className="modal-close"
                  onClick={() => setShowCreateModal(false)}
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleCreate} className="modal-form">
                <div className="form-group">
                  <label>Campaign Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Client *</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData({...formData, client_id: e.target.value})}
                    required
                  >
                    <option value="">Select client</option>
                    <option value="CLIENT_0001">Client 1</option>
                    <option value="CLIENT_0002">Client 2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Platform *</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    required
                  >
                    <option value="">Select platform</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Google Ads">Google Ads</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Budget ($) *</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    required
                    min="0"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Target Audience</label>
                  <textarea
                    value={formData.target_audience}
                    onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
                    rows="3"
                    placeholder="Describe your target audience"
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Campaign
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignAutomation;
