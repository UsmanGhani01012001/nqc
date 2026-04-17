import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  LogOut, Plus, Trash2, Edit2, Package, FolderOpen, Save, X, Loader2,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Product = Tables<"products">;
type Category = Tables<"categories">;

const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tab, setTab] = useState<"products" | "categories">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Product form
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    title: "", description: "", price: "", compare_at_price: "",
    image_url: "", images: "", handle: "", category_id: "",
    in_stock: true, featured: false,
  });

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: "", slug: "", image_url: "", display_order: "0",
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin", { replace: true });
    }
  }, [authLoading, user, isAdmin, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchData();
    }
  }, [user, isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("display_order"),
    ]);
    setProducts(prods || []);
    setCategories(cats || []);
    setLoading(false);
  };

  // ---- Product CRUD ----
  const resetProductForm = () => {
    setProductForm({
      title: "", description: "", price: "", compare_at_price: "",
      image_url: "", images: "", handle: "", category_id: "",
      in_stock: true, featured: false,
    });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      title: p.title,
      description: p.description || "",
      price: String(p.price),
      compare_at_price: p.compare_at_price ? String(p.compare_at_price) : "",
      image_url: p.image_url,
      images: (p.images || []).join("\n"),
      handle: p.handle,
      category_id: p.category_id || "",
      in_stock: p.in_stock,
      featured: p.featured,
    });
    setShowProductForm(true);
  };

  const saveProduct = async () => {
    if (!productForm.title.trim() || !productForm.price || !productForm.image_url.trim() || !productForm.handle.trim()) {
      toast({ title: "Missing fields", description: "Title, price, image URL and handle are required", variant: "destructive" });
      return;
    }

    const payload = {
      title: productForm.title.trim(),
      description: productForm.description.trim() || null,
      price: parseFloat(productForm.price),
      compare_at_price: productForm.compare_at_price ? parseFloat(productForm.compare_at_price) : null,
      image_url: productForm.image_url.trim(),
      images: productForm.images.split("\n").map(s => s.trim()).filter(Boolean),
      handle: productForm.handle.trim(),
      category_id: productForm.category_id || null,
      in_stock: productForm.in_stock,
      featured: productForm.featured,
    };

    let error;
    if (editingProduct) {
      ({ error } = await supabase.from("products").update(payload).eq("id", editingProduct.id));
    } else {
      ({ error } = await supabase.from("products").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editingProduct ? "Product updated" : "Product added" });
    resetProductForm();
    fetchData();
  };

  const deleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Product deleted" });
    fetchData();
  };

  // ---- Category CRUD ----
  const resetCategoryForm = () => {
    setCategoryForm({ name: "", slug: "", image_url: "", display_order: "0" });
    setEditingCategory(null);
    setShowCategoryForm(false);
  };

  const openEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCategoryForm({
      name: c.name,
      slug: c.slug,
      image_url: c.image_url || "",
      display_order: String(c.display_order),
    });
    setShowCategoryForm(true);
  };

  const saveCategory = async () => {
    if (!categoryForm.name.trim() || !categoryForm.slug.trim()) {
      toast({ title: "Missing fields", description: "Name and slug are required", variant: "destructive" });
      return;
    }

    const payload = {
      name: categoryForm.name.trim(),
      slug: categoryForm.slug.trim(),
      image_url: categoryForm.image_url.trim() || null,
      display_order: parseInt(categoryForm.display_order) || 0,
    };

    let error;
    if (editingCategory) {
      ({ error } = await supabase.from("categories").update(payload).eq("id", editingCategory.id));
    } else {
      ({ error } = await supabase.from("categories").insert(payload));
    }

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: editingCategory ? "Category updated" : "Category added" });
    resetCategoryForm();
    fetchData();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Category deleted" });
    fetchData();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getCategoryName = (catId: string | null) => {
    if (!catId) return "Uncategorized";
    return categories.find(c => c.id === catId)?.name || "Unknown";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-gradient-gold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={() => { signOut(); navigate("/"); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-5xl">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={tab === "products" ? "default" : "secondary"}
            onClick={() => setTab("products")}
          >
            <Package className="h-4 w-4 mr-2" /> Products ({products.length})
          </Button>
          <Button
            variant={tab === "categories" ? "default" : "secondary"}
            onClick={() => setTab("categories")}
          >
            <FolderOpen className="h-4 w-4 mr-2" /> Categories ({categories.length})
          </Button>
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">Products</h2>
              <Button onClick={() => { resetProductForm(); setShowProductForm(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>

            {showProductForm && (
              <Card className="mb-6 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Title *</label>
                      <Input value={productForm.title} onChange={e => setProductForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Handle (URL slug) *</label>
                      <Input value={productForm.handle} onChange={e => setProductForm(f => ({ ...f, handle: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Price *</label>
                      <Input type="number" step="0.01" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Compare at Price</label>
                      <Input type="number" step="0.01" value={productForm.compare_at_price} onChange={e => setProductForm(f => ({ ...f, compare_at_price: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Main Image URL *</label>
                      <Input value={productForm.image_url} onChange={e => setProductForm(f => ({ ...f, image_url: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Category</label>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                        value={productForm.category_id}
                        onChange={e => setProductForm(f => ({ ...f, category_id: e.target.value }))}
                      >
                        <option value="">No category</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Description</label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                      value={productForm.description}
                      onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Additional Image URLs (one per line)</label>
                    <textarea
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[60px]"
                      value={productForm.images}
                      onChange={e => setProductForm(f => ({ ...f, images: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={productForm.in_stock} onChange={e => setProductForm(f => ({ ...f, in_stock: e.target.checked }))} />
                      In Stock
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm(f => ({ ...f, featured: e.target.checked }))} />
                      Featured
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveProduct}><Save className="h-4 w-4 mr-2" /> Save</Button>
                    <Button variant="ghost" onClick={resetProductForm}><X className="h-4 w-4 mr-2" /> Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Product list */}
            <div className="space-y-2">
              {products.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No products yet. Add your first product!</p>
              )}
              {products.map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
                  <img src={p.image_url} alt={p.title} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Rs {p.price} • {getCategoryName(p.category_id)}
                      {!p.in_stock && " • Out of stock"}
                    </p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditProduct(p)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteProduct(p.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {tab === "categories" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-foreground">Categories</h2>
              <Button onClick={() => { resetCategoryForm(); setShowCategoryForm(true); }}>
                <Plus className="h-4 w-4 mr-2" /> Add Category
              </Button>
            </div>

            {showCategoryForm && (
              <Card className="mb-6 border-primary/30">
                <CardHeader>
                  <CardTitle className="text-lg">
                    {editingCategory ? "Edit Category" : "Add New Category"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground">Name *</label>
                      <Input
                        value={categoryForm.name}
                        onChange={e => {
                          const name = e.target.value;
                          setCategoryForm(f => ({
                            ...f,
                            name,
                            slug: editingCategory ? f.slug : name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Slug *</label>
                      <Input value={categoryForm.slug} onChange={e => setCategoryForm(f => ({ ...f, slug: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Image URL</label>
                      <Input value={categoryForm.image_url} onChange={e => setCategoryForm(f => ({ ...f, image_url: e.target.value }))} />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground">Display Order</label>
                      <Input type="number" value={categoryForm.display_order} onChange={e => setCategoryForm(f => ({ ...f, display_order: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveCategory}><Save className="h-4 w-4 mr-2" /> Save</Button>
                    <Button variant="ghost" onClick={resetCategoryForm}><X className="h-4 w-4 mr-2" /> Cancel</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              {categories.length === 0 && (
                <p className="text-muted-foreground text-center py-8">No categories yet. Add your first category!</p>
              )}
              {categories.map(c => (
                <div key={c.id} className="flex items-center gap-3 bg-card border border-border rounded-lg p-3">
                  {c.image_url && <img src={c.image_url} alt={c.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">/{c.slug} • Order: {c.display_order}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => openEditCategory(c)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(c.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
