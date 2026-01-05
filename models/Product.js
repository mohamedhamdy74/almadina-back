const mongoose = require('mongoose');
const { pipeline } = require('@xenova/transformers');

// Initialize embedding pipeline (will download model on first use)
let embedder = null;

async function getEmbedder() {
  if (!embedder) {
    // Using multilingual-e5-small model (supports Arabic and English)
    // Model size: ~120MB, will be cached after first download
    embedder = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
  }
  return embedder;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: false, // Optional field, mainly for laptops (e.g., "640 G2")
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Laptops', 'Accessories'], // Must match frontend values
  },
  subCategory: {
    type: String,
    required: false,
  },
  thumbnail: {
    type: String,
    required: true, // main image URL from Cloudinary
  },
  images: [{
    type: String, // array of extra images URLs from Cloudinary
  }],
  specifications: {
    cpu: String,
    capacity: String,
    style: String,
    brandName: String,
    modelName: String,
    screenSize: String,
    color: String,
    hardDiskSize: String,
    cpuModel: String,
    ramMemory: String,
    operatingSystem: String,
    specialFeatures: [String],
    graphicsDescription: String,
  },
  // Vector embedding for RAG-based search
  embedding_vector: {
    type: [Number],
    required: false,
  },
}, {
  timestamps: true,
});

// Pre-save hook to generate embeddings automatically
productSchema.pre('save', async function (next) {
  try {
    // Only generate embedding if product data has changed
    if (this.isModified('name') || this.isModified('description') || this.isModified('specifications') || !this.embedding_vector) {
      // Create text representation of the product for embedding
      const specs = this.specifications || {};
      const textToEmbed = `
        Product: ${this.name}
        Brand: ${this.brand}
        Model: ${this.model || 'N/A'}
        Description: ${this.description}
        Price: ${this.price} EGP
        Category: ${this.category}
        CPU: ${specs.cpu || specs.cpuModel || 'N/A'}
        RAM: ${specs.ramMemory || 'N/A'}
        Storage: ${specs.hardDiskSize || 'N/A'}
        Screen Size: ${specs.screenSize || 'N/A'}
        Graphics: ${specs.graphicsDescription || 'N/A'}
        Operating System: ${specs.operatingSystem || 'N/A'}
        Special Features: ${specs.specialFeatures?.join(', ') || 'N/A'}
      `.trim();

      // Generate embedding using local Transformers.js model
      const model = await getEmbedder();
      const output = await model(textToEmbed, { pooling: 'mean', normalize: true });

      // Convert tensor to array
      this.embedding_vector = Array.from(output.data);

      console.log(`✅ Generated local embedding for product: ${this.name} (${this.embedding_vector.length} dimensions)`);
    }
    next();
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    // Don't block save if embedding fails
    next();
  }
});

// Note: Create a vector search index in MongoDB Atlas on the 'embedding_vector' field
// Index configuration (dimensions will be 384 for multilingual-e5-small):
// {
//   "fields": [{
//     "type": "vector",
//     "path": "embedding_vector",
//     "numDimensions": 384,
//     "similarity": "cosine"
//   }]
// }

module.exports = mongoose.model('Product', productSchema);