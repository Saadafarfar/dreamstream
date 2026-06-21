import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const message = `
🚀 New DreamStream Order

👤 Name: ${body.full_name}
📧 Email: ${body.email}
📱 WhatsApp: ${body.whatsapp}
📦 Plan: ${body.plan}
🌍 Country: ${body.country}
🖥 IP: ${body.ip_address}
`;

    const response = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      telegram: data,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error,
    });
  }
}