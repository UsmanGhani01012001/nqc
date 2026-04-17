import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.compare_at_price!) * 100)
    : 0;

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-card rounded-xl border border-gold overflow-hidden hover:glow-gold transition-all duration-300"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            No Image
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-3 left-3 bg-gradient-gold text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-md">
            -{discount}%
          </span>
        )}
        <span className="absolute top-3 right-3 bg-background/80 backdrop-blur text-[10px] text-primary font-semibold px-2 py-1 rounded">
          COD ✓
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-3 leading-snug">
          {product.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gradient-gold">
            Rs. {product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-xs text-muted-foreground line-through">
              Rs. {product.compare_at_price!.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
