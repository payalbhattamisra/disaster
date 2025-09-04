import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const cardData = [
  {
    hue: 200,
    title: 'Volunteer Module',
    image: './images/volunter.avif',
    details: ['Join Relief Teams', 'Skill-based Opportunities', 'Nearby Locations', 'Emergency Contacts', 'Live Map Updates'],
    buttonText: 'Join Team', 
  },
  {
    hue: 150,
    title: 'Victim Support',
    image: './images/victim.avif',
    details: ['Request Help', 'Food & Shelter', 'Medical Support', 'Live SOS Alerts', 'Connect with NGOs'],
    buttonText: 'Request Help',
  },
  {
    hue: 250,
    title: 'NGO Dashboard',
    image: './images/ngo.avif',
    details: ['Verify Requests', 'Update Help Centers', 'Resource Management', 'Team Coordination', 'Volunteer Reports'],
    buttonText: 'Manage Requests',
  },
  {
    hue: 30,
    title: 'News Feed',
    image: './images/news.avif',
    details: ['Live Updates', 'Government Alerts', 'Emergency Notices', 'Weather Warnings', 'Rescue Highlights'],
    buttonText: 'View Updates',
  },
 {
    hue: 120,
    title: 'Donation',
    image: './images/donation.jpg',
    details: ['Monetary Support', 'Food & Clothes Contribution', 'Medical Kits', 'Transport & Logistics Help', 'Transparent Usage Reports'],
    buttonText: 'Donate Now',
  },
  {
    hue: 280,
    title: 'Community Broadcasts',
    image: './images/guidance.webp',
    details: ['Short Guides & Videos', 'Water Purification Tips', 'First Aid Tutorials', 'Safety Awareness', 'Offline Access'],
    buttonText: 'Watch Guides',
  },
  {
    hue: 60,
    title: 'Government Schemes',
    image: './images/govt_schemes.jpg',
    details: ['Relief Fund Access', 'Subsidy Information', 'Insurance Claims', 'Compensation Guidelines', 'Emergency Policies'],
    buttonText: 'Explore Schemes',
  },
  {
    hue: 340,
    title: 'Lost & Found',
    image: './images/lost_&_found.webp',
    details: ['Report Missing Person', 'Search & Match Reports', 'Upload Photos / Info', 'Verified NGO/Police Help', 'Family Reunification'],
    buttonText: 'Search or Report',
  },
];

const faqs = [
  {
    question: 'Is Sarathi free to use?',
    answer: 'Yes, Sarathi is completely free for victims, volunteers, and NGOs.',
  },
  {
    question: 'How can I request help without internet?',
    answer: 'You can fill out the Help Request Form offline. It will automatically sync when your internet is restored.',
  },
  {
    question: 'Who can become a volunteer?',
    answer: 'Anyone above 18 with a willingness to help can join as a volunteer by signing up and selecting preferred roles.',
  },
  {
    question: 'How are requests verified?',
    answer: 'NGOs and local authorities verify requests manually and through geo-tagged inputs, images, and urgency level.',
  },
  {
    question: 'Can I track my request status?',
    answer: 'Yes, once submitted, you will receive updates and can track your help request via your registered dashboard.',
  },
];

const LandingPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  // Toggle FAQ
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const navigate = useNavigate();

  // Extended button navigation
  const handlebutton = (title) => {
    if (title === 'Victim Support') {
      navigate('/victim');
    } else if (title === 'Volunteer Module') {
      navigate('/volunter');
    } else if (title === 'News Feed') {
      navigate('/news');
    } else if (title === 'NGO Dashboard') {
      navigate('/ngo');
    } else if (title === 'Donation') {
      navigate('/donation');
    } else if (title === 'Community Broadcasts') {
      navigate('/broadcasts');
    } else if (title === 'Government Schemes') {
      navigate('/schemes');
    } else if (title === 'Lost & Found') {
      navigate('/lostfound');
    }
  };

  return (
    <>
      <div className="heading">
        <header className='head'>
          <div className="logo">Sarathi</div>
          <nav className='nav-links'>
            <a href="#home">Home</a>
            <a href="#features">Feature</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="auth-buttons">
            <button className="loginbtn">Login</button>
            <button className="signupbtn">Sign Up</button>
          </div>
        </header>

        <div className="mainbody">
          <div className="image-section"> 
            <img src="/images/img.jpg" alt="" className='imgmain'/>
            <div className="text-section">
              <h2>Empowering Communities in Crisis</h2>
              <p>
                Our all-in-one disaster management platform connects victims, volunteers, and NGOs with real-time support and verified information. Whether you're seeking help, offering aid, or managing rescue operations — we bring everyone together for faster, smarter relief.
              </p>
            </div>
          </div>
        </div>

        <h2 style={{color:'#3B444B',fontSize:'30px',fontFamily:"cursive",textAlign:"center"}}>OUR CORE FEATURES</h2>

        <div className="ALL-cards">
          {cardData.map((card, index) => (
            <div className="flip-card-container" style={{ '--hue': card.hue }} key={index}>
              <div className="flip-card">
                {/* Front */}
                <div className="card-front">
                  <figure>
                    <div className="img-bg"></div>
                    <img src={card.image} alt={card.title} />
                    <figcaption>{card.title}</figcaption>
                  </figure>
                  <ul>
                    {card.details.map((item, i) => (
                      <li key={i} style={{textAlign:'center'}}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Back */}
                <div className="card-back">
                  <figure>
                    <div className="img-bg"></div>
                    <img src={card.image} alt={card.title} />
                  </figure>
                  <button onClick={()=>handlebutton(card.title)}>{card.buttonText}</button>
                  <div className="design-container">
                    {[...Array(8)].map((_, i) => (
                      <span className={`design design--${i + 1}`} key={i}></span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="faq-section"> 
          <h2 style={{color:'#3B444B',fontSize:'30px',fontFamily:"cursive"}}>Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? 'open' : ''}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <h4>{faq.question}</h4>
                <span className="toggle-icon">{openIndex === index ? '-' : '+'}</span>
              </div>
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section brand">
              <h2>Sarathi</h2>
              <p>Empowering communities in crisis through real-time collaboration and support.</p>
            </div>

            <div className="footer-section links">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-section contact">
              <h3>Contact Us</h3>
              <p>Email: support@sarathi.org</p>
              <p>Phone: +91 88959 05526</p>
              <p>Address: Bhubaneswar, Odisha, India</p>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Sarathi. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default LandingPage;
