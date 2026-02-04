import { Book, Category } from './types';

export const BOOKS: Book[] = [
  {
    id: '1',
    title: 'ፍቅር እስከ መቃብር',
    author: 'ሀዲስ አለማየሁ',
    description: 'የኢትዮጵያ ስነ-ጽሁፍ ድንቅ ስራ የሆነው ይህ መጽሐፍ ስለ ፍቅር፣ ስለ ማህበራዊ ህይወት እና ስለ ባህል በጥልቀት ይተርካል።',
    price: 350,
    category: 'fiction',
    coverImage: 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&h=1067&auto=format&fit=crop',
    rating: 4.9,
    year: '1958',
    isNew: true,
    previewPages: [
      "ምዕራፍ አንድ፡ የመጀመርያው ገጽ። በኢትዮጵያ ስነ-ጽሁፍ ውስጥ ትልቅ ቦታ ያለው ይህ ድንቅ ስራ ሲጀምር እንዲህ ይላል...",
      "ፍቅር ማለት ምን እንደሆነ የሚገልጽ ድንቅ ምንባብ። ቦጋለ እና ሰብለ ወንጌል ለመጀመሪያ ጊዜ የተገናኙበት ቅጽበት...",
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
    description: 'የታሪክ፣ የፖለቲካ እና የሰው ልጅ እልህ የሚታይበት፣ በኢትዮጵያ ስነ-ጽሁፍ ውስጥ ትልቅ አነጋጋሪነት የነበረው መጽሐፍ።',
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
    description: 'በወጣቶች ህይወት እና በፍቅር ዙሪያ የሚያጠነጥን፣ በርካታ አንባቢዎችን ቀልብ የገዛ መጽሐፍ።',
    price: 250
