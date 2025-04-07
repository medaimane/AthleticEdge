import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { OrderDetails, PaymentInfo } from '@/lib/types';
import { Lock, CreditCard, Truck, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiRequest } from '@/lib/queryClient';

// Form validation schema for customer details
const customerDetailsSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  address: z.string().min(5, { message: "Address must be at least 5 characters" }),
  city: z.string().min(2, { message: "City must be at least 2 characters" }),
  state: z.string().min(2, { message: "State must be at least 2 characters" }),
  postalCode: z.string().min(5, { message: "Postal code must be at least 5 characters" }),
  country: z.string().min(2, { message: "Country must be at least 2 characters" }),
});

// Form validation schema for payment information
const paymentInfoSchema = z.object({
  cardNumber: z.string().regex(/^\d{16}$/, { message: "Card number must be 16 digits" }),
  nameOnCard: z.string().min(2, { message: "Name on card is required" }),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, { message: "Expiry date must be in format MM/YY" }),
  cvv: z.string().regex(/^\d{3,4}$/, { message: "CVV must be 3 or 4 digits" }),
});

type CustomerDetailsFormData = z.infer<typeof customerDetailsSchema>;
type PaymentInfoFormData = z.infer<typeof paymentInfoSchema>;

const steps = ["Customer Information", "Shipping Method", "Payment", "Review Order"];

export default function Checkout() {
  const [_, navigate] = useLocation();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentInfo | null>(null);
  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Initialize customer details form
  const customerForm = useForm<CustomerDetailsFormData>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
  });

  // Initialize payment form
  const paymentForm = useForm<PaymentInfoFormData>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: {
      cardNumber: "",
      nameOnCard: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const subtotal = totalPrice();
  const shippingCost = shippingMethod === "standard" ? 15 : 30;
  const tax = subtotal * 0.1;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    document.title = "Checkout | ATHLETIX";
    
    // Redirect to cart if no items
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems, navigate]);

  const handleNext = () => {
    if (activeStep === 0) {
      customerForm.handleSubmit((data) => {
        setOrderDetails(data);
        setActiveStep(1);
      })();
    } else if (activeStep === 1) {
      setActiveStep(2);
    } else if (activeStep === 2) {
      paymentForm.handleSubmit((data) => {
        setPaymentDetails(data);
        setActiveStep(3);
      })();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    if (!orderDetails || !paymentDetails) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success message
      toast({
        title: "Order Placed Successfully!",
        description: "Your order has been placed and will be processed shortly.",
      });
      
      // Clear the cart
      clearCart();
      
      // Redirect to a success page
      navigate("/checkout/success");
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 16) {
      paymentForm.setValue('cardNumber', value);
    }
  };
  
  const formatExpiryDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove any non-digit characters
    const value = e.target.value.replace(/\D/g, '');
    
    // Format as MM/YY
    if (value.length <= 4) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = value.slice(0, 2) + '/' + value.slice(2);
      }
      paymentForm.setValue('expiryDate', formattedValue);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-8 py-32">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold mb-8"
      >
        Checkout
      </motion.h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex-1"
        >
          <div className="glassmorphism rounded-xl p-6 mb-6">
            {/* Checkout Steps */}
            <div className="mb-8">
              <div className="flex justify-between items-center">
                {steps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex flex-col items-center relative ${
                      index === steps.length - 1 ? 'flex-1' : 'flex-1 after:content-[""] after:absolute after:top-5 after:w-full after:h-0.5 after:bg-muted after:right-0 after:z-0'
                    }`}
                  >
                    <div
                      className={`rounded-full h-10 w-10 flex items-center justify-center z-10 relative 
                      ${
                        index < activeStep
                          ? 'bg-primary text-primary-foreground'
                          : index === activeStep
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {index < activeStep ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 ${
                        index <= activeStep ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Customer Information */}
            {activeStep === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4">Customer Information</h2>
                <Form {...customerForm}>
                  <form ref={formRef} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={customerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={customerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customerForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="+1 (555) 123-4567" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={customerForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={customerForm.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="New York" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customerForm.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl>
                              <Input placeholder="NY" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={customerForm.control}
                        name="postalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postal Code</FormLabel>
                            <FormControl>
                              <Input placeholder="10001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={customerForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </motion.div>
            )}

            {/* Step 2: Shipping Method */}
            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4">Shipping Method</h2>
                <RadioGroup 
                  value={shippingMethod} 
                  onValueChange={setShippingMethod}
                  className="space-y-4"
                >
                  <div className={`flex items-start p-4 rounded-lg border ${shippingMethod === 'standard' ? 'border-primary' : 'border-border'}`}>
                    <RadioGroupItem value="standard" id="standard" className="mt-1" />
                    <div className="ml-3">
                      <label htmlFor="standard" className="font-medium">Standard Shipping</label>
                      <p className="text-muted-foreground text-sm">Delivery in 3-5 business days</p>
                      <p className="text-primary font-medium mt-1">$15.00</p>
                    </div>
                  </div>
                  
                  <div className={`flex items-start p-4 rounded-lg border ${shippingMethod === 'express' ? 'border-primary' : 'border-border'}`}>
                    <RadioGroupItem value="express" id="express" className="mt-1" />
                    <div className="ml-3">
                      <label htmlFor="express" className="font-medium">Express Shipping</label>
                      <p className="text-muted-foreground text-sm">Delivery in 1-2 business days</p>
                      <p className="text-primary font-medium mt-1">$30.00</p>
                    </div>
                  </div>
                </RadioGroup>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4">Payment Information</h2>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm flex items-center">
                    <Lock className="h-4 w-4 mr-1" />
                    Secure Payment
                  </p>
                  <div className="flex space-x-2">
                    <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">Visa</span>
                    <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">Mastercard</span>
                    <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">PayPal</span>
                    <span className="text-muted-foreground text-xs bg-muted px-2 py-1 rounded">Apple Pay</span>
                  </div>
                </div>
                
                <Form {...paymentForm}>
                  <form className="space-y-4">
                    <FormField
                      control={paymentForm.control}
                      name="cardNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                placeholder="1234 5678 9012 3456" 
                                value={field.value}
                                onChange={(e) => formatCardNumber(e)}
                                maxLength={16}
                              />
                              <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={paymentForm.control}
                      name="nameOnCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name on Card</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={paymentForm.control}
                        name="expiryDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expiry Date</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="MM/YY" 
                                value={field.value}
                                onChange={(e) => formatExpiryDate(e)}
                                maxLength={5}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={paymentForm.control}
                        name="cvv"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CVV</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="123" 
                                type="password" 
                                maxLength={4}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </form>
                </Form>
              </motion.div>
            )}

            {/* Step 4: Review Order */}
            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold mb-4">Review Order</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Shipping Information</h3>
                    <Card>
                      <CardContent className="p-4">
                        <p>{orderDetails?.firstName} {orderDetails?.lastName}</p>
                        <p>{orderDetails?.address}</p>
                        <p>{orderDetails?.city}, {orderDetails?.state} {orderDetails?.postalCode}</p>
                        <p>{orderDetails?.country}</p>
                        <p>{orderDetails?.email}</p>
                        <p>{orderDetails?.phone}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Shipping Method</h3>
                    <Card>
                      <CardContent className="p-4">
                        <p className="flex justify-between">
                          <span>
                            {shippingMethod === 'standard' ? 'Standard Shipping (3-5 business days)' : 'Express Shipping (1-2 business days)'}
                          </span>
                          <span className="font-medium">${shippingCost.toFixed(2)}</span>
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Payment Method</h3>
                    <Card>
                      <CardContent className="p-4">
                        <p>Credit Card ending in {paymentDetails?.cardNumber.slice(-4)}</p>
                        <p>{paymentDetails?.nameOnCard}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Order Items</h3>
                    <Card>
                      <CardContent className="divide-y divide-border">
                        {cartItems.map((item) => (
                          <div key={item.product.id} className="py-3 flex justify-between">
                            <div className="flex items-center">
                              <div className="h-12 w-12 rounded-md overflow-hidden mr-3">
                                <img
                                  src={item.product.imageUrl}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qty: {item.quantity} {item.size && `/ Size: ${item.size}`} {item.color && `/ Color: ${item.color}`}
                                </p>
                              </div>
                            </div>
                            <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={activeStep === 0 || isSubmitting}
              >
                Back
              </Button>
              
              {activeStep < 3 ? (
                <Button onClick={handleNext}>Continue</Button>
              ) : (
                <Button 
                  onClick={handlePlaceOrder} 
                  className="bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Place Order"}
                </Button>
              )}
            </div>
          </div>
        </motion.div>

        <div className="w-full lg:w-96">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="glassmorphism rounded-xl p-6 sticky top-24"
          >
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal ({cartItems.length} items)</p>
                <p className="font-medium">${subtotal.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-muted-foreground">Shipping</p>
                <p className="font-medium">${shippingCost.toFixed(2)}</p>
              </div>
              
              <div className="flex justify-between">
                <p className="text-muted-foreground">Tax</p>
                <p className="font-medium">${tax.toFixed(2)}</p>
              </div>
              
              <Separator />
              
              <div className="flex justify-between pt-2">
                <p className="font-semibold">Total</p>
                <p className="font-bold text-primary">${total.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="bg-muted/30 rounded-lg p-3 text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-primary" />
                  <p className="font-medium">Shipping Information</p>
                </div>
                <p className="text-muted-foreground">
                  All orders are processed and shipped within 1-2 business days of receipt.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
