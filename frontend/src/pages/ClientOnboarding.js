import React, { useState, useEffect } from 'react';
import './ClientOnboarding.css';
import { onboardClient, healthCheck } from '../services/api';

const ClientOnboarding = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    industry: '',
    brand_tone: '',
    target_audience: '',
    website_url: '',
    social_media_handles: '',
    marketing_goals: '',
    content_preferences: '',
    budget_range: '',
    past_examples: '',
    texts: '',
    primary_channels: []
  });

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Health check on component mount
    healthCheck().catch(err => {
      console.warn('Backend not reachable. Make sure the server is running on http://localhost:8000');
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChannelChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const channels = prev.primary_channels || [];
      if (checked) {
        return { ...prev, primary_channels: [...channels, value] };
      } else {
        return { ...prev, primary_channels: channels.filter(ch => ch !== value) };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map(file => ({
      name: file.name,
      size: formatFileSize(file.size)
    })));
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setVideos(files);
    setVideoPreviews(files.map(file => ({
      name: file.name,
      size: formatFileSize(file.size)
    })));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await onboardClient(formData, images, videos);
      setSuccessData(result.data);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to onboard client. Please try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      company_name: '',
      industry: '',
      brand_tone: '',
      target_audience: '',
      website_url: '',
      social_media_handles: '',
      marketing_goals: '',
      content_preferences: '',
      budget_range: '',
      past_examples: '',
      texts: '',
      primary_channels: []
    });
    setImages([]);
    setVideos([]);
    setImagePreviews([]);
    setVideoPreviews([]);
    setSuccess(false);
    setSuccessData(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (success) {
    return (
      <div className="client-onboarding-page">
        <div className="container">
          <div className="onboarding-card">
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Onboarding Successful!</h3>
              <p>
                Client "{successData.company_name}" has been successfully onboarded!<br />
                Client ID: {successData.client_id}
              </p>
              <button onClick={handleReset} className="reset-btn">
                Onboard Another Client
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="client-onboarding-page">
      <div className="container">
        <div className="onboarding-card">
      <div className="card-header">
        <h2>Client Onboarding</h2>
        <p>Tell us about your brand to get started with AI-powered marketing automation</p>
      </div>

      {error && (
        <div className="error-message">
          <p>⚠️ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="onboarding-form">
        {/* Basic Information Section */}
        <section className="form-section">
          <h3 className="section-title">Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="company_name">
              Company Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              required
              placeholder="Enter your company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="industry">
              Industry <span className="required">*</span>
            </label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              required
            >
              <option value="">Select your industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Finance">Finance</option>
              <option value="E-commerce">E-commerce</option>
              <option value="Education">Education</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Fashion">Fashion</option>
              <option value="Travel & Tourism">Travel & Tourism</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="website_url">Website URL</label>
            <input
              type="url"
              id="website_url"
              name="website_url"
              value={formData.website_url}
              onChange={handleInputChange}
              placeholder="https://www.example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="social_media_handles">Social Media Handles</label>
            <input
              type="text"
              id="social_media_handles"
              name="social_media_handles"
              value={formData.social_media_handles}
              onChange={handleInputChange}
              placeholder="e.g., @companyname (Instagram, Twitter, LinkedIn)"
            />
          </div>
        </section>

        {/* Brand Identity Section */}
        <section className="form-section">
          <h3 className="section-title">Brand Identity</h3>
          
          <div className="form-group">
            <label htmlFor="brand_tone">
              Brand Tone <span className="required">*</span>
            </label>
            <select
              id="brand_tone"
              name="brand_tone"
              value={formData.brand_tone}
              onChange={handleInputChange}
              required
            >
              <option value="">Select brand tone</option>
              <option value="Professional & Formal">Professional & Formal</option>
              <option value="Friendly & Casual">Friendly & Casual</option>
              <option value="Creative & Playful">Creative & Playful</option>
              <option value="Authoritative & Expert">Authoritative & Expert</option>
              <option value="Inspirational & Motivational">Inspirational & Motivational</option>
              <option value="Humorous & Witty">Humorous & Witty</option>
              <option value="Luxury & Premium">Luxury & Premium</option>
              <option value="Eco-friendly & Sustainable">Eco-friendly & Sustainable</option>
            </select>
            <small className="form-hint">
              This helps AI generate content that matches your brand voice
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="target_audience">
              Target Audience <span className="required">*</span>
            </label>
            <textarea
              id="target_audience"
              name="target_audience"
              value={formData.target_audience}
              onChange={handleInputChange}
              rows="4"
              required
              placeholder="Describe your target audience (e.g., Age, demographics, interests, pain points)"
            />
          </div>

          <div className="form-group">
            <label htmlFor="marketing_goals">Marketing Goals</label>
            <textarea
              id="marketing_goals"
              name="marketing_goals"
              value={formData.marketing_goals}
              onChange={handleInputChange}
              rows="3"
              placeholder="What are your primary marketing objectives? (e.g., Brand awareness, Lead generation, Sales)"
            />
          </div>
        </section>

        {/* Content Preferences Section */}
        <section className="form-section">
          <h3 className="section-title">Content Preferences</h3>
          
          <div className="form-group">
            <label htmlFor="content_preferences">Content Preferences</label>
            <textarea
              id="content_preferences"
              name="content_preferences"
              value={formData.content_preferences}
              onChange={handleInputChange}
              rows="3"
              placeholder="What type of content do you prefer? (e.g., Educational, Promotional, Storytelling)"
            />
          </div>

          <div className="form-group">
            <label>Primary Marketing Channels</label>
            <div className="checkbox-group">
              {['LinkedIn', 'Twitter', 'Instagram', 'Facebook', 'Email', 'Website', 'YouTube'].map(channel => (
                <label key={channel} className="checkbox-label">
                  <input
                    type="checkbox"
                    value={channel}
                    checked={formData.primary_channels.includes(channel)}
                    onChange={handleChannelChange}
                  />
                  <span>{channel === 'Email' ? 'Email Newsletter' : channel === 'Website' ? 'Website/Blog' : channel}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="budget_range">Budget Range</label>
            <select
              id="budget_range"
              name="budget_range"
              value={formData.budget_range}
              onChange={handleInputChange}
            >
              <option value="">Select budget range</option>
              <option value="Under $1,000/month">Under $1,000/month</option>
              <option value="$1,000 - $5,000/month">$1,000 - $5,000/month</option>
              <option value="$5,000 - $10,000/month">$5,000 - $10,000/month</option>
              <option value="$10,000 - $25,000/month">$10,000 - $25,000/month</option>
              <option value="Above $25,000/month">Above $25,000/month</option>
            </select>
          </div>
        </section>

        {/* Past Examples & Assets Section */}
        <section className="form-section">
          <h3 className="section-title">Past Examples & Assets</h3>
          
          <div className="form-group">
            <label htmlFor="past_examples">Past Marketing Examples</label>
            <textarea
              id="past_examples"
              name="past_examples"
              value={formData.past_examples}
              onChange={handleInputChange}
              rows="4"
              placeholder="Share examples of your past successful campaigns, content, or marketing materials"
            />
          </div>

          <div className="form-group">
            <label htmlFor="texts">Sample Texts/Content</label>
            <textarea
              id="texts"
              name="texts"
              value={formData.texts}
              onChange={handleInputChange}
              rows="4"
              placeholder="Paste any sample marketing copy, blog posts, or text content that represents your brand"
            />
          </div>

          <div className="form-group">
            <label htmlFor="images">Upload Images</label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              accept="image/*"
              className="file-input"
              onChange={handleImageChange}
            />
            <small className="form-hint">
              Upload brand logos, marketing materials, or visual assets (Multiple files allowed)
            </small>
            {imagePreviews.length > 0 && (
              <div className="file-preview">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="file-preview-item">
                    📷 {preview.name} ({preview.size})
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="videos">Upload Videos</label>
            <input
              type="file"
              id="videos"
              name="videos"
              multiple
              accept="video/*"
              className="file-input"
              onChange={handleVideoChange}
            />
            <small className="form-hint">
              Upload promotional videos or brand videos (Multiple files allowed)
            </small>
            {videoPreviews.length > 0 && (
              <div className="file-preview">
                {videoPreviews.map((preview, index) => (
                  <div key={index} className="file-preview-item">
                    🎥 {preview.name} ({preview.size})
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? '⏳ Processing...' : 'Complete Onboarding'}
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default ClientOnboarding;
