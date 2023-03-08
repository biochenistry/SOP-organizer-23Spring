import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import View from './components/View/View';
import { Route, Routes } from 'react-router';
import Login from './pages/Login';
import Page from './pages/UsersList';

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <View container flexDirection='row' height='100%'>
          <Sidebar />

          <Routes>
            <Route path='/login' element={<Login />} />
          </Routes>

          <Routes>
            <Route path='/users' element={<Page />} />
          </Routes>

        </View>
      </div >
    </>
  );
}

export default App;
