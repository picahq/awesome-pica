import { NextRequest, NextResponse } from 'next/server';

interface WelcomeEmailRequest {
  name: string;
  email: string;
  signupId: string;
}

export async function POST(request: NextRequest) {
  try {
    const { name, email }: WelcomeEmailRequest = await request.json();

    console.log('📧 Sending email to:', email);

    // Get current date for subject
    const currentDate = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric', 
      year: 'numeric'
    });

    const subject = `🎉 Welcome to the Waiting List!`;

    // Create HTML email body
    const htmlBody = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; color: #2c3e50; line-height: 1.7; font-size: 16px; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1>Welcome Aboard! 🚀</h1>
      </div>
      <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2>Hi ${name}!</h2>
        <p>Thank you for joining our exclusive waiting list! You're now part of an amazing community of early adopters.</p>
        
        <p><strong>What happens next?</strong></p>
        <ul style="margin: 15px 0; padding-left: 25px; list-style-type: disc;">
          <li style="margin: 8px 0;">You'll be among the first to know about our launch</li>
          <li style="margin: 8px 0;">Get exclusive early access to new features</li>
          <li style="margin: 8px 0;">Receive special launch pricing</li>
        </ul>
        
        <p>Stay tuned for exciting updates!</p>
        
        <p>Best regards,<br>
        The Team</p>
      </div>
    </div>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="color: #666; font-size: 12px; text-align: center;">
      Generated automatically by Waiting List System<br>
      Powered by InstantDB & Pica
    </p>`;

    // Construct proper MIME email
    const mimeEmail = [
      `From: your-email@gmail.com`, // Replace with your actual Gmail
      `To: ${email}`,
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=UTF-8',
      '',
      htmlBody,
    ].join('\r\n');

    console.log('📝 MIME email constructed');

    // Encode to base64url (Gmail API requirement) 
    const encoder = new TextEncoder();
    const data = encoder.encode(mimeEmail);
    const base64 = btoa(String.fromCharCode(...data));
    const encodedEmail = base64
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    console.log('🔐 Email encoded to base64url');

    // Send via Pica Gmail API
    const response = await fetch('https://api.picaos.com/v1/passthrough/users/me/messages', {
      method: 'POST',
      headers: {
        'x-pica-secret': process.env.PICA_SECRET_KEY!,
        'x-pica-connection-key': process.env.PICA_GMAIL_CONNECTION_KEY!,
        'x-pica-action-id': 'conn_mod_def::F_JeJ3qaLEg::v9ICSQZxR0un5_ketxbCAQ',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        raw: encodedEmail,
        labelIds: ['INBOX', 'UNREAD']
      })
    });

    console.log(`📡 Pica response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Pica error response:', errorText);
      throw new Error(`Pica API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Email sent successfully:', result);
    
    return NextResponse.json({ 
      success: true, 
      messageId: result.id,
      message: 'Welcome email sent successfully!' 
    });

  } catch (error) {
    console.error('💥 Error sending welcome email:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send welcome email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}