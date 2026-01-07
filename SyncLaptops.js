require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const newLaptops = [
    {
        brand: 'DELL',
        model: 'LATITUDE 3180',
        name: 'DELL LATITUDE 3180',
        price: 3500,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 3180 بمعالج Celeron G7 وذاكرة رام 4 جيجا وهارد 128 جيجا، مثالي للدراسة والاستخدام اليومي.',
        specifications: {
            cpu: 'Celeron G7',
            ramMemory: '4 GB',
            hardDiskSize: '128 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: '640 G2',
        name: 'HP 640 G2',
        price: 6500,
        category: 'Laptops',
        description: 'لابتوب HP 640 G2 بمعالج Core i5 الجيل السادس ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 6th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: '745 G4',
        name: 'HP 745 G4',
        price: 7000,
        category: 'Laptops',
        description: 'لابتوب HP 745 G4 بمعالج AMD A12 الجيل التاسع ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'AMD A12 9th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'AMD Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Lenovo',
        model: 'T480',
        name: 'Lenovo ThinkPad T480',
        price: 9500,
        category: 'Laptops',
        description: 'لابتوب Lenovo ThinkPad T480 بمعالج Core i5 الجيل السابع ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 7th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '7480',
        name: 'DELL Latitude 7480 i5',
        price: 8000,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 7480 بمعالج Core i5 الجيل السابع ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 7th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5480',
        name: 'DELL Latitude 5480 i5',
        price: 8500,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 5480 بمعالج Core i5 الجيل الثامن ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 8th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '7400',
        name: 'DELL Latitude 7400',
        price: 11000,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 7400 بمعالج Core i5 الجيل الثامن ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 8th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '7480',
        name: 'DELL Latitude 7480 i7',
        price: 9500,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 7480 بمعالج Core i7 الجيل السادس ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i7 6th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Lenovo',
        model: 'T470',
        name: 'Lenovo ThinkPad T470',
        price: 9000,
        category: 'Laptops',
        description: 'لابتوب Lenovo ThinkPad T470 بمعالج Core i7 الجيل السابع ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i7 7th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5480',
        name: 'DELL Latitude 5480 i7',
        price: 10500,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 5480 بمعالج Core i7 الجيل السادس ورام 8 جيجا وهارد 256 جيجا SSD وكارت شاشة AMD 2G.',
        specifications: {
            cpu: 'Core i7 6th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'AMD 2G',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5550',
        name: 'DELL Latitude 5550',
        price: 11000,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 5550 بمعالج Core i7 الجيل الخامس ورام 8 جيجا وهارد 256 جيجا SSD وكارت شاشة AMD 2G.',
        specifications: {
            cpu: 'Core i7 5th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'AMD 2G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: '745 G5',
        name: 'HP EliteBook 745 G5 Ryzen 7',
        price: 10500,
        category: 'Laptops',
        description: 'لابتوب HP EliteBook 745 G5 بمعالج Ryzen 7 ورام 8 جيجا وهارد 256 جيجا SSD وكارت شاشة AMD 1G.',
        specifications: {
            cpu: 'Ryzen 7',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'AMD 1G',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5570',
        name: 'DELL Latitude 5570',
        price: 10000,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 5570 بمعالج Core i7 الجيل السادس HQ ورام 8 جيجا وهارد 256 جيجا SSD وكارت شاشة AMD 2G.',
        specifications: {
            cpu: 'Core i7 6th Gen HQ',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'AMD 2G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '3590',
        name: 'DELL Latitude 3590',
        price: 12500,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 3590 بمعالج Core i7 الجيل الثامن ورام 8 جيجا وهارد 256 جيجا SSD وكارت شاشة AMD 2G.',
        specifications: {
            cpu: 'Core i7 8th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'AMD 2G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: 'ZBOOK G3',
        name: 'HP ZBook G3',
        price: 14500,
        category: 'Laptops',
        description: 'لابتوب HP ZBook G3 بمعالج Core i7 الجيل السادس HQ ورام 16 جيجا وهارد 512 جيجا SSD وكارت شاشة Nvidia 2G.',
        specifications: {
            cpu: 'Core i7 6th Gen HQ',
            ramMemory: '16 GB',
            hardDiskSize: '512 GB SSD',
            graphicsDescription: 'Nvidia 2G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '7520',
        name: 'DELL Precision 7520 i7-6th',
        price: 16500,
        category: 'Laptops',
        description: 'لابتوب Dell Precision 7520 بمعالج Core i7 الجيل السادس HQ ورام 16 جيجا وهارد 512 جيجا SSD وكارت شاشة Nvidia 4G.',
        specifications: {
            cpu: 'Core i7 6th Gen HQ',
            ramMemory: '16 GB',
            hardDiskSize: '512 GB SSD',
            graphicsDescription: 'Nvidia 4G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5520',
        name: 'DELL Precision 5520',
        price: 17500,
        category: 'Laptops',
        description: 'لابتوب Dell Precision 5520 بمعالج Core i7 الجيل السابع HQ ورام 16 جيجا وهارد 512 جيجا SSD وكارت شاشة Nvidia 4G.',
        specifications: {
            cpu: 'Core i7 7th Gen HQ',
            ramMemory: '16 GB',
            hardDiskSize: '512 GB SSD',
            graphicsDescription: 'Nvidia 4G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5520 Touch',
        name: 'DELL Precision 5520 Touch 4K',
        price: 19500,
        category: 'Laptops',
        description: 'لابتوب Dell Precision 5520 بشاشة تعمل باللمس ودقة 4K بمعالج Core i7 الجيل السابع HQ ورام 16 جيجا وهارد 512 جيجا SSD وكارت شاشة Nvidia 4G.',
        specifications: {
            cpu: 'Core i7 7th Gen HQ',
            ramMemory: '16 GB',
            hardDiskSize: '512 GB SSD',
            graphicsDescription: 'Nvidia 4G',
            screenSize: '15.6" Touch 4K',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: 'ZBook G6',
        name: 'HP ZBook G6',
        price: 22000,
        category: 'Laptops',
        description: 'لابتوب HP ZBook G6 بمعالج Core i7 الجيل التاسع H ورام 16 جيجا وهارد 512 جيجا SSD وكارت شاشة Nvidia 4G.',
        specifications: {
            cpu: 'Core i7 9th Gen H',
            ramMemory: '16 GB',
            hardDiskSize: '512 GB SSD',
            graphicsDescription: 'Nvidia 4G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '7530',
        name: 'DELL Precision 7530',
        price: 25000,
        category: 'Laptops',
        description: 'لابتوب Dell Precision 7530 بمعالج Core i7 الجيل الثامن H ورام 32 جيجا وهارد 512 جيجا SSD وكارت شاشة Nvidia 6G.',
        specifications: {
            cpu: 'Core i7 8th Gen H',
            ramMemory: '32 GB',
            hardDiskSize: '512 GB SSD',
            graphicsDescription: 'Nvidia 6G P3200',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: '745 G6',
        name: 'HP EliteBook 745 G6',
        price: 11500,
        category: 'Laptops',
        description: 'لابتوب HP EliteBook 745 G6 بمعالج Ryzen 5 ورام 8 جيجا وهارد 256 جيجا SSD وكارت شاشة AMD 2G.',
        specifications: {
            cpu: 'Ryzen 5',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'AMD 2G',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: '746 G6',
        name: 'HP EliteBook 746 G6',
        price: 11500,
        category: 'Laptops',
        description: 'لابتوب HP EliteBook 746 G6 بمعالج Ryzen 5 ورام 8 جيجا وهارد 256 جيجا SSD وكارت شاشة AMD 2G.',
        specifications: {
            cpu: 'Ryzen 5',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'AMD 2G',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5590',
        name: 'DELL Latitude 5590',
        price: 11000,
        category: 'Laptops',
        description: 'لابتوب Dell Latitude 5590 بمعالج Core i7 الجيل الثامن ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i7 8th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '7520 i7-7th',
        name: 'DELL Precision 7520 i7-7th',
        price: 18000,
        category: 'Laptops',
        description: 'لابتوب Dell Precision 7520 بمعالج Core i7 الجيل السابع HQ ورام 16 جيجا وهارد 512 جيجا SSD وكارت شاشة Nvidia 4G.',
        specifications: {
            cpu: 'Core i7 7th Gen HQ',
            ramMemory: '16 GB',
            hardDiskSize: '512 GB SSD',
            graphicsDescription: 'Nvidia 4G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5550 i9',
        name: 'DELL Precision 5550 i9',
        price: 32000,
        category: 'Laptops',
        description: 'لابتوب بمواصفات جبارة Dell Precision 5550 بمعالج Core i9 الجيل العاشر H ورام 32 جيجا وهارد 1 تيرا SSD وكارت شاشة Nvidia 4G.',
        specifications: {
            cpu: 'Core i9 10th Gen H',
            ramMemory: '32 GB',
            hardDiskSize: '1 TB SSD',
            graphicsDescription: 'Nvidia 4G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: '5560 i7-11th',
        name: 'DELL Precision 5560 i7-11th',
        price: 35000,
        category: 'Laptops',
        description: 'لابتوب Dell Precision 5560 بمعالج Core i7 الجيل الحادي عشر H ورام 32 جيجا وهارد 1 تيرا SSD وكارت شاشة Nvidia 4G.',
        specifications: {
            cpu: 'Core i7 11th Gen H',
            ramMemory: '32 GB',
            hardDiskSize: '1 TB SSD',
            graphicsDescription: 'Nvidia 4G',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Toshiba',
        model: 'Z30 i5-4th',
        name: 'Toshiba Portege Z30 i5-4th',
        price: 5500,
        category: 'Laptops',
        description: 'لابتوب توشيبا Z30 بمعالج Core i5 الجيل الرابع ورام 8 جيجا وهارد 128 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 4th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '128 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Toshiba',
        model: 'Z30 i5-6th',
        name: 'Toshiba Portege Z30 i5-6th',
        price: 6500,
        category: 'Laptops',
        description: 'لابتوب توشيبا Z30 بمعالج Core i5 الجيل السادس ورام 4 جيجا وهارد 128 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 6th Gen',
            ramMemory: '4 GB',
            hardDiskSize: '128 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Toshiba',
        model: 'Z50',
        name: 'Toshiba Portege Z50',
        price: 7500,
        category: 'Laptops',
        description: 'لابتوب توشيبا Z50 بمعالج Core i5 الجيل السادس ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 6th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Toshiba',
        model: 'R50',
        name: 'Toshiba Satellite R50',
        price: 7000,
        category: 'Laptops',
        description: 'لابتوب توشيبا R50 بمعالج Core i5 الجيل الخامس ورام 8 جيجا وهارد 128 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 5th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '128 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Lenovo',
        model: 'i3-7th',
        name: 'Lenovo Laptop i3-7th',
        price: 6000,
        category: 'Laptops',
        description: 'لابتوب لينوفو بمعالج Core i3 الجيل السابع ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i3 7th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Lenovo',
        model: 'i3-8th',
        name: 'Lenovo Laptop i3-8th',
        price: 7000,
        category: 'Laptops',
        description: 'لابتوب لينوفو بمعالج Core i3 الجيل الثامن ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i3 8th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '14"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: 'Celeron 8th',
        name: 'HP Laptop Celeron 8th',
        price: 4500,
        category: 'Laptops',
        description: 'لابتوب اتش بي بمعالج Celeron الجيل الثامن ورام 8 جيجا وهارد 128 جيجا SSD.',
        specifications: {
            cpu: 'Celeron 8th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '128 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'HP',
        model: 'Celeron 10th',
        name: 'HP Laptop Celeron 10th',
        price: 5500,
        category: 'Laptops',
        description: 'لابتوب اتش بي بمعالج Celeron الجيل العاشر ورام 8 جيجا وهارد 128 جيجا SSD.',
        specifications: {
            cpu: 'Celeron 10th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '128 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'DELL',
        model: 'i5-7th',
        name: 'DELL Laptop i5-7th',
        price: 8500,
        category: 'Laptops',
        description: 'لابتوب ديل بمعالج Core i5 الجيل السابع ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 7th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    },
    {
        brand: 'Lenovo',
        model: 'i5-8th',
        name: 'Lenovo Laptop i5-8th',
        price: 9500,
        category: 'Laptops',
        description: 'لابتوب لينوفو بمعالج Core i5 الجيل الثامن ورام 8 جيجا وهارد 256 جيجا SSD.',
        specifications: {
            cpu: 'Core i5 8th Gen',
            ramMemory: '8 GB',
            hardDiskSize: '256 GB SSD',
            graphicsDescription: 'Intel Graphics',
            screenSize: '15.6"',
        },
        thumbnail: 'https://res.cloudinary.com/demo/image/upload/v1/laptop-placeholder.jpg'
    }
];

async function syncLaptops() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected!');

        console.log('Removing all existing laptops...');
        const deleteResult = await Product.deleteMany({ category: 'Laptops' });
        console.log(`Removed ${deleteResult.deletedCount} laptops.`);

        console.log('Adding new laptops from images...');
        let addedCount = 0;
        for (const laptop of newLaptops) {
            const product = new Product(laptop);
            await product.save();
            console.log(`Added: ${laptop.name}`);
            addedCount++;
        }

        console.log(`Success! Added ${addedCount} laptops.`);
        process.exit(0);
    } catch (error) {
        console.error('Error syncing laptops:', error);
        process.exit(1);
    }
}

syncLaptops();
