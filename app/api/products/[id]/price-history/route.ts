import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = params.id;

    // Scan price_history for all records with this productId
    const result = await client.send(new ScanCommand({
      TableName: 'price_history',
      FilterExpression: 'productId = :pid',
      ExpressionAttributeValues: { ':pid': { N: id.toString() } },
    }));

    // Sort by timestamp ascending
    const history = (result.Items || [])
      .map(item => ({
        newPrice: item.newPrice?.N,
        oldPrice: item.oldPrice?.N,
        timestamp: item.timestamp?.N,
        type: item.type?.S,
      }))
      .sort((a, b) => Number(a.timestamp) - Number(b.timestamp));

    return NextResponse.json({ history });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 