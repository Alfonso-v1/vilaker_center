/*
CITATION FOR: Modal styling
Date: 5/28/26
Adapted From: Claude
Originality: Claude helped with design of the home cards.
Source URL: https://claude.ai/chat/
Summary of Prompts: Claude was prompted to aid designing home cards that would be kept at equal sizing and allow links.
*/

import { Link } from "react-router-dom";
import membership from '../assets/membership.jpg';
import pottery from '../assets/pottery-class.jpg';
import rentals from '../assets/tool-rental.jpg';


function Home() {
  return (
    <div>

      <main className="home">
        <section className="home-intro">
          <h1>Vilaker Lifelong Learning Center</h1>

          <p>
            Borrow tools, take hands-on classes, and learn useful life skills with your community.
          </p>
        </section>

        <section className="home-card-grid">

          <Link to='/classes' className="image-card">
            <img src={pottery} alt='Pottery Class' />
            <div className="image-card-text">
              <h2>Want to Learn a new skill?</h2>
              <p>Check out our upcoming classes.</p>
            </div>
          </Link>

          <Link to='/tools' className="image-card">
            <img src={rentals} alt='Tool wall' />
            <div className="image-card-text">
              <h2>Need tools for a project?</h2>
              <p>View our tool library catalog.</p>
            </div>
          </Link>

          <Link to='/member-tiers' className="image-card">
            <img src={membership} alt='Group of people' />
            <div className="image-card-text">
              <h2>Want to join the center?</h2>
              <p>Learn more about our membership tiers.</p>
            </div>
          </Link>
        </section>
      </main>
      
    </div>
  );
}

export default Home;