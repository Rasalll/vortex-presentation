import React, { useState, useEffect, useCallback } from 'react';
import initialSlides from '../slides.json';

export default function PresentationViewer() {
  const [slides, setSlides] = useState(initialSlides || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Probe runtime images if slides array is empty
  useEffect(() => {
    if (slides.length === 0) {
      const discovered = [];
      let index = 1;
      
      const checkImage = (i) => {
        const img = new Image();
        img.src = `/photos/Ordered images/${i}.png`;
        img.onload = () => {
          discovered.push(`/photos/Ordered images/${i}.png`);
          checkImage(i + 1);
        };
        img.onerror = () => {
          if (discovered.length > 0) {
            setSlides(discovered);
          }
        };
      };

      checkImage(1);
    }
  }, [slides.length]);

  const triggerSlideChange = useCallback((newIndex) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 150);
  }, [isTransitioning]);

  const handleNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      triggerSlideChange(currentIndex + 1);
    }
  }, [currentIndex, slides.length, triggerSlideChange]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      triggerSlideChange(currentIndex - 1);
    }
  }, [currentIndex, triggerSlideChange]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Click left half of viewport for Prev, right half for Next
  const handleViewportClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX > rect.width / 2) {
      handleNext();
    } else {
      handlePrev();
    }
  };

  if (!slides || slides.length === 0) {
    return (
      <div className="error-container">
        <p>No presentation images found.</p>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className="presentation-container">
      {/* Top Header / Logo */}
      <header className="header">
        <img
          src="/photos/compony-logo.png"
          alt="Company Logo"
          className="company-logo"
        />
      </header>

      {/* Main Slide Viewport with Normal Fade In */}
      <main className="slide-viewport" onClick={handleViewportClick}>
        <img
          key={currentSlide}
          src={currentSlide}
          alt={`Slide ${currentIndex + 1}`}
          className={`slide-image ${isTransitioning ? 'loading' : 'loaded'}`}
        />
      </main>

      {/* Footer / Dynamic Slide Counter */}
      <footer className="footer">
        <div className="slide-counter">
          {currentIndex + 1} / {slides.length}
        </div>
      </footer>
    </div>
  );
}
