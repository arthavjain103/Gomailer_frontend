import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import PipelineCarousel from "./components/PipelineCarousel.jsx";
import LiveDemo from "./components/LiveDemo.jsx";
import Benefits from "./components/Benefits.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PipelineCarousel />
        <LiveDemo />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
}
