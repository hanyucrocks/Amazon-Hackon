import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, GetItemCommand, UpdateItemCommand, PutItemCommand, QueryCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const { targetPrice } = await req.json();
    const id = params.id;
    
    console.log('Processing price drop request:', { id, targetPrice });

    // 1. Get current product details
    const currentItem = await client.send(new GetItemCommand({
      TableName: 'products',
      Key: { id: { N: id.toString() } }
    }));

    if (!currentItem.Item) {
      console.error('Product not found:', id);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const currentPrice = parseFloat(currentItem.Item.price?.N || '0');
    console.log('Current price:', currentPrice);
    
    // 2. Check if price should be dropped
    if (currentPrice <= targetPrice) {
      console.log('Price is already at or below target:', { currentPrice, targetPrice });
      return NextResponse.json({ 
        message: 'Price is already at or below target price',
        currentPrice,
        targetPrice
      });
    }

    // 3. Record price drop in price_history
    const priceHistoryItem = {
      id: { S: `${id}_${Date.now()}` },
      productId: { N: id.toString() },
      oldPrice: { N: currentPrice.toString() },
      newPrice: { N: targetPrice.toString() },
      timestamp: { N: Date.now().toString() },
      type: { S: 'scheduled_drop' }
    };

    await client.send(new PutItemCommand({
      TableName: 'price_history',
      Item: priceHistoryItem
    }));

    // 4. Update product price
    await client.send(new UpdateItemCommand({
      TableName: 'products',
      Key: { id: { N: id.toString() } },
      UpdateExpression: 'SET price = :p, lastUpdated = :t',
      ExpressionAttributeValues: {
        ':p': { N: targetPrice.toString() },
        ':t': { N: Date.now().toString() }
      }
    }));

    return NextResponse.json({
      message: 'Price drop processed successfully',
      oldPrice: currentPrice,
      newPrice: targetPrice,
      priceDifference: currentPrice - targetPrice
    });

  } catch (err: any) {
    console.error('Error processing price drop:', err);
    return NextResponse.json({ 
      error: err.message || 'Internal server error',
      details: err.stack
    }, { 
      status: err.status || 500 
    });
  }
} 