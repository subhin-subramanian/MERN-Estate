import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import CreateAdd from './pages/CreateAdd'
import Search from './pages/Search'
import PostAdd from './pages/PostAdd'
import FooterComp from './components/FooterComp'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import Ad from './pages/Ad'
import EditAd from './pages/EditAd'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>      
        <Route path='/' element={<Home/>}/>
        <Route path='/create-add' element={<CreateAdd/>}/>
        <Route path='/post-add' element={<PostAdd/>}/>
        <Route path='/search' element={<Search/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path='/profile' element={<Profile/>}/>
        </Route>
        <Route path='/ad/:adId' element={<Ad/>}/>
        <Route path='/edit-ad/:adId' element={<EditAd/>}/>
      </Routes>
      <FooterComp/>
    </BrowserRouter>
    
  )
}

export default App
