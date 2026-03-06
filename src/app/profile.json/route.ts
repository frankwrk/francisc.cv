import { NextResponse } from "next/server";
import { profileSummary } from "@/config/site-home";

export function GET() {
  return NextResponse.json(profileSummary, {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
