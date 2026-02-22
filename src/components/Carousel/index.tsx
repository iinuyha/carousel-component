import { useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import type { CarouselImgItem } from '../../types/carousel';
import styles from './index.module.css';

const SWIPE_THRESHOLD = 0.15;

interface CarouselProps {
  items: CarouselImgItem[];
}

function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= items.length || index === currentIndex) return;

      setCurrentIndex(index);
      gsap.to(trackRef.current, {
        xPercent: -index * 100,
        duration: 0.4,
        ease: 'power2.out',
      });
    },
    [currentIndex, items.length]
  );

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    gsap.killTweensOf(trackRef.current);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!trackRef.current || !viewportRef.current) return;
      const deltaX = e.changedTouches[0].clientX - touchStartX.current;
      const viewportWidth = viewportRef.current.clientWidth;
      const threshold = viewportWidth * SWIPE_THRESHOLD;

      if (deltaX < -threshold) {
        goTo(currentIndex + 1);
      } else if (deltaX > threshold) {
        goTo(currentIndex - 1);
      } else {
        gsap.to(trackRef.current, {
          xPercent: -currentIndex * 100,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    },
    [currentIndex, goTo]
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!trackRef.current || !viewportRef.current) return;
      const deltaX = e.touches[0].clientX - touchStartX.current;
      const deltaY = e.touches[0].clientY - touchStartY.current;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.preventDefault();
        const viewportWidth = viewportRef.current.clientWidth;
        const deltaPercent = (deltaX / viewportWidth) * 100;
        const minX = -(items.length - 1) * 100;
        const maxX = 0;
        const targetX = Math.max(
          minX,
          Math.min(maxX, -currentIndexRef.current * 100 + deltaPercent)
        );
        gsap.set(trackRef.current, { xPercent: targetX });
      }
    };

    // NOTE: onTouchMove는 {passive: false}로 등록해야 preventDefault() 호출 가능
    viewport.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => viewport.removeEventListener('touchmove', handleTouchMove);
  }, [items.length]);

  return (
    <div className={styles.carousel}>
      <div className={styles.slider}>
        <button
          className={styles.arrow}
          onClick={goPrev}
          disabled={currentIndex === 0}
          aria-label="이전"
        >
          &#8249;
        </button>
        <div
          ref={viewportRef}
          className={styles.viewport}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div ref={trackRef} className={styles.track}>
            {items.map((item) => (
              <div key={item.src} className={styles.item}>
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  style={
                    item.width && item.height
                      ? {
                          aspectRatio: `${item.width} / ${item.height}`,
                          objectFit: 'cover',
                        }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>
        </div>
        <button
          className={styles.arrow}
          onClick={goNext}
          disabled={currentIndex === items.length - 1}
          aria-label="다음"
        >
          &#8250;
        </button>
      </div>
      <div className={styles.dots}>
        {items.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
            onClick={() => goTo(index)}
            aria-label={`슬라이드 ${index + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
