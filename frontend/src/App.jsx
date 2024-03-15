import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Dashboard from './pages/Dashboard'
import SendMoney from './pages/SendMoney'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Profile from './pages/Profile'
import Topup from './pages/Topup'
import { RecoilRoot } from 'recoil'

function App() {

  return (
    <>
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signin />} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path="signin" element={<Signin/>} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/transfer' element={<SendMoney/>} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/topup' element={<Topup />} />
        </Routes>
      </BrowserRouter>
      </RecoilRoot>
    </>
  )
}

export default App
