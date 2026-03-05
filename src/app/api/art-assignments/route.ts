import { NextResponse } from "next/server";
import { artAssignments } from "@/config/art-assignments";

export async function GET() {
  return NextResponse.json(artAssignments);
}
