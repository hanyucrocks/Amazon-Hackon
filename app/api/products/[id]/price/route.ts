import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, UpdateItemCommand, PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { price, name } = await req.json();
    const id = params.id;
    console.log('PATCH /api/products/[id]/price', { id, price, name });

    // 1. Get current price from DynamoDB
    const currentItem = await client.send(new GetItemCommand({
      TableName: 'products',
      Key: { id: { N: id.toString() } }
    }));

    const currentPrice = currentItem.Item?.price?.N ? parseFloat(currentItem.Item.price.N) : null;
    
    // 2. If there's a price change, create a price history record
    if (currentPrice !== null && price !== currentPrice) {
      await client.send(new PutItemCommand({
        TableName: 'price_history',
        Item: {
          id: { S: `${id}_${Date.now()}` }, // Composite key: productId_timestamp
          productId: { N: id.toString() },
          oldPrice: { N: currentPrice.toString() },
          newPrice: { N: price.toString() },
          timestamp: { N: Date.now().toString() },
          type: { S: price < currentPrice ? 'price_drop' : 'price_reset' }
        }
      }));

      // Skipping refund logic for price reset or drop
    }

    // 3. Update product price in main table
    let UpdateExpression = 'SET price = :p, lastUpdated = :t';
    let ExpressionAttributeValues: any = { 
      ':p': { N: price.toString() },
      ':t': { N: Date.now().toString() }
    };
    let ExpressionAttributeNames: any = undefined;

    if (name) {
      UpdateExpression += ', #n = :n';
      ExpressionAttributeValues[':n'] = { S: name };
      ExpressionAttributeNames = { '#n': 'name' };
    }

    const result = await client.send(new UpdateItemCommand({
      TableName: 'products',
      Key: { id: { N: id.toString() } },
      UpdateExpression,
      ExpressionAttributeValues,
      ...(ExpressionAttributeNames && { ExpressionAttributeNames })
    }));

    console.log('DynamoDB Update Result:', result);
    return NextResponse.json({ 
      message: 'Price updated', 
      priceDropped: currentPrice !== null && price < currentPrice,
      priceDifference: currentPrice !== null ? currentPrice - price : 0,
      result 
    });
  } catch (err: any) {
    console.error('PATCH /api/products/[id]/price error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 