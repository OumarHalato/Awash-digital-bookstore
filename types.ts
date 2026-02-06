
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  rating: number;
  year?: string;
  previewPages?: string[];
  isNew?: boolean;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

// Added SortOption type to fix "Cannot find name 'SortOption'" error in App.tsx
export type SortOption = 'default' | 'title' | 'author' | 'price-low' | 'price-high' | 'year-newest' | 'year-oldest';
