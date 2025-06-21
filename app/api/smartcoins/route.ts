import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });

  // 1. Get all refunds for this user
  const refundsRes = await client.send(new ScanCommand({
    TableName: 'refunds',
    FilterExpression: 'userId = :uid',
    ExpressionAttributeValues: { ':uid': { S: userId } }
  }));
  const refunds = (refundsRes.Items || []).map(item => ({
    productId: item.productId?.N,
    refundAmount: parseFloat(item.refundAmount?.N || '0'),
    timestamp: Number(item.timestamp?.N || '0')
  }));

  // 2. Calculate SmartCoins balance (sum of all refunds)
  const balance = refunds.reduce((sum, r) => sum + r.refundAmount, 0);

  return NextResponse.json({ balance, refunds });
} 