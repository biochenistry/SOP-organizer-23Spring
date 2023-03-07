import './Header.css'

import { FaUserCircle } from 'react-icons/fa'
import Heading from '../Heading/Heading';
import View from '../View/View';
import { useAuthState } from '../Auth';

function Header() {
    const { state } = useAuthState();

    const displayUserInfo = () => {
      if (state.user) {
        return `Welcome, ${state.user.firstName}`
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
          <span>
            <FaUserCircle className='user-profile' size={24} />
          </span>
        </nav>
      </View>
    );
  }
  
export default Header;