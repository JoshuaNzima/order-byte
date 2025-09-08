import { useState } from 'react';
import { MenuItem as MenuItemType } from '@/types/menu';
import { useCartContext } from '@/context/CartContext';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface MenuItemProps {
  item: MenuItemType;
  accentColor: string;
}

export default function MenuItem({ item, accentColor }: MenuItemProps) {
  const { addToCart } = useCartContext();
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatPrice = (price: number) => `MK ${price.toLocaleString('en-MW')}`;

  const getDietaryBadgeColor = (dietary: string) => {
    switch (dietary) {
      case 'vegan':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'vegetarian':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'gluten-free':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'dairy-free':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleAddToCart = async () => {
    if (!item.available) return;
    
    setIsAdding(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate add animation
    
    addToCart(item);
    setIsAdding(false);
    setShowSuccess(true);
    
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <Card 
      className={`p-5 transition-all duration-300 ${!item.available ? 'opacity-60' : 'hover:shadow-md'}`}
      hover={item.available}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight pr-4">{item.name}</h3>
        <span 
          className="font-bold text-xl flex-shrink-0 bg-gradient-to-r from-current to-current bg-clip-text"
          style={{ color: accentColor }}
        >
          {formatPrice(item.price)}
        </span>
      </div>
      
      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
        {item.description}
      </p>

      {item.dietary && item.dietary.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {item.dietary.map((diet) => (
            <span
              key={diet}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${getDietaryBadgeColor(diet)}`}
            >
              {diet.replace('-', ' ')}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        {!item.available ? (
          <div className="text-red-500 text-sm font-medium bg-red-50 px-3 py-1 rounded-full">
            Currently unavailable
          </div>
        ) : (
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="sm"
            isLoading={isAdding}
            className={`transition-all duration-200 ${showSuccess ? 'bg-green-600 hover:bg-green-700' : ''}`}
            style={!showSuccess ? { backgroundColor: accentColor, borderColor: accentColor } : {}}
          >
            {showSuccess ? (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Added!
              </span>
            ) : (
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Cart
              </span>
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}