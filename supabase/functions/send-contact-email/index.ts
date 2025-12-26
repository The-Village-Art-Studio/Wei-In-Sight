// Supabase Edge Function: Send Contact Email
// Uses Resend API for email delivery and Cloudflare Turnstile for CAPTCHA verification

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const TURNSTILE_SECRET_KEY = Deno.env.get("TURNSTILE_SECRET_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const RECIPIENT_EMAIL = "jackyho@weiinsight.com";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
    name: string;
    email: string;
    message: string;
    turnstileToken: string;
}

async function verifyTurnstile(token: string): Promise<boolean> {
    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: TURNSTILE_SECRET_KEY || "",
                response: token,
            }),
        }
    );

    const data = await response.json();
    return data.success === true;
}

async function sendEmail(name: string, email: string, message: string): Promise<boolean> {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: "Wei In Sight <noreply@weiinsight.com>",
            to: [RECIPIENT_EMAIL],
            reply_to: email,
            subject: `New Contact Form Message from ${name}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br />")}</p>
        <hr />
        <p style="color: #666; font-size: 12px;">This message was sent from the Wei In Sight contact form.</p>
      `,
        }),
    });

    return response.ok;
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { name, email, message, turnstileToken }: ContactRequest = await req.json();

        // Validate required fields
        if (!name || !email || !message) {
            return new Response(
                JSON.stringify({ error: "All fields are required." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (!turnstileToken) {
            return new Response(
                JSON.stringify({ error: "CAPTCHA verification required." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Verify Turnstile CAPTCHA
        const isCaptchaValid = await verifyTurnstile(turnstileToken);
        if (!isCaptchaValid) {
            return new Response(
                JSON.stringify({ error: "CAPTCHA verification failed. Please try again." }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Send email
        const emailSent = await sendEmail(name, email, message);
        if (!emailSent) {
            return new Response(
                JSON.stringify({ error: "Failed to send email. Please try again later." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Email sent successfully!" }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("Error processing contact form:", error);
        return new Response(
            JSON.stringify({ error: "An unexpected error occurred." }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
