import './App.css'
import StockDashboard from './watchtable/stock-dashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <StockDashboard/>
      <ToastContainer position="top-center" autoClose={1300}/>
    </>
  )
}

export default App
