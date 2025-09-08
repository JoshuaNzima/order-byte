export interface Organization {
  id: string;
  name: string;
  logo?: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  contact: {
    phone?: string;
    website?: string;
  };
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  allergens?: string[];
  dietary?: ('vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free')[];
  available: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
  order: number;
}

export interface Menu {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  categories: MenuCategory[];
  isActive: boolean;
  lastUpdated: Date;
}