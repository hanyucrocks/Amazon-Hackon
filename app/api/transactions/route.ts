import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const transaction = await req.json();
    console.log("Received transaction:", transaction);
    const params = {
      TableName: 'transactions',
      Item: {
        id: { S: transaction.id },
        amount: { N: transaction.amount.toString() },
        timestamp: { N: transaction.timestamp.toString() },
        status: { S: transaction.status },
        ...(transaction.syncedAt && { syncedAt: { N: transaction.syncedAt.toString() } }),
        ...(transaction.completedAt && { completedAt: { N: transaction.completedAt.toString() } }),
        ...(transaction.trace && { trace: { S: transaction.trace } }),
        ...(transaction.productId && { productId: { N: transaction.productId.toString() } }),
        ...(transaction.userId && { userId: { S: transaction.userId.toString() } }),
      },
    };
    await client.send(new PutItemCommand(params));
    return NextResponse.json({ message: 'Transaction stored' }, { status: 200 });
  } catch (err: any) {
    console.error("DynamoDB error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 