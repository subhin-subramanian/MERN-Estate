import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import CreateAdd from './pages/CreateAdd'
import Search from './pages/Search'
import PostAdd from './pages/PostAdd'
import FooterComp from './components/FooterComp'

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>      
        <Route path='/' element={<Home/>}/>
        <Route path='/create-add' element={<CreateAdd/>}/>
        <Route path='/post-add' element={<PostAdd/>}/>
        <Route path='/search' element={<Search/>}/>
      </Routes>
      <FooterComp/>
    </BrowserRouter>
    
  )
}

export default App
