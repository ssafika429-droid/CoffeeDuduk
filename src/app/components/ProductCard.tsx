import { ShoppingCart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold">Stok Habis</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-[var(--color-coffee-dark)] mb-2">
          {product.name}
        </h3>
        <p className="text-sm text-[var(--color-coffee-light)] mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-bold text-[var(--color-coffee-medium)]">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
            <p className="text-xs text-[var(--color-coffee-light)]">
              Stok: {product.stock}
            </p>
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
            className="p-3 bg-[var(--color-coffee-medium)] text-white rounded-lg hover:bg-[var(--color-coffee-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
