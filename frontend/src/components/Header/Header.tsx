import './Header.css'

import { FaUserCircle } from 'react-icons/fa'
import Heading from '../Heading/Heading';
import View from '../View/View';

interface HeaderProps {
  username?: string;
}

function Header({ ...props }: HeaderProps) {
    const displayUserInfo = () => {
      if (props.username) {
        return `Welcome, ${props.username}`
      }
      return 'Please register or login';
    }

    return (
      <View 
        container
        className='header-container' 
        justifyContent='flex-end' 
        alignItems='center'
        padding='30px 10%'>
        <Heading 
          text='SOP Organizer' 
          className='logo' 
          renderAs='h1' />
        <nav className='nav-items'>
          <span>{displayUserInfo()}</span>
          <FaUserCircle className='user-profile' size={24} />
        </nav>
      </View>
    );
  }
  
export default Header;