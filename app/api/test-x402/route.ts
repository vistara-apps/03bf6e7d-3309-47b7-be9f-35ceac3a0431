import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const paymentProof = request.headers.get('x402-payment-proof');
  
  if (!paymentProof) {
    // Return 402 Payment Required with payment details
    return NextResponse.json(
      {
        error: 'Payment required',
        amount: 0.12, // $0.12 in USDC
        recipient: '0x742d35Cc6634C0532925a3b8D4c8c1f8b8A9d9b8',
        description: 'Weather API access',
        currency: 'USDC',
        network: 'base'
      },
      { 
        status: 402,
        headers: {
          'Content-Type': 'application/vnd.x402+json',
          'X-Payment-Required': 'true'
        }
      }
    );
  }

  // Payment proof provided, return the requested data
  return NextResponse.json({
    success: true,
    data: {
      location: 'New York City',
      temperature: '72°F',
      condition: 'Sunny',
      humidity: '45%',
      windSpeed: '8 mph',
      icon: '☀️'
    },
    paymentTx: paymentProof
  });
}

export async function POST(request: NextRequest) {
  const paymentProof = request.headers.get('x402-payment-proof');
  const body = await request.json();
  
  if (!paymentProof) {
    return NextResponse.json(
      {
        error: 'Payment required',
        amount: 0.15,
        recipient: '0x742d35Cc6634C0532925a3b8D4c8c1f8b8A9d9b8',
        description: `API request: ${body.query || 'Custom query'}`,
        currency: 'USDC',
        network: 'base'
      },
      { 
        status: 402,
        headers: {
          'Content-Type': 'application/vnd.x402+json',
          'X-Payment-Required': 'true'
        }
      }
    );
  }

  // Simulate processing the request
  await new Promise(resolve => setTimeout(resolve, 1000));

  return NextResponse.json({
    success: true,
    data: {
      query: body.query,
      result: `Processed: ${body.query}`,
      timestamp: new Date().toISOString(),
      cost: 0.15
    },
    paymentTx: paymentProof
  });
}