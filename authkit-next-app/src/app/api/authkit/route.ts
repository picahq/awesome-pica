import { NextRequest, NextResponse } from "next/server";
import { AuthKitToken } from "@picahq/authkit-node";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

// Handle OPTIONS requests
export async function OPTIONS(req: NextRequest) {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
    const authKitToken = new AuthKitToken(process.env.PICA_SECRET_KEY!);

    const token = await authKitToken.create({
        identity: "userId",
        identityType: "user"
    });

    // Add CORS headers to the response
    return NextResponse.json(token, {
        headers: corsHeaders,
    });
}
