import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json({ error: "url param is required" }, { status: 400 });
    }

    const allowedBaseUrl =
      process.env.NEXT_PUBLIC_R2_BASE_URL || "https://pub-a7037bf7f4c64dedb7aad4db8a0c68a2.r2.dev";

    // SSRF security check: Ensure URL points to R2 bucket
    if (
      !url.startsWith(allowedBaseUrl) &&
      !url.startsWith("https://pub-a7037bf7f4c64dedb7aad4db8a0c68a2.r2.dev")
    ) {
      return NextResponse.json({ error: "Access Denied: URL not allowed" }, { status: 403 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch resource: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.arrayBuffer();

    return new NextResponse(data, {
      headers: {
        "Content-Type": "application/zip",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
