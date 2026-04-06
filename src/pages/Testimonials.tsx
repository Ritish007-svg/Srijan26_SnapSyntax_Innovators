import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import avatar1 from "@/assets/avatar1.jpg";
import avatar2 from "@/assets/avatar2.jpg";
import avatar3 from "@/assets/avatar3.jpg";

const testimonials = [
  { name: "Robert Miller", quote: "Very nice Rooms", image: avatar1 },
  { name: "Mr. Shelby", quote: "Great hotel service", image: avatar2 },
  { name: "Daniel Park", quote: "Good food", image: avatar3 },
];

const Testimonials = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-card flex flex-col items-center justify-center py-16 px-8">
      <button onClick={() => navigate("/")} className="absolute top-8 left-8 hover:scale-110 transition-transform">
        <Home className="w-8 h-8 text-foreground" />
      </button>

      <h2 className="font-heading italic text-gold text-3xl lg:text-4xl font-bold text-center mb-4">
        Let's Hear How Their<br />Experiences Use Our Platform
      </h2>
      <p className="text-foreground font-body text-sm tracking-[0.3em] uppercase text-center mb-16">
        Read what others have to say
      </p>

      <div className="flex flex-wrap justify-center gap-16">
        {testimonials.map((t) => (
          <div key={t.name} className="flex flex-col items-center animate-fade-in">
            <div className="w-40 h-40 lg:w-52 lg:h-52 rounded-full overflow-hidden border-2 border-gold/30 mb-6">
              <img src={t.image} alt={t.name} className="w-full h-full object-cover" loading="lazy" width={512} height={512} />
            </div>
            <h3 className="font-heading text-foreground text-xl font-bold">{t.name}</h3>
            <p className="font-heading italic text-muted-foreground text-lg mt-2">"{t.quote}"</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-16">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`h-1 rounded-full ${i === 0 ? "w-10 bg-secondary" : "w-6 bg-muted"}`} />
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
