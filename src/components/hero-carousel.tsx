import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type HeroSlide = {
  id: string;
  title: string;
  image_url: string;
};

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const count = slides.length;

  const show = useCallback((index: number) => {
    if (count === 0) return;
    setActive((index + count) % count);
  }, [count]);

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % count), 6000);
    return () => window.clearInterval(timer);
  }, [count]);

  useEffect(() => {
    if (active >= count) setActive(Math.max(0, count - 1));
  }, [active, count]);

  if (count === 0) return null;

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Présentation de l’AST">
      <div className="hero-slides">
        {slides.map((slide, index) => (
          <article className={index === active ? "hero-slide active" : "hero-slide"} key={slide.id} aria-hidden={index !== active}>
            <img src={slide.image_url} alt="Activités de l’Association pour la Solidarité au Travail" />
            <div className="hero-shade" />
          </article>
        ))}
      </div>
      <div className="hero-caption" aria-live="polite"><h1>{slides[active]?.title}</h1></div>

      {count > 1 && (
        <>
          <Button className="hero-arrow left" variant="ghost" size="icon" aria-label="Diapositive précédente" onClick={() => show(active - 1)}>
            <ChevronLeft aria-hidden="true" />
          </Button>
          <Button className="hero-arrow right" variant="ghost" size="icon" aria-label="Diapositive suivante" onClick={() => show(active + 1)}>
            <ChevronRight aria-hidden="true" />
          </Button>
          <div className="hero-dots" aria-label="Choisir une diapositive">
            {slides.map((slide, index) => (
              <button key={slide.id} type="button" className={index === active ? "active" : ""} aria-label={`Afficher la diapositive ${index + 1}`} aria-current={index === active ? "true" : undefined} onClick={() => show(index)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}