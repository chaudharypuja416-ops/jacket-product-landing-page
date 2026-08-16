export const product = {
  brandName: "Leather Jacket",
  name: "Premium Leather Jacket",
  headline: "Premium leather jacket for everyday confidence.",
  subheadline:
    "A sharp, durable outer layer for casual outings, parties, travel, and daily wear.",
  description:
    "Upgrade your style with a polished leather jacket that pairs cleanly with jeans, shirts, or T-shirts. Select your size and color, place a Cash on Delivery order, and our team will call to confirm before dispatch.",
  price: 4499,
  offerPrice: 3499,
  currency: "NPR",
  deliveryNote:
    "Free delivery inside Kathmandu Valley. NPR 100 delivery charge outside the valley. Delivery within 24 hours.",
  supportPhone: "9811627586",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: [
    { name: "Brown", image: "/products/jacket-brown-front.png" },
    { name: "Tan", image: "/products/jacket-tan-front.png" },
    { name: "Black", image: "/products/jacket-black-front.png" },
    { name: "Dark Brown", image: "/products/jacket-dark-brown.png" },
  ],
  heroImage: "/products/jacket-hero.png",
  images: [
    "/products/jacket-hero.png",
    "/products/jacket-brown-front.png",
    "/products/jacket-tan-front.png",
    "/products/jacket-black-front.png",
    "/products/jacket-dark-brown.png",
  ],
  features: [
    "Premium leather material",
    "Comfortable and stylish fit",
    "Durable zipper closure",
    "Multiple pockets",
    "Suitable for all seasons",
    "Easy to pair with jeans, shirts, or T-shirts",
  ],
  orderSteps: [
    "Choose size, color, and quantity",
    "Submit your delivery details",
    "Receive a confirmation call",
    "Pay cash after delivery",
  ],
  sizeGuide: [
    { size: "S", chest: "36-38 in", fit: "Slim" },
    { size: "M", chest: "38-40 in", fit: "Regular" },
    { size: "L", chest: "40-42 in", fit: "Regular" },
    { size: "XL", chest: "42-44 in", fit: "Relaxed" },
    { size: "XXL", chest: "44-46 in", fit: "Relaxed" },
  ],
  benefits: [
    {
      title: "Stylish Look",
      text: "Gives you a modern, fashionable appearance for everyday plans and special outings.",
    },
    {
      title: "Durable Build",
      text: "High-quality leather is made to last for a long time with proper care.",
    },
    {
      title: "Comfortable Fit",
      text: "Designed for comfortable everyday wear without sacrificing structure.",
    },
    {
      title: "Warm Protection",
      text: "Helps protect you from cool, windy weather and minor abrasions.",
    },
    {
      title: "Versatile Styling",
      text: "Easy to wear with jeans, trousers, shirts, or T-shirts.",
    },
    {
      title: "Timeless Design",
      text: "A leather jacket stays relevant season after season.",
    },
  ],
  testimonials: [
    {
      name: "Suman",
      location: "Kathmandu",
      quote:
        "Really happy with the jacket! The leather feels good, the fitting is comfortable, and it looks even better when I wear it. Great value for the price.",
    },
    {
      name: "Anisha",
      location: "Pokhara",
      quote:
        "I love the design and quality of this jacket. It is stylish, comfortable, and keeps me warm during cool weather. Definitely worth buying!",
    },
    {
      name: "Bikash",
      location: "Lalitpur",
      quote:
        "Very nice jacket for the price. The finishing is good and the jacket looks premium. I have already recommended it to my friends.",
    },
  ],
  faqs: [
    {
      question: "What material is the jacket made of?",
      answer:
        "The jacket is made from high-quality leather designed for comfort, durability, and a stylish appearance.",
    },
    {
      question: "What sizes are available?",
      answer:
        "The jacket is available in multiple sizes. Please check the size chart or confirm your size when our sales representative calls.",
    },
    {
      question: "Is the jacket suitable for winter?",
      answer:
        "Yes. The jacket provides good protection from cool and windy weather and is suitable for everyday use during colder seasons.",
    },
    {
      question: "How should I clean the jacket?",
      answer:
        "Wipe it gently with a soft, slightly damp cloth and avoid harsh detergents. For deep cleaning, professional leather cleaning is recommended.",
    },
    {
      question: "Can I return or exchange the jacket if the size does not fit?",
      answer:
        "Yes, size exchanges can be offered according to the store return and exchange policy. Please contact customer support for assistance.",
    },
  ],
};

export function formatMoney(amount: number) {
  return `${product.currency} ${new Intl.NumberFormat("en-NP").format(amount)}`;
}
