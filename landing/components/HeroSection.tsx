import React from 'react'
import Header from './HeroComp/Header';
import Main from './HeroComp/Main';
import HeroImage from './HeroComp/HeroImage';

const HeroSection = () => {
  return (
    <div>
        <Header />
        <Main />
        <HeroImage/>
    </div>
  )
}

export default HeroSection;