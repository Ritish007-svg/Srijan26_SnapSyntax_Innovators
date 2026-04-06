import { useNavigate } from "react-router-dom";
import { Star, ArrowRight, Home } from "lucide-react";
import room1 from "@/assets/room1.jpg";
import room2 from "@/assets/room2.jpg";
import room3 from "@/assets/room3.jpg";

const rooms = [
  { name: "Oasis Sands Resort Homestay", location: "Plam Jumeirah, Dubai", stars: 4, visitors: 218, image: room1, large: true },
  { name: "Oasis Sands Resort Homestay", location: "Plam Jumeirah, Dubai", stars: 4, visitors: 218, image: room2 },
  { name: "Oasis Sands Resort Homestay", location: "Plam Jumeirah, Dubai", stars: 4, visitors: 218, image: room3 },
];

const PremiumRooms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-gold-gradient py-12 px-8 lg:px-16 relative overflow-hidden">
      {/* Decorative glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gold/8 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold/3 rounded-full blur-2xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-12">
        <button onClick={() => navigate("/")} className="hover:scale-110 transition-transform">
          <Home className="w-8 h-8 text-foreground" />
        </button>
        <h2 className="font-heading italic text-gold text-3xl lg:text-5xl font-bold text-center flex-1 drop-shadow-lg">
          Our Most Premium<br />Rooms in 2026!
        </h2>
        <div className="w-8" />
      </div>

      {/* Rooms Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large card */}
        <div className="lg:col-span-2 lg:row-span-2 relative rounded-2xl overflow-hidden group cursor-pointer
                        shadow-xl shadow-gold/10 hover:shadow-gold/20 transition-shadow duration-500">
          <img src={rooms[0].image} alt={rooms[0].name} className="w-full h-full object-cover min-h-[400px] group-hover:scale-105 transition-transform duration-700" loading="lazy" width={800} height={600} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="font-heading text-foreground text-2xl font-bold">{rooms[0].name}</h3>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-muted-foreground font-body text-sm">{rooms[0].location}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: rooms[0].stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <span className="text-muted-foreground font-body text-sm">({rooms[0].visitors} Visitors)</span>
            </div>
            <button
              onClick={() => navigate("/hotels")}
              className="mt-4 px-8 py-3 bg-gold text-background font-body font-bold text-sm tracking-wider rounded-full
                         hover:bg-gold-dark hover:scale-105 transition-all duration-300"
            >
              VIEW MORE ROOMS
            </button>
          </div>
        </div>

        {/* Small cards */}
        {rooms.slice(1).map((room, i) => (
          <div key={i} className="relative rounded-2xl overflow-hidden group cursor-pointer
                                  shadow-lg shadow-gold/10 hover:shadow-gold/20 transition-shadow duration-500">
            <img src={room.image} alt={room.name} className="w-full h-[250px] object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" width={800} height={600} />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="font-heading text-foreground text-lg font-bold">{room.name}</h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-muted-foreground font-body text-xs">{room.location}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: room.stars }).map((_, j) => (
                    <Star key={j} className="w-3 h-3 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-muted-foreground font-body text-xs">({room.visitors} Visitors)</span>
                <ArrowRight className="w-4 h-4 text-foreground ml-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumRooms;
