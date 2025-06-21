import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, GetItemCommand, ScanCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Default product data if not found in DynamoDB
const defaultProducts = {
  '1': {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 129.99,
    originalPrice: 199.99,
  },
  '2': {
    id: 2,
    name: "Smart Watch Series 5",
    price: 299.99,
    originalPrice: 399.99,
  },
  '3': {
    id: 3,
    name: "Wireless Earbuds Pro",
    price: 149.99,
    originalPrice: 199.99,
  },
  '4': {
    id: 4,
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    originalPrice: 99.99,
  }
};

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const params = await context.params;
    const id = params.id;
    console.log('GET /api/products/[id]', { id });

    // First try to get from DynamoDB
    const result = await client.send(new GetItemCommand({
      TableName: 'products',
      Key: { id: { N: id.toString() } }
    }));

    // If not in DynamoDB, use default data
    if (!result.Item) {
      const defaultProduct = defaultProducts[id];
      if (!defaultProduct) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      // Initialize product in DynamoDB with default data
      const defaultItem = {
        id: { N: defaultProduct.id.toString() },
        name: { S: defaultProduct.name },
        price: { N: defaultProduct.price.toString() },
        originalPrice: { N: defaultProduct.originalPrice.toString() },
        lastUpdated: { N: Date.now().toString() }
      };

      try {
        await client.send(new PutItemCommand({
          TableName: 'products',
          Item: defaultItem
        }));
        console.log('Initialized default product in DynamoDB:', defaultItem);
      } catch (err) {
        console.error('Failed to initialize product in DynamoDB:', err);
      }

      return NextResponse.json({ item: defaultItem });
    }

    return NextResponse.json({ item: result.Item });
  } catch (err: any) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
} 