/**
 * Cloudflare Worker - Claude API Proxy
 * 
 * This worker securely proxies requests to Claude's API,
 * keeping the API key secret on the server side.
 */

export default {
  async fetch(request, env) {
    // CORS headers for the response
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    // Parse the incoming request
    try {
      const body = await request.json();
      
      // Validate required fields
      if (!body.messages || !Array.isArray(body.messages)) {
        return new Response(JSON.stringify({ error: 'Invalid request: messages array required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Forward the request to Claude API
      const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: body.model || 'claude-sonnet-4-20250514',
          max_tokens: body.max_tokens || 1024,
          system: body.system,
          messages: body.messages
        })
      });

      // Check if Claude API request was successful
      if (!claudeResponse.ok) {
        const errorText = await claudeResponse.text();
        console.error('Claude API error:', errorText);
        return new Response(JSON.stringify({ 
          error: 'Claude API request failed',
          details: errorText 
        }), {
          status: claudeResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Return Claude's response
      const data = await claudeResponse.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }
};
