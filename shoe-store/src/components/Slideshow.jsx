import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const slideImages = [
  '/assets/slide1.jpg',
  '/assets/slide2.jpg',
  '/assets/slide3.jpg',
];

const Slideshow = () => (
  <div className="rounded overflow-hidden shadow">
    <Slide duration={3000} transitionDuration={500} infinite indicators arrows>
      {slideImages.map((url, index) => (
        <div key={index} className="each-slide">
          <div
            style={{
              backgroundImage: `url(${url})`,
              height: '200px',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '8px',
            }}
          />
        </div>
      ))}
    </Slide>
  </div>
);

export default Slideshow;