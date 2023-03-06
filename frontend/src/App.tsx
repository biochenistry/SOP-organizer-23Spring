import Header from './components/Header/Header'
import { gql, useQuery } from "@apollo/client";
import Sidebar from './components/Sidebar/Sidebar'
import View from './components/View/View';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  return (
    <>
      <div className="App">
        <Header />
        <View container flexDirection='row' height='100%'>
          <Sidebar />
          <View padding='32px'>
            <FileEmbed source='https://docs.google.com/document/d/1lG_U11017W_mKUPQLnA_rg_im3rXzSXiTSbM8i9U2s0/preview' title='sop-document-embed' width='1000px' height='100vh'/>
          </View>
        </View>
      </div >
    </>
  );
}

export default App;
