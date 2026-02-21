import { useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import type { CarouselImgItem } from '../../types/carousel';
import styles from './index.module.css';

interface CarouselProps {
  items: CarouselImgItem[];
}

function Carousel({ items }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);

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
        <div className={styles.viewport}>
          <div ref={trackRef} className={styles.track}>
            {items.map((item) => (
              <div key={item.src} className={styles.item}>
                <img
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
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
