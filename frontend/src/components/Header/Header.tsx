import './Header.css'

import Heading, { HeadingSize } from '../Heading/Heading';

function Header() {
    return (
      <div className='header-container'>
        <Heading text={'SOP Organizer'} classes={['logo']} size={HeadingSize.Large} />
        <nav className='nav-items'>
          <span>Welcome, "Name here"</span>
          <span>icon here</span>
        </nav>
      </div>
    );
  }
  
export default Header;