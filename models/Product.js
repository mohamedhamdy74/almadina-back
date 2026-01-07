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
        المنتج: ${this.name} (Product)
        الماركة: ${this.brand} (Brand)
        الموديل: ${this.model || 'N/A'} (Model)
        الوصف: ${this.description} (Description: ${this.description})
        السعر: ${this.price} جنيه مصري (Price: ${this.price})
        الفئة: ${this.category} (Category)
        المعالج: ${specs.cpu || specs.cpuModel || 'N/A'} (CPU)
        الرامات: ${specs.ramMemory || 'N/A'} (RAM)
        الهارد: ${specs.hardDiskSize || 'N/A'} (Storage)
        الشاشة: ${specs.screenSize || 'N/A'} (Screen)
        كارت الشاشة: ${specs.graphicsDescription || 'N/A'} (Graphics)
        النظام: ${specs.operatingSystem || 'N/A'} (OS)
        مميزات: ${specs.specialFeatures?.join(', ') || 'N/A'} (Features)
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