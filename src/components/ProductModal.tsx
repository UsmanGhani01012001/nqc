import { X, ChevronLeft, ChevronRight, MessageCircle, Truck } from "lucide-react";
import { Product } from "@/data/products";
import { useState } from "react";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal = ({ product, onClose }: ProductModalProps) => {
  const [imgIndex, setImgIndex] = useState(0);
  const images = product.images.length > 0 ? product.images : [];
  const hasDiscount = product.comparePrice && parseFloat(product.comparePrice) > parseFloat(product.price);

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in "${product.title}" priced at Rs. ${parseFloat(product.price).toLocaleString()}. Is it available?`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative bg-card border border-gold rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-background/50 backdrop-blur rounded-full p-2 text-foreground hover:text-primary transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {images.length > 0 && (
          <div className="relative aspect-square bg-secondary">
            <img
              src={images[imgIndex]}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur rounded-full p-2 text-foreground hover:text-primary"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/60 backdrop-blur rounded-full p-2 text-foreground hover:text-primary"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === imgIndex ? "bg-primary" : "bg-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="p-6">
          <p className="text-[11px] uppercase tracking-widest text-primary/70 mb-2">
            {product.type}
          </p>
          <h3 className="text-xl font-serif font-bold text-foreground mb-4">
            {product.title}
          </h3>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-2xl font-bold text-gradient-gold">
              Rs. {parseFloat(product.price).toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                Rs. {parseFloat(product.comparePrice).toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6 bg-secondary/50 rounded-lg p-3">
            <Truck className="h-4 w-4 text-primary" />
            <span>Cash on Delivery Available Across Pakistan</span>
          </div>

          <a
            href={`https://wa.me/923453282241?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-gradient-gold text-accent-foreground py-3.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            <MessageCircle className="h-5 w-5" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
