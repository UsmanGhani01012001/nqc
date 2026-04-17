import { Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-card border-t border-gold">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="font-serif text-xl font-bold text-gradient-gold mb-3">
              Style International
            </h3>
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4">
              Deal Town
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your one-stop shop for premium lifestyle products at unbeatable prices. Cash on Delivery available.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+923453282241" className="hover:text-primary transition-colors">+92 345 3282241</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <a href="tel:+923343959465" className="hover:text-primary transition-colors">+92 334 3959465</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href="mailto:nayyarahmed1954@gmail.com" className="hover:text-primary transition-colors">nayyarahmed1954@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Plot no.30-C Street A, Saba Commercial, Phase V Ext, DHA Karachi</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-3">
              <a
                href="https://facebook.com/styleinternational"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/styleinternational"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gold text-muted-foreground hover:text-primary hover:border-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gold mt-10 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Style International — Deal Town. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
