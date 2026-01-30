const API_BASE_URL = 'http://localhost:8000';

// File preview handlers
document.getElementById('images').addEventListener('change', function(e) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    Array.from(e.target.files).forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-preview-item';
        item.textContent = `📷 ${file.name} (${formatFileSize(file.size)})`;
        preview.appendChild(item);
    });
});

document.getElementById('videos').addEventListener('change', function(e) {
    const preview = document.getElementById('videoPreview');
    preview.innerHTML = '';
    
    Array.from(e.target.files).forEach(file => {
        const item = document.createElement('div');
        item.className = 'file-preview-item';
        item.textContent = `🎥 ${file.name} (${formatFileSize(file.size)})`;
        preview.appendChild(item);
    });
});

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Form submission handler
document.getElementById('onboardingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';
    
    try {
        // Get form data
        const formData = new FormData();
        
        // Get all form fields
        formData.append('company_name', document.getElementById('company_name').value);
        formData.append('industry', document.getElementById('industry').value);
        formData.append('brand_tone', document.getElementById('brand_tone').value);
        formData.append('target_audience', document.getElementById('target_audience').value);
        formData.append('website_url', document.getElementById('website_url').value || '');
        formData.append('social_media_handles', document.getElementById('social_media_handles').value || '');
        formData.append('marketing_goals', document.getElementById('marketing_goals').value || '');
        formData.append('content_preferences', document.getElementById('content_preferences').value || '');
        formData.append('budget_range', document.getElementById('budget_range').value || '');
        formData.append('past_examples', document.getElementById('past_examples').value || '');
        formData.append('texts', document.getElementById('texts').value || '');
        
        // Get selected channels
        const selectedChannels = Array.from(document.querySelectorAll('input[name="primary_channels"]:checked'))
            .map(cb => cb.value)
            .join(', ');
        formData.append('primary_channels', selectedChannels);
        
        // Get image files
        const imageFiles = document.getElementById('images').files;
        for (let i = 0; i < imageFiles.length; i++) {
            formData.append('images', imageFiles[i]);
        }
        
        // Get video files
        const videoFiles = document.getElementById('videos').files;
        for (let i = 0; i < videoFiles.length; i++) {
            formData.append('videos', videoFiles[i]);
        }
        
        // Send to backend
        const response = await fetch(`${API_BASE_URL}/api/client/onboard`, {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Show success message
            document.getElementById('onboardingForm').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            document.getElementById('successText').textContent = 
                `Client "${result.data.company_name}" has been successfully onboarded! Client ID: ${result.data.client_id}`;
        } else {
            throw new Error(result.message || 'Failed to onboard client');
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error onboarding client: ' + error.message + '\n\nMake sure the backend server is running on http://localhost:8000');
        
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
});

// Reset form function
function resetForm() {
    document.getElementById('onboardingForm').reset();
    document.getElementById('onboardingForm').style.display = 'block';
    document.getElementById('successMessage').style.display = 'none';
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('videoPreview').innerHTML = '';
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Health check on page load
window.addEventListener('load', async function() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        console.log('Backend connection:', data.status);
    } catch (error) {
        console.warn('Backend not reachable. Make sure the server is running on http://localhost:8000');
    }
});
