const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

      // Generate embedding using Google Gemini API (Faster & Cloud-based)
      const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
      const result = await model.embedContent(textToEmbed);

      // Convert tensor to array
      this.embedding_vector = result.embedding.values;

      console.log(`✅ Generated Gemini embedding for product: ${this.name} (${this.embedding_vector.length} dimensions)`);
    }
    next();
  } catch (error) {
    console.error('❌ Error generating embedding:', error.message);
    // Don't block save if embedding fails
    next();
  }
});

// Note: Create a vector search index in MongoDB Atlas on the 'embedding_vector' field
// Index configuration (dimensions will be 768 for text-embedding-004):
// {
//   "fields": [{
//     "type": "vector",
//     "path": "embedding_vector",
//     "numDimensions": 768,
//     "similarity": "cosine"
//   }]
// }

module.exports = mongoose.model('Product', productSchema);