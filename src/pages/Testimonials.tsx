import { useNavigate } from "react-router-dom";
import { Home, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import avatar1 from "@/assets/avatar1.jpg";
import avatar2 from "@/assets/avatar2.jpg";
import avatar3 from "@/assets/avatar3.jpg";

const testimonials = [
  {
    name: "Robert Miller",
    role: "Business Traveler",
    quote: "The rooms were absolutely stunning with breathtaking views. The service was impeccable and the staff went above and beyond to make our stay memorable.",
    image: avatar1,
    rating: 5,
  },
  {
    name: "Mr. Shelby",
    role: "Family Vacation",
    quote: "Great hotel service! From the moment we checked in, everything was perfect. The concierge arranged amazing tours and the spa was world-class.",
    image: avatar2,
    rating: 5,
  },
  {
    name: "Daniel Park",
    role: "Honeymoon Trip",
    quote: "The food was extraordinary and the ambiance was romantic. Perfect for our honeymoon. We will definitely come back for our anniversary!",
    image: avatar3,
    rating: 4,
  },
  {
    name: "Sarah Johnson",
    role: "Solo Explorer",
    quote: "A truly luxurious experience. The rooftop pool and the private beach access made this the best solo trip I've ever taken. Highly recommend!",
    image: avatar1,
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Corporate Retreat",
    quote: "Perfect venue for our corporate retreat. The conference facilities were top-notch and the team-building activities were thoughtfully organized.",
    image: avatar2,
    rating: 4,
  },
];

const Testimonials = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 8000);
  };

  const prev = () => goTo((activeIndex - 1 + testimonials.length) % testimonials.length);
  const next = () => goTo((activeIndex + 1) % testimonials.length);

  return (
    <div className="min-h-screen bg-dark-gold-gradient flex flex-col items-center justify-center py-16 px-8 relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-gold/8 rounded-full blur-3xl" />

      <button onClick={() => navigate("/")} className="absolute top-8 left-8 hover:scale-110 transition-transform z-20">
        <Home className="w-8 h-8 text-foreground" />
      </button>

      <h2 className="relative z-10 font-heading italic text-gold text-3xl lg:text-4xl font-bold text-center mb-4 drop-shadow-lg">
        What Our Guests Say
      </h2>
      <p className="relative z-10 text-foreground font-body text-sm tracking-[0.3em] uppercase text-center mb-16">
        Real experiences from real travelers
      </p>

      {/* Slider */}
      <div className="relative z-10 w-full max-w-5xl">
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {testimonials.map((t, i) => (
              <div key={i} className="w-full flex-shrink-0 px-4">
                <div className="bg-card/50 backdrop-blur-sm border border-gold/20 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8 max-w-4xl mx-auto">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gold/40 shadow-lg shadow-gold/20">
                      <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" width={512} height={512} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="flex justify-center lg:justify-start gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star
                          key={j}
                          className={`w-5 h-5 ${j < t.rating ? "fill-gold text-gold" : "text-muted"}`}
                        />
                      ))}
                    </div>
                    <p className="font-heading italic text-foreground text-lg lg:text-xl leading-relaxed mb-6">
                      "{t.quote}"
                    </p>
                    <h3 className="font-heading text-gold text-xl font-bold">{t.name}</h3>
                    <p className="text-muted-foreground font-body text-sm mt-1">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 w-12 h-12 rounded-full bg-card/80 border border-gold/30
                     flex items-center justify-center text-gold hover:bg-gold hover:text-background transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={next}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-12 h-12 rounded-full bg-card/80 border border-gold/30
                     flex items-center justify-center text-gold hover:bg-gold hover:text-background transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Dots */}
      <div className="relative z-10 flex gap-3 mt-12">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-500 ${
              i === activeIndex ? "w-10 bg-gold" : "w-4 bg-muted hover:bg-gold/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
