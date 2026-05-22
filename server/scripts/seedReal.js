import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Png from '../models/Png.js';

dotenv.config();

const slugify = (text) => text.toString().toLowerCase().trim().replace(/[\s\W-]+/g, '-').replace(/^-+|-+$/g, '');

const MOCK_PNG_DATA = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH6AYWDBkXmU6LuwAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmR2AAAAd0lEQVR42u3PMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgBlMIAAE3h1d0AAAAAElFTkSuQmCC';

const realCategories = [
  {
    name: 'Technology',
    description: 'Smartphones, laptops, hardware components, and futuristic tech gadgets.',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'iPhone 15 Pro Titanium', tags: ['apple', 'smartphone', 'phone', 'mobile'] },
      { title: 'MacBook Air M3 Silver', tags: ['apple', 'laptop', 'computer', 'mac'] },
      { title: 'Mechanical Gaming Keyboard', tags: ['keyboard', 'gaming', 'rgb', 'tech'] },
      { title: 'Wireless Noise-Canceling Headphones', tags: ['audio', 'headphones', 'music', 'bluetooth'] },
      { title: '4K Ultra Wide Monitor', tags: ['monitor', 'screen', 'display', 'pc'] },
      { title: 'NVIDIA RTX 4090 GPU', tags: ['gpu', 'hardware', 'graphics card', 'gaming'] },
      { title: 'Smart Watch Series 9', tags: ['watch', 'smartwatch', 'wearable', 'apple'] },
      { title: 'VR Headset Meta Quest', tags: ['vr', 'virtual reality', 'headset', 'gaming'] },
      { title: 'Mirrorless Camera Body', tags: ['camera', 'photography', 'lens', 'tech'] },
      { title: 'Drone with 4K Camera', tags: ['drone', 'flying', 'camera', 'gadget'] }
    ]
  },
  {
    name: 'Furniture',
    description: 'Chairs, tables, sofas, and modern home decor elements.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'Modern Mid-Century Armchair', tags: ['chair', 'furniture', 'seating', 'modern'] },
      { title: 'Leather Chester Sofa', tags: ['sofa', 'couch', 'leather', 'living room'] },
      { title: 'Oak Wood Dining Table', tags: ['table', 'wood', 'dining', 'furniture'] },
      { title: 'Ergonomic Office Chair', tags: ['office', 'chair', 'work', 'ergonomic'] },
      { title: 'Minimalist Bed Frame', tags: ['bed', 'bedroom', 'sleep', 'furniture'] },
      { title: 'Glass Coffee Table', tags: ['table', 'glass', 'living room', 'modern'] },
      { title: 'Wooden Bookshelf', tags: ['shelf', 'wood', 'books', 'storage'] },
      { title: 'Vintage Bedside Table', tags: ['table', 'vintage', 'bedroom', 'wood'] },
      { title: 'Hanging Egg Chair', tags: ['chair', 'outdoor', 'hanging', 'patio'] },
      { title: 'Floor Lamp Brushed Steel', tags: ['lamp', 'lighting', 'decor', 'metal'] }
    ]
  },
  {
    name: 'Vehicles',
    description: 'Cars, motorcycles, bicycles, and other modes of transportation.',
    image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'Red Sports Car Ferrari', tags: ['car', 'sports car', 'red', 'fast'] },
      { title: 'Electric SUV Tesla Model Y', tags: ['car', 'ev', 'tesla', 'electric'] },
      { title: 'Vintage Ford Mustang', tags: ['car', 'classic', 'mustang', 'vintage'] },
      { title: 'Yamaha Sport Motorcycle', tags: ['motorcycle', 'bike', 'sport', 'yamaha'] },
      { title: 'Vespa Classic Scooter', tags: ['scooter', 'vespa', 'italy', 'transport'] },
      { title: 'Mountain Bike Trek', tags: ['bicycle', 'bike', 'mountain', 'sports'] },
      { title: 'Commercial Boeing Airplane', tags: ['airplane', 'aviation', 'flight', 'travel'] },
      { title: 'City Transit Bus', tags: ['bus', 'transit', 'city', 'transport'] },
      { title: 'Luxury Yacht', tags: ['boat', 'yacht', 'ocean', 'luxury'] },
      { title: 'High-Speed Bullet Train', tags: ['train', 'bullet train', 'japan', 'travel'] }
    ]
  },
  {
    name: 'Animals',
    description: 'Wild beasts, domestic pets, birds, and marine life.',
    image: 'https://images.unsplash.com/photo-1456926631375-92c8ce872def?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'African Lion Roaring', tags: ['lion', 'animal', 'wildlife', 'cat'] },
      { title: 'Golden Retriever Puppy', tags: ['dog', 'puppy', 'pet', 'cute'] },
      { title: 'Fluffy Persian Cat', tags: ['cat', 'kitten', 'pet', 'fluffy'] },
      { title: 'Bald Eagle Flying', tags: ['bird', 'eagle', 'wildlife', 'flying'] },
      { title: 'Great White Shark', tags: ['shark', 'fish', 'ocean', 'marine'] },
      { title: 'Adult African Elephant', tags: ['elephant', 'animal', 'safari', 'wildlife'] },
      { title: 'Emperor Penguin Standing', tags: ['penguin', 'bird', 'ice', 'snow'] },
      { title: 'Monarch Butterfly', tags: ['butterfly', 'insect', 'nature', 'wings'] },
      { title: 'Red Fox Walking', tags: ['fox', 'animal', 'wild', 'forest'] },
      { title: 'Bottlenose Dolphin Jumping', tags: ['dolphin', 'ocean', 'marine', 'jumping'] }
    ]
  },
  {
    name: 'Plants & Nature',
    description: 'Trees, flowers, house plants, and natural elements.',
    image: 'https://images.unsplash.com/photo-1416879598555-220b3329ab51?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'Monstera Deliciosa Leaf', tags: ['leaf', 'monstera', 'plant', 'tropical'] },
      { title: 'Red Rose Blooming', tags: ['flower', 'rose', 'red', 'romance'] },
      { title: 'Potted Snake Plant', tags: ['plant', 'houseplant', 'pot', 'green'] },
      { title: 'Pine Tree Evergreen', tags: ['tree', 'pine', 'forest', 'nature'] },
      { title: 'Sunflower Full Bloom', tags: ['flower', 'sunflower', 'yellow', 'summer'] },
      { title: 'Bonsai Tree Ceramic Pot', tags: ['bonsai', 'tree', 'japan', 'plant'] },
      { title: 'Cactus with Spikes', tags: ['cactus', 'desert', 'plant', 'green'] },
      { title: 'Cherry Blossom Branch', tags: ['sakura', 'branch', 'flower', 'spring'] },
      { title: 'Green Grass Patch', tags: ['grass', 'lawn', 'nature', 'green'] },
      { title: 'Autumn Maple Leaf', tags: ['leaf', 'fall', 'autumn', 'orange'] }
    ]
  },
  {
    name: 'Food & Drink',
    description: 'Delicious meals, fresh ingredients, and beverages.',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'Double Cheeseburger', tags: ['burger', 'food', 'meat', 'fast food'] },
      { title: 'Pepperoni Pizza Slice', tags: ['pizza', 'slice', 'italian', 'cheese'] },
      { title: 'Fresh Red Apple', tags: ['apple', 'fruit', 'healthy', 'red'] },
      { title: 'Hot Cup of Coffee', tags: ['coffee', 'cup', 'drink', 'morning'] },
      { title: 'Chocolate Chip Cookie', tags: ['cookie', 'dessert', 'sweet', 'baking'] },
      { title: 'Avocado Half', tags: ['avocado', 'vegetable', 'green', 'healthy'] },
      { title: 'Glass of Orange Juice', tags: ['juice', 'drink', 'orange', 'glass'] },
      { title: 'Sushi Roll Platter', tags: ['sushi', 'japanese', 'fish', 'rice'] },
      { title: 'Glazed Donut', tags: ['donut', 'sweet', 'pastry', 'sugar'] },
      { title: 'Fresh Strawberry', tags: ['strawberry', 'fruit', 'red', 'berry'] }
    ]
  },
  {
    name: 'Clothing',
    description: 'Apparel, shoes, accessories, and fashion items.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'Blank White T-Shirt', tags: ['tshirt', 'shirt', 'clothing', 'white'] },
      { title: 'Blue Denim Jeans', tags: ['jeans', 'pants', 'denim', 'clothing'] },
      { title: 'Classic Leather Jacket', tags: ['jacket', 'leather', 'black', 'clothing'] },
      { title: 'Nike Air Jordan Sneaker', tags: ['sneaker', 'shoe', 'nike', 'footwear'] },
      { title: 'Red High Heel Shoe', tags: ['shoe', 'heels', 'fashion', 'red'] },
      { title: 'Winter Knit Beanie', tags: ['beanie', 'hat', 'winter', 'clothing'] },
      { title: 'Black Sunglasses', tags: ['sunglasses', 'glasses', 'summer', 'accessories'] },
      { title: 'Brown Leather Belt', tags: ['belt', 'leather', 'accessories', 'brown'] },
      { title: 'Luxury Gold Watch', tags: ['watch', 'gold', 'luxury', 'jewelry'] },
      { title: 'Yellow Raincoat', tags: ['coat', 'raincoat', 'yellow', 'clothing'] }
    ]
  },
  {
    name: 'Sports Equipment',
    description: 'Balls, bats, rackets, and athletic gear.',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'Classic Soccer Ball', tags: ['soccer', 'ball', 'sports', 'football'] },
      { title: 'Leather Basketball', tags: ['basketball', 'ball', 'sports', 'orange'] },
      { title: 'Tennis Racket', tags: ['tennis', 'racket', 'sports', 'equipment'] },
      { title: 'Baseball Bat Wood', tags: ['baseball', 'bat', 'wood', 'sports'] },
      { title: 'Boxing Gloves Red', tags: ['boxing', 'gloves', 'fight', 'sports'] },
      { title: 'Golf Club Driver', tags: ['golf', 'club', 'sports', 'driver'] },
      { title: 'Snowboard Deck', tags: ['snowboard', 'winter', 'sports', 'board'] },
      { title: 'Yoga Mat Rolled', tags: ['yoga', 'mat', 'fitness', 'exercise'] },
      { title: 'Dumbbell Weight 20kg', tags: ['dumbbell', 'weight', 'gym', 'fitness'] },
      { title: 'Surfboard Surf', tags: ['surfboard', 'surf', 'water', 'sports'] }
    ]
  },
  {
    name: 'Musical Instruments',
    description: 'Guitars, pianos, drums, and music production gear.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'Acoustic Wooden Guitar', tags: ['guitar', 'music', 'acoustic', 'instrument'] },
      { title: 'Electric Guitar Stratocaster', tags: ['guitar', 'electric', 'music', 'rock'] },
      { title: 'Grand Piano Black', tags: ['piano', 'keys', 'music', 'classical'] },
      { title: 'Drum Kit Set', tags: ['drums', 'kit', 'music', 'percussion'] },
      { title: 'Brass Saxophone', tags: ['saxophone', 'jazz', 'music', 'brass'] },
      { title: 'Classical Violin with Bow', tags: ['violin', 'strings', 'music', 'classical'] },
      { title: 'DJ Turntable Controller', tags: ['dj', 'turntable', 'music', 'electronic'] },
      { title: 'Studio Microphone', tags: ['microphone', 'mic', 'recording', 'studio'] },
      { title: 'Synthesizer Keyboard', tags: ['synth', 'keyboard', 'music', 'electronic'] },
      { title: 'Wooden Ukulele', tags: ['ukulele', 'hawaii', 'music', 'instrument'] }
    ]
  },
  {
    name: 'Office Supplies',
    description: 'Pens, paper, staplers, and desk accessories.',
    image: 'https://images.unsplash.com/photo-1497032205567-50458dd0400d?w=500&auto=format&fit=crop&q=60',
    items: [
      { title: 'Yellow Graphite Pencil', tags: ['pencil', 'writing', 'school', 'yellow'] },
      { title: 'Blue Ballpoint Pen', tags: ['pen', 'writing', 'office', 'blue'] },
      { title: 'Spiral Bound Notebook', tags: ['notebook', 'paper', 'school', 'notes'] },
      { title: 'Red Metal Stapler', tags: ['stapler', 'office', 'metal', 'red'] },
      { title: 'Coffee Mug White', tags: ['mug', 'coffee', 'office', 'cup'] },
      { title: 'Paper Clips Silver', tags: ['clips', 'metal', 'office', 'paper'] },
      { title: 'Scissors Steel', tags: ['scissors', 'cutting', 'tool', 'office'] },
      { title: 'Sticky Notes Yellow', tags: ['notes', 'sticky', 'paper', 'office'] },
      { title: 'Desk Organizer', tags: ['organizer', 'desk', 'office', 'storage'] },
      { title: 'Calculator Digital', tags: ['calculator', 'math', 'office', 'school'] }
    ]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pixelink');
    console.log('Connected to MongoDB for real-world data seeding...');

    await User.deleteMany();
    await Category.deleteMany();
    await Png.deleteMany();
    console.log('Database wiped.');

    const adminUser = await User.create({
      email: 'admin@pixelink.com',
      password: 'admin12345',
      role: 'admin',
    });
    console.log('Admin user recreated: admin@pixelink.com');

    console.log('Inserting 10 Real Categories...');
    const createdCategories = [];
    for (const cat of realCategories) {
      const newCat = await Category.create({
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
        image: cat.image
      });
      createdCategories.push({ model: newCat, items: cat.items });
    }

    console.log('Inserting 100 Real PNG Assets (10 per category)...');
    const pngsToInsert = [];

    createdCategories.forEach(catObj => {
      catObj.items.forEach(item => {
        pngsToInsert.push({
          title: item.title,
          slug: slugify(item.title) + '-' + Math.floor(Math.random() * 1000),
          description: `High-quality transparent PNG Png's of ${item.title}. Perfect for your next design project, completely free to download and use without attribution.`,
          imageUrl: MOCK_PNG_DATA,
          thumbnailUrl: MOCK_PNG_DATA,
          category: catObj.model._id,
          tags: item.tags,
          downloads: Math.floor(Math.random() * 5000),
          views: Math.floor(Math.random() * 20000),
          featured: Math.random() > 0.8,
          approved: true,
          uploadedBy: adminUser._id,
        });
      });
    });

    await Png.insertMany(pngsToInsert);
    console.log(`Successfully seeded ${createdCategories.length} categories and ${pngsToInsert.length} PNGs.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
