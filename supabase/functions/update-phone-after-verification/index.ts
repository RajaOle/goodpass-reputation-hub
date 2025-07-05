import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdatePhoneRequest {
  userId: string;
  phoneNumber: string;
  otpCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    const { userId, phoneNumber, otpCode }: UpdatePhoneRequest = await req.json();
    
    if (!userId || !phoneNumber || !otpCode) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required parameters: userId, phoneNumber, or otpCode' 
        }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    // Create Supabase admin client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Verify that the OTP is correct using your existing OTP system
    const { data: otpRecord, error: fetchError } = await supabaseAdmin
      .from('otp_verifications')
      .select('*')
      .eq('phone', phoneNumber)
      .eq('otp_code', otpCode)
      .eq('verified', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !otpRecord) {
      console.error('OTP verification failed:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired verification code' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    // Mark OTP as verified
    const { error: updateError } = await supabaseAdmin
      .from('otp_verifications')
      .update({ verified: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('OTP update error:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to verify OTP' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    // Update the user's phone number and set phone_confirmed_at
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      { 
        phone: phoneNumber,
        phone_confirmed_at: new Date().toISOString()
      }
    );
    
    if (error) {
      console.error('Error updating user:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update user phone number' }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    // Update user profile to mark phone as verified
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ phone_verified: true })
      .eq('id', userId);

    if (profileError) {
      console.error('Profile update error:', profileError);
      // Don't fail the request if profile update fails
    }
    
    console.log(`Phone ${phoneNumber} verified and updated successfully for user ${userId}`);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Phone number verified and updated successfully',
        user: data.user
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler); 