import { ShoppingBag, Menu, X, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAdminBtn, setShowAdminBtn] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("adminVisited");
    if (visited === "true") {
      setShowAdminBtn(true);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-gold">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingBag className="h-7 w-7 text-primary" />
          <div>
            <h1 className="text-xl font-serif font-bold text-gradient-gold leading-tight">
              NQC
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Deal Town
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a href="#products" className="text-foreground/70 hover:text-primary transition-colors">Products</a>
          <a href="#categories" className="text-foreground/70 hover:text-primary transition-colors">Categories</a>
          <a href="#contact" className="text-foreground/70 hover:text-primary transition-colors">Contact</a>
          {showAdminBtn && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-primary hover:text-primary/80 transition-colors"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>

        <button className="md:hidden text-foreground" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-gold bg-background px-4 py-4 flex flex-col gap-4">
          <a href="#products" className="text-foreground/70 hover:text-primary" onClick={() => setMenuOpen(false)}>Products</a>
          <a href="#categories" className="text-foreground/70 hover:text-primary" onClick={() => setMenuOpen(false)}>Categories</a>
          <a href="#contact" className="text-foreground/70 hover:text-primary" onClick={() => setMenuOpen(false)}>Contact</a>
          {showAdminBtn && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 text-primary hover:text-primary/80"
              onClick={() => setMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
