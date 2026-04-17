import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type Category = Tables<"categories">;

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("display_order", { ascending: true }),
      ]);
      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === "All") return products;
    const cat = categories.find((c) => c.name === activeCategory);
    if (!cat) return products;
    return products.filter((p) => p.category_id === cat.id);
  }, [activeCategory, products, categories]);

  const categoryNames = categories.map((c) => c.name);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Category Filter */}
      <section id="categories" className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {["All", ...categoryNames].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-all ${
                activeCategory === cat
                  ? "bg-gradient-gold text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground border border-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="container mx-auto px-4 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gradient-gold mb-2">
            Our Collection
          </h2>
          <p className="text-muted-foreground text-sm">
            {filtered.length} products — Cash on Delivery available
          </p>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <a key={product.id} href={`/product/${product.handle}`}>
                <ProductCard product={product} onClick={() => {}} />
              </a>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Index;
