import './Header.css'

function Header() {
    return (
      <div className='header-container'>
        <h1 className='logo'>SOP Organizer</h1>
        <nav className='nav-items'>
          <span>Welcome, "Name here"</span>
          <span>icon here</span>
        </nav>
      </div>
    );
  }
  
  export default Header;