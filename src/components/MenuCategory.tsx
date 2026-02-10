import { MenuCategory as MenuCategoryType } from '@/shared/types/menu';
import MenuItem from './MenuItem';

interface MenuCategoryProps {
  category: MenuCategoryType;
  accentColor: string;
}

export default function MenuCategory({ category, accentColor }: MenuCategoryProps) {
  return (
    <div className="mb-8">
      <div className="mb-6">
        <h2 
          className="text-xl font-bold mb-2"
          style={{ color: accentColor }}
        >
          {category.name}
        </h2>
        {category.description && (
          <p className="text-gray-600 text-sm">
            {category.description}
          </p>
        )}
      </div>
      
      <div className="space-y-4">
        {category.items
          .filter(item => item.available)
          .concat(category.items.filter(item => !item.available))
          .map((item) => (
            <MenuItem 
              key={item.id} 
              item={item} 
              accentColor={accentColor}
            />
          ))}
      </div>
    </div>
  );
}