import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah J.",
    role: "Marathon Runner",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    text: "These running shoes have completely transformed my training. The comfort and support are unmatched, and I've seen improvement in my pace.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael T.",
    role: "Basketball Coach",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    text: "The quality of ATHLETIX sportswear is exceptional. Breathable, durable, and stylish. I've recommended it to my entire basketball team.",
    rating: 5
  },
  {
    id: 3,
    name: "Lisa M.",
    role: "Crossfit Athlete",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    text: "Fast shipping, great customer service, and the products are exactly as described. The performance wear has held up through countless training sessions.",
    rating: 4.5
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 container mx-auto px-4 md:px-8">
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold font-space mb-2 text-center"
      >
        WHAT ATHLETES SAY
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-muted-foreground text-center mb-12 max-w-xl mx-auto"
      >
        Real feedback from real athletes
      </motion.p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div 
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            className="glassmorphism p-6 rounded-xl"
          >
            <div className="flex text-secondary mb-4">
              {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                <Star key={i} className="fill-secondary text-secondary h-4 w-4" />
              ))}
              {testimonial.rating % 1 > 0 && (
                <div className="relative">
                  <Star className="text-muted-foreground h-4 w-4" />
                  <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                    <Star className="fill-secondary text-secondary h-4 w-4" />
                  </div>
                </div>
              )}
            </div>
            
            <p className="mb-6 text-muted-foreground">
              "{testimonial.text}"
            </p>
            
            <div className="flex items-center">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h4 className="font-bold">{testimonial.name}</h4>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
