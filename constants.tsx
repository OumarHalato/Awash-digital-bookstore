
import { Book, Category } from './types';

export const BOOKS: Book[] = [
  {
    id: '1',
    title: 'ፍቅር እስከ መቃብር',
    author: 'ሀዲስ አለማየሁ',
    description: 'የኢትዮጵያ ስነ-ጽሁፍ ድንቅ ስራ የሆነው ይህ መፅሀፍ ስለ ፍቅር፣ ስለ ማህበራዊ ህይወት እና ስለ ባህል በጥልቀት ይተርካል።',
    price: 350,
    category: 'fiction',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&h=1067&auto=format&fit=crop',
    rating: 4.9,
    year: '1958',
    isNew: true,
    previewPages: [
      "ምዕራፍ አንድ፡ የመጀመርያው ገጽ። በኢትዮጵያ ስነ-ጽሁፍ ውስጥ ትልቅ ቦታ ያለው ይህ ድንቅ ስራ ሲጀምር እንዲህ ይላል...",
      "ፍቅር ማለት ምን እንደሆነ የሚገልጽ ድንቅ ምንባብ። ቦጋለ እና ሰብለ ወንጌል ለመጀመርያ ጊዜ የተገናኙበት ቅጽበት...",
      "የማህበራዊ ህይወት እና የባህል ግጭቶች የሚታዩበት ጥልቅ የታሪክ ክፍል..."
    ]
  },
  {
    id: '2',
    title: 'አደፍርስ',
    author: 'ዳኛቸው ወርቁ',
    description: 'በዘመናዊ የኢትዮጵያ ስነ-ጽሁፍ ውስጥ ልዩ ስፍራ ያለውና የሰውን ልጅ ማንነት የሚመረምር ድንቅ ስራ።',
    price: 280,
    category: 'fiction',
    coverImage: 'https://picsum.photos/seed/book2/400/600',
    rating: 4.7,
    year: '1962',
    previewPages: [
      "ገጽ ፩፡ አደፍርስ በሃሳብ ተውጧል። በአዲስ አበባ ጎዳናዎች ላይ ሲራመድ የነበረው ጥልቅ ትዝታ...",
      "የሰው ልጅ ማንነት እና የዘመናዊነት ግጭት በዳኛቸው ወርቁ ብዕር ሲገለጽ...",
      "የፍልስፍና እና የታሪክ ውህደት የሚታይበት ድንቅ ገጽ..."
    ]
  },
  {
    id: '3',
    title: 'ኦሮማይ',
    author: 'በአሉ ግርማ',
    description: 'የታሪክ፣ የፖለቲካ እና የሰው ልጅ እልህ የሚታይበት፣ በኢትዮጵያ ስነ-ጽሁፍ ውስጥ ትልቅ አነጋጋሪነት የነበረው መፅሀፍ።',
    price: 320,
    category: 'history',
    coverImage: 'https://picsum.photos/seed/book3/400/600',
    rating: 4.8,
    year: '1983',
    isNew: true,
    previewPages: [
      "ምዕራፍ አንድ፡ የቀይ ኮከብ ዘመቻ። የአስመራ ከተማ ግርግር እና የወታደራዊ እንቅስቃሴው መጀመሪያ...",
      "ጸጋዬ እና አሊማ ለመጀመሪያ ጊዜ የተያዩበት ቅጽበት። በጦርነት መሃል የበቀለ ፍቅር...",
      "የእልህ እና የፖለቲካ ውጥረት የሚታይበት አነጋጋሪ ክፍል..."
    ]
  },
  {
    id: '4',
    title: 'ሰመመን',
    author: 'ሲሳይ ንጉሱ',
    description: 'በወጣቶች ህይወት and በፍቅር ዙሪያ የሚያጠነጥን፣ በርካታ አንባቢዎችን ቀልብ የገዛ መፅሀፍ።',
    price: 250,
    category: 'romance',
    coverImage: 'https://picsum.photos/seed/book4/400/600',
    rating: 4.5,
    year: '1987',
    previewPages: [
      "በዩኒቨርሲቲ ግቢ ውስጥ የጀመረው የሰመመን ታሪክ። የወጣቶች ህልም እና ተስፋ...",
      "የፍቅር ሰመመን ውስጥ የገቡት ገጸ-ባህሪያት ስሜት የሚገልጽ ክፍል...",
      "የህይወት ፈተናዎች እና የፍቅር ጥንካሬ የሚታይበት ድንቅ ምዕራፍ..."
    ]
  },
  {
    id: '5',
    title: 'የኢትዮጵያ ታሪክ',
    author: 'ተክለፃዲቅ መኩሪያ',
    description: 'ስለ ኢትዮጵያ ዘመናዊ ታሪክ ግንዛቤን የሚሰጥ መሰረታዊ መፅሀፍ።',
    price: 450,
    category: 'history',
    coverImage: 'https://picsum.photos/seed/book5/400/600',
    rating: 4.9,
    year: '1945',
    isNew: true
  },
  {
    id: '6',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy & proven way to build good habits & break bad ones.',
    price: 420,
    category: 'self-help',
    coverImage: 'https://picsum.photos/seed/book6/400/600',
    rating: 4.8,
    year: '2018',
    isNew: true
  },
  { id: '7', title: 'የቀይ ኮከብ ጥሪ', author: 'በአሉ ግርማ', description: 'ስለ ኢትዮጵያ አብዮት እና ስለ ሶማሊያ ጦርነት የሚተርክ ድንቅ ስራ።', price: 310, category: 'history', coverImage: 'https://picsum.photos/seed/book7/400/600', rating: 4.6, year: '1980' },
  { id: '8', title: 'ልጅነት', author: 'ዘነበ ወላ', description: 'ስለ ልጅነት ትዝታ እና ስለ ኢትዮጵያ ማህበረሰብ የሚተርክ መፅሀፍ።', price: 180, category: 'fiction', coverImage: 'https://picsum.photos/seed/book8/400/600', rating: 4.4, year: '2005' },
  { id: '9', title: 'ተልባ', author: 'አዳም ረታ', description: 'የአዳም ረታን ልዩ የፅሁፍ ስልት የሚያሳይ ድንቅ የልብ ወለድ ስራ።', price: 290, category: 'fiction', coverImage: 'https://picsum.photos/seed/book9/400/600', rating: 4.7, year: '2010' },
  { id: '10', title: 'The Alchemist', author: 'Paulo Coelho', description: 'A fable about following your dreams and listening to your heart.', price: 380, category: 'fiction', coverImage: 'https://picsum.photos/seed/book10/400/600', rating: 4.9, year: '1988' },
  { id: '11', title: 'ባለ እጅ ስራው', author: 'ስብሃት ገብረእግዚአብሔር', description: 'ስለ ህይወት እና ስለ ፍልስፍና የሚተርኩ የስብሃት ድንቅ አጫጭር ታሪኮች።', price: 220, category: 'fiction', coverImage: 'https://picsum.photos/seed/book11/400/600', rating: 4.8, year: '1995' },
  { id: '12', title: 'Deep Work', author: 'Cal Newport', description: 'Rules for focused success in a distracted world.', price: 450, category: 'self-help', coverImage: 'https://picsum.photos/seed/book12/400/600', rating: 4.7, year: '2016' },
  { id: '13', title: 'ሀገሬ', author: 'ፀጋዬ ገብረመድህን', description: 'ስለ ኢትዮጵያዊነት እና ስለ ሀገር ፍቅር የሚሰብኩ ድንቅ ግጥሞች።', price: 150, category: 'fiction', coverImage: 'https://picsum.photos/seed/book13/400/600', rating: 5.0, year: '1970' },
  { id: '14', title: 'The Power of Now', author: 'Eckhart Tolle', description: 'A guide to spiritual enlightenment.', price: 410, category: 'self-help', coverImage: 'https://picsum.photos/seed/book14/400/600', rating: 4.6, year: '1997' },
  { id: '15', title: 'Sapiens', author: 'Yuval Noah Harari', description: 'A brief history of humankind.', price: 550, category: 'history', coverImage: 'https://picsum.photos/seed/book15/400/600', rating: 4.8, year: '2011' },
  { id: '16', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', description: 'An exploration of the two systems that drive the way we think.', price: 490, category: 'self-help', coverImage: 'https://picsum.photos/seed/book16/400/600', rating: 4.7, year: '2011' },
  { id: '17', title: 'መቅደስ', author: 'ይስማዕከ ወርቁ', description: 'ዘመናዊ የኢትዮጵያ ስነ-ጽሁፍ ፍጥረት የሆነ አሳታሚ ስራ።', price: 260, category: 'fiction', coverImage: 'https://picsum.photos/seed/book17/400/600', rating: 4.5, year: '2014', isNew: true },
  { id: '18', title: 'ኑሮ በዘዴ', author: 'ዶ/ር ምህረት ደበበ', description: 'የስነ-ልቦና እውቀትን ለህይወት ስኬት የሚጠቀም ድንቅ መፅሀፍ።', price: 340, category: 'self-help', coverImage: 'https://picsum.photos/seed/book18/400/600', rating: 4.8, year: '2013' }
];

export const CATEGORIES: Category[] = [
  { id: 'all', label: 'ሁሉም', icon: '📚' },
  { id: 'new', label: 'አዲስ የገቡ', icon: '✨' },
  { id: 'fiction', label: 'ልብ ወለድ', icon: '🎨' },
  { id: 'history', label: 'ታሪክ', icon: '🏛️' },
  { id: 'romance', label: 'ፍቅር', icon: '💖' },
  { id: 'self-help', label: 'ራስን ማገዝ', icon: '🧘' },
  { id: 'kids', label: 'ለልጆች', icon: '🧸' }
];
