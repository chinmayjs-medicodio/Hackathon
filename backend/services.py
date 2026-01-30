"""
Service layer for CampaignForge backend
Handles OpenAI integration, content generation, and n8n integration
"""
import os
from openai import OpenAI
from dotenv import load_dotenv
import requests
from typing import Dict, List, Optional

load_dotenv()

# Initialize OpenAI client (lazy initialization to handle missing API key)
openai_client = None

def get_openai_client():
    """Get or initialize OpenAI client"""
    global openai_client
    if openai_client is None:
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key or api_key == 'your_openai_api_key_here':
            raise Exception("OpenAI API key not configured. Please set OPENAI_API_KEY in .env file")
        # Initialize with minimal configuration to avoid proxy issues
        try:
            openai_client = OpenAI(
                api_key=api_key,
                timeout=60.0,
                max_retries=3
            )
        except Exception as e:
            raise Exception(f"Failed to initialize OpenAI client: {str(e)}")
    return openai_client

# n8n configuration
N8N_WEBHOOK_URL = os.getenv('N8N_WEBHOOK_URL', 'http://localhost:5678/webhook')
N8N_API_KEY = os.getenv('N8N_API_KEY', '')


def generate_content(
    client_data: Dict,
    platform: str,
    content_type: str,
    topic: Optional[str] = None
) -> str:
    """
    Generate marketing content using OpenAI based on client data
    
    Args:
        client_data: Client onboarding data
        platform: Target platform (LinkedIn, Twitter, Instagram, etc.)
        content_type: Type of content (post, blog, newsletter, ad_copy, video_script)
        topic: Optional topic or theme for the content
    
    Returns:
        Generated content string
    """
    try:
        # Build context from client data
        brand_tone = client_data.get('brand_tone', 'Professional')
        industry = client_data.get('industry', 'General')
        target_audience = client_data.get('target_audience', 'General audience')
        marketing_goals = client_data.get('marketing_goals', 'Brand awareness')
        content_preferences = client_data.get('content_preferences', 'Educational')
        past_examples = client_data.get('past_examples', '')
        
        # Create platform-specific prompts
        platform_prompts = {
            'LinkedIn': 'Create a professional LinkedIn post',
            'Twitter': 'Create an engaging Twitter post (280 characters max)',
            'Instagram': 'Create an Instagram post with engaging copy',
            'Facebook': 'Create a Facebook post that encourages engagement',
            'Reddit': 'Create a Reddit post that follows community guidelines and encourages discussion',
            'Email': 'Create an email newsletter content',
            'Website': 'Create a blog post or website content',
            'YouTube': 'Create a video script for YouTube'
        }
        
        content_type_prompts = {
            'post': 'social media post',
            'blog': 'blog post (500-800 words)',
            'newsletter': 'email newsletter content',
            'ad_copy': 'advertising copy',
            'video_script': 'video script with scene descriptions'
        }
        
        base_prompt = platform_prompts.get(platform, 'Create marketing content')
        type_prompt = content_type_prompts.get(content_type, 'content')
        
        # Construct the full prompt
        prompt = f"""You are an expert marketing content writer. {base_prompt} as a {type_prompt}.

Client Information:
- Company: {client_data.get('company_name', 'Unknown')}
- Industry: {industry}
- Brand Tone: {brand_tone}
- Target Audience: {target_audience}
- Marketing Goals: {marketing_goals}
- Content Preferences: {content_preferences}
{f"- Past Examples: {past_examples}" if past_examples else ""}
{f"- Topic: {topic}" if topic else ""}

Requirements:
- Match the brand tone: {brand_tone}
- Appeal to target audience: {target_audience}
- Align with marketing goals: {marketing_goals}
- Follow content preferences: {content_preferences}
- Be engaging and professional
- Include a clear call-to-action if appropriate

Generate the content now:"""

        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert marketing content writer specializing in creating engaging, brand-aligned content for various platforms."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.7,
            max_tokens=1000
        )
        
        generated_content = response.choices[0].message.content.strip()
        return generated_content
        
    except Exception as e:
        raise Exception(f"Error generating content: {str(e)}")


def regenerate_content(
    client_data: Dict,
    platform: str,
    content_type: str,
    existing_content: str,
    improvement_focus: Optional[str] = None
) -> str:
    """
    Regenerate existing content using OpenAI with focus on improvement
    
    Args:
        client_data: Client onboarding data
        platform: Target platform (LinkedIn, Twitter, Instagram, etc.)
        content_type: Type of content (post, blog, newsletter, ad_copy, video_script)
        existing_content: The current content that needs to be regenerated
        improvement_focus: Optional focus area for improvement (e.g., "more engaging", "better CTA", "shorter")
    
    Returns:
        Regenerated content string
    """
    try:
        # Build context from client data
        brand_tone = client_data.get('brand_tone', 'Professional')
        industry = client_data.get('industry', 'General')
        target_audience = client_data.get('target_audience', 'General audience')
        marketing_goals = client_data.get('marketing_goals', 'Brand awareness')
        content_preferences = client_data.get('content_preferences', 'Educational')
        company_name = client_data.get('company_name', 'Unknown')
        
        # Platform-specific guidelines
        platform_guidelines = {
            'LinkedIn': {
                'max_length': '1300 characters',
                'style': 'professional, thought-provoking, industry insights',
                'format': 'paragraphs with clear structure'
            },
            'Twitter': {
                'max_length': '280 characters',
                'style': 'concise, engaging, hashtag-friendly',
                'format': 'short sentences, can include hashtags'
            },
            'Instagram': {
                'max_length': '2200 characters',
                'style': 'visual, engaging, authentic, emoji-friendly',
                'format': 'short paragraphs, can include emojis and line breaks'
            },
            'Facebook': {
                'max_length': '5000 characters',
                'style': 'conversational, community-focused, engaging',
                'format': 'paragraphs with questions to encourage engagement'
            },
            'Reddit': {
                'max_length': '40000 characters',
                'style': 'informative, authentic, discussion-provoking, follows Reddit etiquette',
                'format': 'well-structured post with engaging body text, clear formatting, and questions to spark conversation'
            },
            'Email': {
                'max_length': '2000 characters',
                'style': 'clear, actionable, value-driven',
                'format': 'structured with clear sections and CTA'
            },
            'Website': {
                'max_length': '2000 words',
                'style': 'informative, SEO-friendly, comprehensive',
                'format': 'structured with headings and subheadings'
            },
            'YouTube': {
                'max_length': '5000 words',
                'style': 'conversational, engaging, storytelling',
                'format': 'script format with scene descriptions and dialogue'
            }
        }
        
        guidelines = platform_guidelines.get(platform, {
            'max_length': 'appropriate length',
            'style': 'engaging and professional',
            'format': 'well-structured'
        })
        
        # Build the regeneration prompt
        improvement_instruction = ""
        if improvement_focus:
            improvement_instruction = f"\n\nIMPORTANT: Focus on improving: {improvement_focus}"
        else:
            improvement_instruction = "\n\nIMPORTANT: Improve the content while maintaining brand consistency - make it more engaging, compelling, and aligned with the brand voice."
        
        prompt = f"""You are an expert marketing content writer. Your task is to REGENERATE and IMPROVE the following content for {platform}.

CURRENT CONTENT TO REGENERATE:
---
{existing_content}
---

CLIENT BRAND CONTEXT:
- Company: {company_name}
- Industry: {industry}
- Brand Tone: {brand_tone}
- Target Audience: {target_audience}
- Marketing Goals: {marketing_goals}
- Content Preferences: {content_preferences}

PLATFORM REQUIREMENTS:
- Platform: {platform}
- Content Type: {content_type}
- Maximum Length: {guidelines['max_length']}
- Style: {guidelines['style']}
- Format: {guidelines['format']}
{improvement_instruction}

REGENERATION GUIDELINES:
1. Maintain the core message and intent of the original content
2. Keep the brand tone consistent: {brand_tone}
3. Ensure it appeals to: {target_audience}
4. Align with marketing goals: {marketing_goals}
5. Follow content preferences: {content_preferences}
6. Improve engagement, clarity, and impact
7. Make it more compelling while staying authentic to the brand
8. Ensure it fits the {platform} platform format and best practices
9. Include a strong call-to-action if appropriate for the platform
10. Optimize for the target audience's interests and pain points

Generate the REGENERATED and IMPROVED content now. Make it better than the original while maintaining brand consistency:"""

        client = get_openai_client()
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {
                    "role": "system",
                    "content": "You are an expert marketing content writer specializing in regenerating and improving existing content while maintaining brand consistency and increasing engagement."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.8,  # Slightly higher for more creative variations
            max_tokens=1500  # Increased for better regeneration
        )
        
        regenerated_content = response.choices[0].message.content.strip()
        return regenerated_content
        
    except Exception as e:
        raise Exception(f"Error regenerating content: {str(e)}")


def post_to_n8n(platform: str, content: str, client_data: Dict) -> Dict:
    """
    Send content to n8n webhook for automated posting
    
    Args:
        platform: Target platform
        content: Content to post
        client_data: Client information
    
    Returns:
        Response from n8n
    """
    try:
        payload = {
            'platform': platform,
            'content': content,
            'client_id': client_data.get('client_id'),
            'client_name': client_data.get('company_name'),
            'scheduled_time': None,  # Can be set for scheduled posts
            'metadata': {
                'brand_tone': client_data.get('brand_tone'),
                'industry': client_data.get('industry')
            }
        }
        
        headers = {}
        if N8N_API_KEY:
            headers['Authorization'] = f'Bearer {N8N_API_KEY}'
        
        response = requests.post(
            N8N_WEBHOOK_URL,
            json=payload,
            headers=headers,
            timeout=30
        )
        
        if response.status_code == 200:
            return {
                'success': True,
                'message': f'Content posted to {platform} successfully',
                'data': response.json()
            }
        else:
            return {
                'success': False,
                'message': f'Failed to post to {platform}: {response.text}'
            }
            
    except Exception as e:
        return {
            'success': False,
            'message': f'Error posting to n8n: {str(e)}'
        }


def generate_ai_image(client_data: Dict, platform: str) -> Optional[str]:
    """
    Generate an AI image using DALL-E based on client data and platform
    
    Args:
        client_data: Client onboarding data
        platform: Target platform for the image
    
    Returns:
        Image URL or None if generation fails
    """
    try:
        client = get_openai_client()
        
        # Build image generation prompt
        company_name = client_data.get('company_name', 'Company')
        industry = client_data.get('industry', 'Business')
        brand_tone = client_data.get('brand_tone', 'Professional')
        target_audience = client_data.get('target_audience', 'General audience')
        marketing_goals = client_data.get('marketing_goals', 'Brand awareness')
        
        # Platform-specific image style guidance
        platform_styles = {
            'LinkedIn': 'professional, corporate, business-focused',
            'Twitter': 'vibrant, engaging, social media optimized',
            'Instagram': 'aesthetic, visually appealing, modern design',
            'Facebook': 'friendly, community-oriented, engaging',
            'Reddit': 'authentic, community-focused, discussion-worthy',
            'Email': 'clean, professional, email-friendly format',
            'Website': 'professional, brand-aligned, web-optimized',
            'YouTube': 'eye-catching thumbnail style, video-friendly'
        }
        
        style_guide = platform_styles.get(platform, 'professional and engaging')
        
        prompt = f"""Create a high-quality marketing image for {company_name}, a {industry} company.

Brand Details:
- Brand Tone: {brand_tone}
- Target Audience: {target_audience}
- Marketing Goal: {marketing_goals}
- Platform: {platform}

Image Requirements:
- Style: {style_guide}
- Professional quality, suitable for {platform} marketing
- Visually appealing and brand-appropriate
- No text overlays (text will be added separately)
- High resolution, modern design aesthetic

Create an image that represents {company_name}'s brand identity and appeals to {target_audience}."""
        
        # Generate image using DALL-E
        response = client.images.generate(
            model="dall-e-3",
            prompt=prompt,
            size="1024x1024",
            quality="standard",
            n=1
        )
        
        if response.data and len(response.data) > 0:
            return response.data[0].url
        else:
            print("No image URL returned from DALL-E")
            return None
            
    except Exception as e:
        print(f"Error generating AI image: {str(e)}")
        return None


def generate_content_for_all_platforms(client_data: Dict) -> List[Dict]:
    """
    Generate content for all platforms specified in client's primary_channels
    
    Args:
        client_data: Client onboarding data
    
    Returns:
        List of generated content items
    """
    platforms = client_data.get('primary_channels', '').split(', ')
    if not platforms or platforms == ['']:
        platforms = ['LinkedIn', 'Twitter', 'Instagram']  # Default platforms
    
    content_types = {
        'LinkedIn': 'post',
        'Twitter': 'post',
        'Instagram': 'post',
        'Facebook': 'post',
        'Reddit': 'post',
        'Email': 'newsletter',
        'Website': 'blog',
        'YouTube': 'video_script'
    }
    
    # Check if image generation is requested
    generate_images = client_data.get('generate_images', False) or str(client_data.get('generate_images', '')).lower() == 'true'
    
    # Get uploaded images
    uploaded_images = client_data.get('images', [])
    uploaded_image_urls = [img.get('url') for img in uploaded_images if img.get('url')]
    
    generated_content = []
    
    for platform in platforms:
        platform = platform.strip()
        if not platform:
            continue
            
        content_type = content_types.get(platform, 'post')
        
        try:
            content = generate_content(
                client_data=client_data,
                platform=platform,
                content_type=content_type
            )
            
            content_item = {
                'platform': platform,
                'content_type': content_type,
                'content': content,
                'client_id': client_data.get('client_id'),
                'client_name': client_data.get('company_name'),
                'status': 'pending'
            }
            
            # Add uploaded images to content item
            if uploaded_image_urls:
                content_item['uploaded_images'] = uploaded_image_urls
                content_item['has_uploaded_images'] = True
            
            # Generate AI image if requested
            if generate_images:
                try:
                    image_url = generate_ai_image(client_data, platform)
                    if image_url:
                        content_item['generated_image_url'] = image_url
                        content_item['has_image'] = True
                except Exception as e:
                    print(f"Error generating image for {platform}: {str(e)}")
                    content_item['has_image'] = False
            
            generated_content.append(content_item)
        except Exception as e:
            print(f"Error generating content for {platform}: {str(e)}")
            continue
    
    return generated_content
