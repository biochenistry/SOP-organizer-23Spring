import './Header.css'

import Heading, { HeadingSize } from '../Heading/Heading';
import Paragraph from '../Paragraph/Paragraph';

function Header() {
    return (
      <div className='header-container'>
        <Heading text={'SOP Organizer'} classes={['logo']} size={HeadingSize.Large} />
        <nav className='nav-items'>
          <span>Welcome, NAME HERE</span>
          <span id='user-profile'>ICON HERE</span>
        </nav>
      </div>
    );
  }
  
export default Header;