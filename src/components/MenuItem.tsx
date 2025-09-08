import { MenuItem as MenuItemType } from '@/types/menu';

interface MenuItemProps {
  item: MenuItemType;
  accentColor: string;
}

export default function MenuItem({ item, accentColor }: MenuItemProps) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  const getDietaryBadgeColor = (dietary: string) => {
    switch (dietary) {
      case 'vegan':
        return 'bg-green-100 text-green-800';
      case 'vegetarian':
        return 'bg-green-100 text-green-700';
      case 'gluten-free':
        return 'bg-blue-100 text-blue-800';
      case 'dairy-free':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg bg-white shadow-sm border ${!item.available ? 'opacity-60' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
        <span 
          className="font-bold text-lg ml-4 flex-shrink-0"
          style={{ color: accentColor }}
        >
          {formatPrice(item.price)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-3 leading-relaxed">
        {item.description}
      </p>

      {item.dietary && item.dietary.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {item.dietary.map((diet) => (
            <span
              key={diet}
              className={`px-2 py-1 rounded-full text-xs font-medium ${getDietaryBadgeColor(diet)}`}
            >
              {diet.replace('-', ' ')}
            </span>
          ))}
        </div>
      )}

      {!item.available && (
        <div className="text-red-500 text-sm font-medium">
          Currently unavailable
        </div>
      )}
    </div>
  );
}