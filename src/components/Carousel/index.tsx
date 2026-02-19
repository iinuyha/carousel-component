import type { CarouselImgItem } from '../../types/carousel';
import styles from './index.module.css';

interface CarouselProps {
  items: CarouselImgItem[];
}

function Carousel({ items }: CarouselProps) {
  return (
    <div className={styles.carousel}>
      <div className={styles.track}>
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
  );
}

export default Carousel;
