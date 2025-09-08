import { Organization, Menu, MenuCategory, MenuItem } from '@/types/menu';

export const organizations: Organization[] = [
  {
    id: 'bella-vista',
    name: 'Bella Vista Restaurant',
    theme: {
      primaryColor: '#2d3748',
      secondaryColor: '#4a5568',
      accentColor: '#f6ad55',
    },
    contact: {
      phone: '+1 (555) 123-4567',
      website: 'www.bellavista.com',
    },
  },
  {
    id: 'urban-cafe',
    name: 'Urban Café',
    theme: {
      primaryColor: '#1a202c',
      secondaryColor: '#2d3748',
      accentColor: '#68d391',
    },
    contact: {
      phone: '+1 (555) 987-6543',
      website: 'www.urbancafe.com',
    },
  },
];

const bellaVistaItems: MenuItem[] = [
  {
    id: 'margherita',
    name: 'Margherita Pizza',
    description: 'Fresh tomato sauce, mozzarella, basil, olive oil',
    price: 16.99,
    dietary: ['vegetarian'],
    available: true,
  },
  {
    id: 'carbonara',
    name: 'Pasta Carbonara',
    description: 'Creamy pasta with pancetta, egg, and parmesan',
    price: 18.99,
    available: true,
  },
  {
    id: 'tiramisu',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee and mascarpone',
    price: 8.99,
    dietary: ['vegetarian'],
    available: true,
  },
];

const urbanCafeItems: MenuItem[] = [
  {
    id: 'avocado-toast',
    name: 'Avocado Toast',
    description: 'Sourdough bread with smashed avocado, lime, and sea salt',
    price: 12.99,
    dietary: ['vegan', 'dairy-free'],
    available: true,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    description: 'Rich espresso with steamed milk foam',
    price: 4.99,
    dietary: ['vegetarian'],
    available: true,
  },
  {
    id: 'acai-bowl',
    name: 'Acai Bowl',
    description: 'Açaí with granola, berries, and coconut flakes',
    price: 14.99,
    dietary: ['vegan', 'gluten-free', 'dairy-free'],
    available: true,
  },
];

export const menus: Menu[] = [
  {
    id: 'bella-vista-main',
    organizationId: 'bella-vista',
    name: 'Main Menu',
    categories: [
      {
        id: 'mains',
        name: 'Main Courses',
        items: bellaVistaItems.slice(0, 2),
        order: 1,
      },
      {
        id: 'desserts',
        name: 'Desserts',
        items: bellaVistaItems.slice(2),
        order: 2,
      },
    ],
    isActive: true,
    lastUpdated: new Date(),
  },
  {
    id: 'urban-cafe-all-day',
    organizationId: 'urban-cafe',
    name: 'All Day Menu',
    categories: [
      {
        id: 'food',
        name: 'Food',
        items: urbanCafeItems.filter(item => item.id !== 'cappuccino'),
        order: 1,
      },
      {
        id: 'beverages',
        name: 'Beverages',
        items: urbanCafeItems.filter(item => item.id === 'cappuccino'),
        order: 2,
      },
    ],
    isActive: true,
    lastUpdated: new Date(),
  },
];