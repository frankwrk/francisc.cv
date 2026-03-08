export const runtime = "nodejs";

export async function GET() {
  return Response.json(
    {
      error: "not_implemented",
      message:
        "The art assignments API route is not exposed in this build. Use the local art editor instead.",
    },
    { status: 404 },
  );
}
