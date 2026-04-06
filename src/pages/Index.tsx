import { useNavigate } from "react-router-dom";
import { MapPin, User, CalendarDays } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import hotelLogo from "@/assets/hotel-logo.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col">
        <img
          src={heroBg}
          alt="Luxury hotel room"
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-dark-overlay" />

        {/* Navbar */}
        <nav className="relative z-10 flex items-center justify-between px-8 py-6">
          <div className="flex items-center gap-3">
            <img src={hotelLogo} alt="Grand Hotel Logo" className="w-24 h-24 object-contain" width={512} height={512} />
            <span className="text-gold font-heading text-sm tracking-wider hidden sm:block">GRAND HOTEL</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-5 py-2 border border-gold text-gold font-body text-sm font-semibold tracking-wider rounded-full
                         hover:bg-gold hover:text-background transition-all duration-300"
            >
              HOME
            </button>
            <button
              onClick={() => navigate("/hotels")}
              className="px-5 py-2 border border-gold text-gold font-body text-sm font-semibold tracking-wider rounded-full
                         hover:bg-gold hover:text-background transition-all duration-300"
            >
              SEARCH
            </button>
            <button
              onClick={() => navigate("/testimonials")}
              className="px-5 py-2 border border-gold text-gold font-body text-sm font-semibold tracking-wider rounded-full
                         hover:bg-gold hover:text-background transition-all duration-300"
            >
              BLOG
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-5 py-2 bg-gold text-background font-body text-sm font-semibold rounded-md
                               hover:bg-gold-dark transition-all duration-300">
              Sign in
            </button>
            <button className="px-5 py-2 border border-foreground text-foreground font-body text-sm font-semibold rounded-md
                               hover:bg-foreground hover:text-background transition-all duration-300">
              Register
            </button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center px-8 lg:px-16">
          <div className="flex flex-col lg:flex-row justify-between w-full items-center">
            <div className="max-w-xl">
              <h1 className="font-heading italic text-gold text-4xl lg:text-6xl font-bold leading-tight mb-8">
                Stay Quietly, With<br />No Worries
              </h1>
              <div className="flex items-end gap-6">
                <p className="text-gold font-heading font-bold text-2xl lg:text-3xl uppercase leading-tight">
                  Click to see our most<br />premium rooms
                </p>
                <button
                  onClick={() => navigate("/premium-rooms")}
                  className="px-8 py-3 bg-gold text-background font-body font-bold text-sm tracking-wider rounded-full
                             hover:bg-gold-dark hover:scale-105 transition-all duration-300 whitespace-nowrap"
                >
                  CLICK HERE
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-10 lg:mt-0 space-y-8 text-right">
              {[
                { num: "12k+", label: "Satisfied Visitors" },
                { num: "4.5k+", label: "Amazing TourGuide" },
                { num: "2k+", label: "Special Travel Trip" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-gold font-heading italic text-4xl lg:text-5xl font-bold">{stat.num}</p>
                  <p className="text-gold font-body text-sm tracking-wider">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative z-10 mx-8 lg:mx-16 mb-10">
          <div className="bg-muted/80 backdrop-blur-sm border border-gold rounded-2xl p-6 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-foreground" />
                <span className="text-foreground font-body text-sm font-semibold">Location</span>
              </div>
              <input
                type="text"
                placeholder="Type Location"
                className="w-full px-4 py-2.5 rounded-lg bg-foreground text-background font-body text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-foreground" />
                <span className="text-foreground font-body text-sm font-semibold">Person</span>
              </div>
              <select className="w-full px-4 py-2.5 rounded-lg bg-foreground text-background font-body text-sm">
                <option>Person</option>
                <option>1</option>
                <option>2</option>
                <option>3+</option>
              </select>
            </div>
            <div className="flex-1 min-w-[150px]">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4 text-foreground" />
                <span className="text-foreground font-body text-sm font-semibold">Check-in</span>
              </div>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg bg-foreground text-background font-body text-sm"
              />
            </div>
            <div className="flex-1 min-w-[150px]">
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays className="w-4 h-4 text-foreground" />
                <span className="text-foreground font-body text-sm font-semibold">Check-out</span>
              </div>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-lg bg-foreground text-background font-body text-sm"
              />
            </div>
            <button
              className="px-10 py-2.5 bg-muted text-foreground font-body font-bold text-sm tracking-wider rounded-lg
                         hover:bg-gold hover:text-background transition-all duration-300"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
