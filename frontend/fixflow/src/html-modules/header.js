import React from 'react';
import '../semantic-css/home.css'; // Import the CSS file
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className='headerTop'>
      <Link  to={'/'}>
            <h1 >FixFlow</h1>
      </Link>
    </header>
  );
}

export default Header;
