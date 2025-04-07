import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) return;
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscribed!",
        description: "You've been added to our newsletter",
        variant: "default",
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold font-space mb-4 text-primary-foreground">JOIN THE TEAM</h2>
          <p className="text-primary-foreground/90 mb-8 md:mb-10">
            Subscribe to get exclusive deals, early access to new products, and training tips from pro athletes.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow bg-white rounded-full py-6 px-6 text-primary-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary text-sm" 
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-background hover:bg-background/90 text-foreground font-bold py-3 px-8 rounded-full transition-colors"
            >
              {isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE"}
            </Button>
          </form>
          
          <p className="text-xs mt-4 text-primary-foreground/80">
            By subscribing you agree to our Privacy Policy and consent to receive updates from our company.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
