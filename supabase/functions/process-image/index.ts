
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { image } = await req.json()
    const apiKey = Deno.env.get('GOOGLE_CLOUD_VISION_API_KEY')

    if (!apiKey) {
      throw new Error('Google Cloud Vision API key not found')
    }

    // Call Google Cloud Vision API
    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
            },
          ],
        }),
      }
    )

    const data = await response.json()
    console.log('Vision API Response:', data)

    if (!data.responses?.[0]?.fullTextAnnotation?.text) {
      throw new Error('No text detected in the image')
    }

    return new Response(
      JSON.stringify({
        text: data.responses[0].fullTextAnnotation.text,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error processing image:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
