import Header from './components/Header/Header'
import { gql, useQuery } from "@apollo/client";

const DEMO_QUERY = gql`
query DemoQuery {
  me {
    id
    firstName
    lastName
    email
    isDisabled
    isAdmin
  }
}
`;

type DemoQueryResponse = {
  me: User | null;
}

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  isDisabled: boolean | null;
  isAdmin: boolean | null;
}

function App() {
  const { data } = useQuery<DemoQueryResponse>(DEMO_QUERY);

  return (
    <div className="App">
      <Header username={data?.me?.firstName} />
        <div>
          <p>{data?.me?.firstName}</p>
          <p>{data?.me?.lastName}</p>
          <p>{data?.me?.email}</p>
        </div>
        <a href='https://docs.google.com/document/d/1lG_U11017W_mKUPQLnA_rg_im3rXzSXiTSbM8i9U2s0/edit' target='_blank' rel='noreferrer'>Edit this document</a>
        <iframe title='sop-document-embed' src='https://docs.google.com/document/d/1lG_U11017W_mKUPQLnA_rg_im3rXzSXiTSbM8i9U2s0/preview' style={{ width: '1000px', height: '100vh', border: 'none' }} />
    </div>
  );
}

export default App;
