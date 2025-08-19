import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import heroImage from '../assets/hero.png';
import './Home.css'; 

function Home() {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const handleStartAssessment = () => {
    navigate('/login');
  };

  const handleViewProblems = () => {
    navigate('/problem/1');
  };

  // Parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top;
        
        const centerY = rect.height / 2;
        
        const moveY = (y - centerY) / centerY * 10;
        
        containerRef.current.style.setProperty('--mouse-y', `${moveY}px`);
        containerRef.current.classList.add('parallax');
      }
    };

    const handleMouseLeave = () => {
      if (containerRef.current) {
        containerRef.current.classList.remove('parallax');
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="home-page">
      <div 
        ref={containerRef}
        className="home-container"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
        >
        <div className="home-particles">
          <div className="home-particle"></div>
          <div className="home-particle"></div>
          <div className="home-particle"></div>
          <div className="home-particle"></div>
          <div className="home-particle"></div>
          <div className="home-particle"></div>
          <div className="home-particle"></div>
          <div className="home-particle"></div>
          <div className="home-particle"></div>
          <div className="home-particle"></div>
        </div>
        <header className='home-header z-foreground'>
          <p className='home-tagline'>BUILT FOR RECRUITERS AND CANDIDATES ALIKE</p>
          <h1>Bibliotheca <br /> Alexandrina <br /> Coding Assessment</h1>
        </header>
        <div className='home-assessment-card'>
          <p>A dedicated platform for evaluating IT candidates through real-time coding challenges.</p>
          <button onClick={handleStartAssessment}>Start Your Assessment</button>
          <p className='home-sample-link' onClick={handleViewProblems}>→ Preview a sample challenge</p>
        </div>
        <NavBar />
      </div>
    </div>
  );
}

export default Home;