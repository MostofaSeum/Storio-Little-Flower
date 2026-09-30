import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.storio.cloud';
    const tenantHost =
      req.headers.get('x-tenant-host') ||
      process.env.NEXT_PUBLIC_STORIO_TENANT_HOST ||
      '';

    const backendRes = await fetch(`${baseUrl}/api/v2/template/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(tenantHost ? { 'X-Tenant-Host': tenantHost } : {}),
      },
      body: JSON.stringify(body),
    });

    const contentType = backendRes.headers.get('content-type') || '';
    let responseData = null;
    if (contentType.includes('application/json')) {
      responseData = await backendRes.json().catch(() => null);
    } else {
      responseData = await backendRes.text().catch(() => '');
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          error:
            typeof responseData === 'object' && responseData !== null
              ? (responseData as any).message || (responseData as any).detail || 'Failed to submit message to server.'
              : `Backend returned ${backendRes.status}: ${backendRes.statusText}`,
          status: backendRes.status,
          data: responseData,
        },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(
      { success: true, data: responseData },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error while sending message.' },
      { status: 500 }
    );
  }
}
