import { useFloating, offset } from '@floating-ui/react';
import { FaUserCircle } from 'react-icons/fa'
import Heading from '../Heading/Heading';
import View from '../View/View';
import { useAuthState } from '../Auth';
import { StyleSheet, css } from 'aphrodite';
import { Colors } from '../GlobalStyles';
import { createStyle } from '../../util/createStyle';
import { useEffect, useState } from 'react';
import Paragraph from '../Paragraph/Paragraph';
import { gql, useMutation } from '@apollo/client';
import { logout } from '../Auth/authStateReducer';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import Button from '../Button/Button';

const LOGOUT = gql`
mutation logout {
  success: logout
}
`;

type LogoutResponse = {
  success: boolean;
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.isuRed,
    borderBottom: `4px solid ${Colors.isuYellow}`,
    color: '#ffffff',
  },
  popupAction: {
    padding: '16px',
    'user-select': 'none',
    ':hover': {
      backgroundColor: Colors.neutralHover,
      cursor: 'pointer',
    },
    ':active': {
      backgroundColor: Colors.neutralActive,
    },
  },
  popupActionLink: {
    color: Colors.textPrimary,
    textDecoration: 'none',
  },
  userPopupContainer: {
    backgroundColor: '#ffffff',
    borderColor: Colors.harlineGrey,
    borderRadius: '4px',
    borderStyle: 'solid',
    borderWidth: '1px',
    color: Colors.textPrimary,
    display: 'flex',
    flexDirection: 'column',
    padding: '4px 0',
  },
});

function Header() {
  const navigate = useNavigate();
  const { state, dispatch } = useAuthState();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [logoutUser] = useMutation<LogoutResponse>(LOGOUT);
  const { x, y, strategy, refs } = useFloating({
    placement: 'bottom-start',
    middleware: [offset(4)],
  });

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (refs.domReference.current && (!refs.domReference.current.contains(target) && !refs.floating.current?.contains(target))) {
        setIsOpen(false);
      }
    }

    document.addEventListener('click', handleClick, true);

    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [refs.domReference, refs.floating]);

  const handleLogout = async () => {
    const { data } = await logoutUser();

    setIsOpen(false);

    if (data?.success) {
      dispatch(logout());
    }

    navigate('/');
  }

  return (
    <>
      <View
        container
        className={css(styles.header)}
        justifyContent='space-between'
        alignItems='center'
        padding='30px 10%'>

        <Heading text='SOP Organizer' renderAs='h1' />


        <View container alignItems='center' gap='16px'>
          {state.user ?
            <>
              <Paragraph style={{ color: '#ffffff' }}>Welcome, {state.user.firstName}</Paragraph>
              <div onClick={() => { setIsOpen(!isOpen) }} ref={refs.setReference}>
                <FaUserCircle style={{ cursor: 'pointer' }} size={32} />
              </div>
            </>
            :
            <Button label='Login' href='/login' variant='secondary' onDark type='submit' style={{ width: '100%' }} />
          }
        </View>
      </View>


      {
        isOpen &&
        <div ref={refs.setFloating} className={css(styles.userPopupContainer, createStyle({ position: strategy, top: y ?? 0, left: x ?? 0, width: 'max-content' }))}>
          <div className={css(styles.popupAction)}><Link to='/account-settings' className={css(styles.popupActionLink)} onClick={() => { setIsOpen(false); }}><Paragraph>Account Settings</Paragraph></Link></div>
          <div className={css(styles.popupAction)} onClick={handleLogout}><Paragraph>Logout</Paragraph></div>
        </div>
      }
    </>
  );
}

export default Header;