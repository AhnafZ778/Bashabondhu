import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getSources, registerSource } from "@/lib/harvester/source-registry.service";

export async function GET() {
  return NextResponse.json({ ok: true, sources: getSources() });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const source = registerSource(body);
    return NextResponse.json({ ok: true, source });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
