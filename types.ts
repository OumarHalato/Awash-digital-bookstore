
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
