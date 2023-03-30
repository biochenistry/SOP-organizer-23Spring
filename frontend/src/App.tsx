import Header from './components/Header/Header'
import Sidebar from './components/Sidebar/Sidebar'
import View from './components/View/View';
import { Route, Routes } from 'react-router';
import Login from './pages/Login';
import FileView from './pages/FileView';
import UsersList from './pages/UsersList';
import Home from './pages/Home';
import FileViewFullscreen from './pages/FileViewFullscreen';

function App() {
  return (
    <Routes>
      <Route path='/' element={<WithHeaderAndSidebar><Home /></WithHeaderAndSidebar>} />
      <Route path='/login' element={<WithHeaderAndSidebar><Login /></WithHeaderAndSidebar>} />
      <Route path='/file/:fileId' element={<WithHeaderAndSidebar><FileView /></WithHeaderAndSidebar>} />
      <Route path='/file/:fileId/fullscreen' element={<FileViewFullscreen />} />
      <Route path='/users' element={<WithHeaderAndSidebar><UsersList /></WithHeaderAndSidebar>} />
    </Routes>
  );
}

type WithHeaderAndSidebarProps = {
  children: React.ReactNode;
}

function WithHeaderAndSidebar(props: WithHeaderAndSidebarProps) {
  return (
    <>
      <Header />
      <View container flexDirection='row' height='calc(100vh - 76px)'>
        <Sidebar />
        {props.children}
      </View>
    </>
  )
}

export default App;
