import React from 'react';
import './herosection.css';
import { Link } from 'react-router-dom';
function HeroSection() {
  const backgroundImageStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/images/img2.jpg)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  return (
    <div className='hero-container' style={backgroundImageStyle}>
      <h1>Develop New Skills without Limits</h1>
      <p>With the world's best teaching site.</p>
      <div className='hero-btns'>
        <Link
          className='btns'
          buttonStyle='btn--outline'
          buttonSize='btn--large'
        >
          GET STARTED
        </Link>
      </div>
    </div>
  );
}

export default HeroSection;