import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Heart, Home } from "lucide-react";
import BookingDialog from "@/components/BookingDialog";
import room4 from "@/assets/room4.jpg";
import room5 from "@/assets/room5.jpg";
import room6 from "@/assets/room6.jpg";
import room7 from "@/assets/room7.jpg";
import room8 from "@/assets/room8.jpg";
import room1 from "@/assets/room1.jpg";

const hotels = [
  { name: "Emerald Valley Lodge", stars: 4, visitors: 7612, image: room4 },
  { name: "Pearl Valley Lodge", stars: 5, visitors: 7612, image: room5 },
  { name: "Ruby Valley Lodge", stars: 5, visitors: 7612, image: room6 },
  { name: "Diamond Valley Lodge", stars: 5, visitors: 7612, image: room7 },
  { name: "Gold Valley Lodge", stars: 5, visitors: 7612, image: room8 },
  { name: "Silver Valley Lodge", stars: 5, visitors: 7612, image: room1 },
];

const Hotels = () => {
  const navigate = useNavigate();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState("");

  const handleBook = (name: string) => {
    setSelectedHotel(name);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-purple-gradient py-12 px-8 lg:px-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/")} className="hover:scale-110 transition-transform">
            <Home className="w-8 h-8 text-foreground" />
          </button>
          <h2 className="font-heading italic text-gold text-3xl lg:text-4xl font-bold">
            Explore Our Best List<br />5-Stars Hotel!
          </h2>
        </div>
        <button
          onClick={() => navigate("/testimonials")}
          className="px-8 py-3 border-2 border-gold text-gold font-body font-bold text-sm tracking-wider rounded-full
                     hover:bg-gold hover:text-background transition-all duration-300"
        >
          VIEW TESTIMONIALS
        </button>
      </div>

      {/* Hotels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {hotels.map((hotel) => (
          <div key={hotel.name} className="animate-fade-in">
            <div className="rounded-2xl overflow-hidden">
              <img src={hotel.image} alt={hotel.name} className="w-full h-[220px] object-cover" loading="lazy" width={800} height={600} />
            </div>
            <h3 className="font-heading text-gold text-lg font-bold mt-3">{hotel.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex gap-0.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-gold font-body text-sm">({hotel.visitors} Visitors)</span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button
                onClick={() => handleBook(hotel.name)}
                className="px-6 py-2 bg-gold text-background font-body font-bold text-sm tracking-wider rounded-full
                           hover:bg-gold-dark hover:scale-105 transition-all duration-300"
              >
                BOOK NOW
              </button>
              <button className="text-gold hover:text-gold-dark hover:scale-110 transition-all duration-300">
                <Heart className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BookingDialog open={bookingOpen} onOpenChange={setBookingOpen} hotelName={selectedHotel} />
    </div>
  );
};

export default Hotels;
