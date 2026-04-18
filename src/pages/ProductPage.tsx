import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Product = Tables<"products">;

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxPmk7dzfMCnA8Y9Xhl7_I1MUvYYff1i2FFkX97NBAhm1rNq_96i4mYmez4j25XE7UP/exec";

const cities = [
  "Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan",
  "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Abbottabad",
  "Bahawalpur", "Sargodha", "Sukkur", "Other",
];

const ProductPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [formData, setFormData] = useState({ fullName: "", phone: "", city: "", postal: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNo, setOrderNo] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("handle", handle || "")
        .maybeSingle();
      setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <h1 className="text-2xl font-serif text-foreground">Product Not Found</h1>
          <Link to="/" className="text-primary hover:underline">← Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const images = product.images && product.images.length > 0 ? product.images : [product.image_url];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const price = product.price.toLocaleString();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, phone, city, address } = formData;
    if (!fullName.trim()) { toast({ title: "Please enter your full name", variant: "destructive" }); return; }
    if (!phone.trim()) { toast({ title: "Please enter your phone number", variant: "destructive" }); return; }
    if (!city) { toast({ title: "Please select your city", variant: "destructive" }); return; }
    if (!address.trim()) { toast({ title: "Please enter your delivery address", variant: "destructive" }); return; }

    setSubmitting(true);
    try {
      await fetch(SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phone: phone.trim(),
          city,
          address: address.trim(),
          productName: product.title,
          price: product.price,
        }),
      });
      const id = "ORD-" + Date.now().toString().slice(-6);
      setOrderNo(id);
      setOrderPlaced(true);
    } catch {
      toast({ title: "Something went wrong. Please try again.", variant: "destructive" });
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {orderPlaced && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-gold rounded-2xl p-10 text-center max-w-md w-full">
            <div className="text-6xl mb-5">🎉</div>
            <h2 className="text-3xl font-serif text-gradient-gold mb-3">Order Placed!</h2>
            <div className="inline-block bg-primary/10 border border-gold text-primary text-xs tracking-widest px-4 py-2 mb-5">
              Order #{orderNo}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Thank you! Your order has been received.<br />
              Our team will call you within <span className="text-primary font-semibold">24 hours</span> to confirm delivery.<br /><br />
              <span className="text-primary">Cash on Delivery</span> — pay when it arrives.
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-gold text-accent-foreground py-3.5 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary text-xs tracking-widest uppercase mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
          <div className="md:sticky md:top-24">
            {images.length > 0 && (
              <div className="relative aspect-square bg-secondary rounded-xl overflow-hidden border border-gold">
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
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${i === imgIndex ? "bg-primary" : "bg-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground leading-tight mb-5">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-4xl font-serif font-bold text-gradient-gold">
                Rs. {price}
              </span>
              {hasDiscount && (
                <span className="text-base text-muted-foreground line-through">
                  Rs. {product.compare_at_price!.toLocaleString()}
                </span>
              )}
            </div>

            <div className="inline-flex items-center gap-2 bg-primary/10 border border-gold text-primary text-xs tracking-widest px-3 py-1.5 uppercase mb-6">
              <CheckCircle className="h-3.5 w-3.5" /> Cash on Delivery · Nationwide
            </div>

            <div className="flex flex-col gap-2.5 mb-6">
              {[
                "Authentic product, exactly as shown",
                "Delivered to your doorstep anywhere in Pakistan",
                "Pay cash when order arrives — zero risk",
                "Customer support via WhatsApp",
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="text-primary text-[10px]">✦</span> {f}
                </div>
              ))}
            </div>

            {product.description && (
              <div className="mb-6">
                <p className="text-sm text-muted-foreground whitespace-pre-line">{product.description}</p>
              </div>
            )}

            <div className="h-px bg-gold/20 mb-6" />

            <div className="bg-card border border-gold rounded-xl p-6">
              <h2 className="text-xl font-serif text-foreground mb-1">Place Your Order</h2>
              <p className="text-xs text-muted-foreground tracking-wide mb-5">
                Fill in your details and we will deliver to your door
              </p>

              <div className="bg-secondary border-l-[3px] border-primary p-3 mb-5 rounded-r-lg">
                <p className="text-sm text-foreground mb-1">{product.title}</p>
                <p className="text-lg font-serif font-semibold text-gradient-gold">
                  Rs. {price} — Cash on Delivery
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] tracking-widest uppercase text-primary font-semibold">Full Name *</Label>
                    <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. Ahmed Ali" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] tracking-widest uppercase text-primary font-semibold">Phone Number *</Label>
                    <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="03XX XXXXXXX" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] tracking-widest uppercase text-primary font-semibold">City *</Label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select your city</option>
                      {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] tracking-widest uppercase text-primary font-semibold">Postal / Area Code</Label>
                    <Input name="postal" value={formData.postal} onChange={handleChange} placeholder="Optional" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] tracking-widest uppercase text-primary font-semibold">Full Address *</Label>
                  <Input name="address" value={formData.address} onChange={handleChange} placeholder="House No., Street, Area, City" />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-gold text-accent-foreground py-4 rounded-lg font-bold text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Placing Order..." : "Confirm Order — Cash on Delivery"}
                </button>
                <p className="text-[11px] text-muted-foreground/50 text-center tracking-wide">
                  By placing order you agree to receive a delivery confirmation call
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductPage;
