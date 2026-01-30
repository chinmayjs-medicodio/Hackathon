import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Driven Content Creation',
      description: 'Generate marketing content including social media posts, blogs, newsletters, ad copy, images, and videos customized for your brand.'
    },
    {
      icon: '📱',
      title: 'Multi-Platform Automation',
      description: 'Automatically schedule and publish content across websites, LinkedIn, social media, email newsletters, and video channels.'
    },
    {
      icon: '✅',
      title: 'Content Review & Approval',
      description: 'Review and approve content before publishing with AI quality checks and optional human/client approvals.'
    },
    {
      icon: '📊',
      title: 'Ads & Campaign Automation',
      description: 'Create, manage, and optimize ad campaigns with A/B testing, budget optimization, and performance-based adjustments.'
    },
    {
      icon: '📈',
      title: 'Analytics & Insights',
      description: 'Track performance across all platforms with comprehensive dashboards and real-time analytics.'
    },
    {
      icon: '🎯',
      title: 'Targeted Campaigns',
      description: 'Deliver consistent, scalable, and data-driven campaigns customized for each client and target audience.'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '$99',
      period: '/month',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 5 clients',
        '100 AI-generated posts/month',
        '3 social media platforms',
        'Basic analytics',
        'Email support'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$299',
      period: '/month',
      description: 'Ideal for growing marketing agencies',
      features: [
        'Up to 20 clients',
        '500 AI-generated posts/month',
        'All social media platforms',
        'Advanced analytics',
        'Priority support',
        'Campaign automation',
        'A/B testing'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large agencies and enterprises',
      features: [
        'Unlimited clients',
        'Unlimited AI-generated posts',
        'All platforms + custom integrations',
        'Custom analytics dashboards',
        'Dedicated account manager',
        'Advanced campaign automation',
        'API access',
        'Custom AI training'
      ],
      popular: false
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              AI-Powered Marketing Automation
              <span className="gradient-text"> Made Simple</span>
            </h1>
            <p className="hero-description">
              Streamline content creation, publishing, and performance tracking across multiple 
              digital channels. Deliver consistent, scalable, and data-driven campaigns for your clients.
            </p>
            <div className="hero-cta">
              <Link to="/onboard" className="btn btn-primary btn-large">
                Get Started Free
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-large">
                View Demo
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Content Generated</div>
              </div>
              <div className="stat">
                <div className="stat-number">500+</div>
                <div className="stat-label">Active Clients</div>
              </div>
              <div className="stat">
                <div className="stat-number">50+</div>
                <div className="stat-label">Platforms Supported</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Powerful Features</h2>
            <p className="section-description">
              Everything you need to automate your marketing campaigns
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-description">
              Choose the plan that works best for your business
            </p>
          </div>
          <div className="pricing-grid">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index} 
                className={`pricing-card ${plan.popular ? 'popular' : ''}`}
              >
                {plan.popular && <div className="popular-badge">Most Popular</div>}
                <h3 className="pricing-name">{plan.name}</h3>
                <div className="pricing-price">
                  <span className="price-amount">{plan.price}</span>
                  {plan.period && <span className="price-period">{plan.period}</span>}
                </div>
                <p className="pricing-description">{plan.description}</p>
                <ul className="pricing-features">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>✓ {feature}</li>
                  ))}
                </ul>
                <Link 
                  to="/onboard" 
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'} btn-block`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Marketing?</h2>
            <p>Join hundreds of agencies already using CampaignForge to scale their operations</p>
            <Link to="/onboard" className="btn btn-primary btn-large">
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
