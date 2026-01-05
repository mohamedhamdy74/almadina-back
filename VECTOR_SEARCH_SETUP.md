# MongoDB Atlas Vector Search Index Configuration

To enable RAG-based product recommendations, you need to create a vector search index in MongoDB Atlas.

## Steps to Create the Index:

1. **Log in to MongoDB Atlas**
   - Go to https://cloud.mongodb.com
   - Navigate to your cluster (Cluster0store)

2. **Access Atlas Search**
   - Click on your cluster
   - Go to the "Search" tab
   - Click "Create Search Index"

3. **Choose JSON Editor**
   - Select "JSON Editor" option
   - Click "Next"

4. **Configure the Index**
   - **Database**: `almadina_store`
   - **Collection**: `products`
   - **Index Name**: `vector_index`

5. **Paste this JSON Configuration**:

```json
{
  "fields": [
    {
      "type": "vector",
      "path": "embedding_vector",
      "numDimensions": 384,
      "similarity": "cosine"
    }
  ]
}
```

**Note**: We're using 384 dimensions because we're using the `multilingual-e5-small` model from Transformers.js (not Google's 768-dimensional model).

6. **Create the Index**
   - Click "Next"
   - Review the configuration
   - Click "Create Search Index"

7. **Wait for Index to Build**
   - The index will take a few minutes to build
   - Status will change from "Building" to "Active"

## Verify the Index

Once the index is active, you can test it by:

1. Navigate to http://localhost:5173/ai-assistant
2. Ask for a laptop recommendation
3. The system should retrieve relevant products using vector search

## Troubleshooting

If you encounter errors:

- **"$vectorSearch is not supported"**: Make sure you're using MongoDB Atlas (not local MongoDB)
- **"Index not found"**: Verify the index name is exactly `vector_index`
- **"No results"**: Make sure products have embeddings (check the `embedding_vector` field)

## Generate Embeddings for Existing Products

If you have existing products without embeddings, run this script:

```javascript
// In backend directory, create a file: generateEmbeddings.js
const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

async function generateEmbeddings() {
  await mongoose.connect(process.env.MONGO_URI);
  
  const products = await Product.find({});
  
  for (const product of products) {
    // Trigger the pre-save hook by modifying and saving
    product.markModified('name');
    await product.save();
    console.log(`✅ Generated embedding for: ${product.name}`);
  }
  
  console.log('✅ All embeddings generated!');
  process.exit(0);
}

generateEmbeddings();
```

Run it with: `node generateEmbeddings.js`
