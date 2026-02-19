import Carousel from './components/Carousel';

const items = Array.from({ length: 13 }, (_, i) => ({
  src: `/src/images/sample_images_${String(i).padStart(2, '0')}.png`,
  alt: `Image ${i + 1}`,
}));

function App() {
  return (
    <div style={{ width: '100%', height: '300px' }}>
      <Carousel items={items} />
    </div>
  );
}

export default App;
