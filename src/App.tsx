import './App.css'
import { Routes, Route } from 'react-router-dom'
// import WelcomePage from './Library/WelcomePage/WelcomePage.tsx'
import LoginPage from './Library/LoginPage/LoginPage.tsx'
import RegisterPage from './Library/RegisterPage/RegisterPagecopy.tsx'
import HomePage from './Library/HomePage/HomePage.tsx'
// import Bookmark from './Library/Bookmark/Bookmark.tsx'
import Bookmark from './Library/Bookmark/Bookmark.tsx'
// import ReadingPage from './Library/ReadingPage/ReadingPage.tsx'
import {SearchProvider} from './Library/SearchBooks/SearchConfig.tsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Resetinfo from './Library/ResetInfo/Resetinfo.tsx'
import Passwordinfo from './Library/ResetInfo/Passwordreset.tsx'

function App() {
  

  return (
    <>
    <SearchProvider>
      <ToastContainer/>
    <Routes>
      <Route path='/' element={<RegisterPage/>}/>
        <Route path='/Homepage' element={<HomePage/>}>
          <Route index element={<LoginPage/>}></Route>
          <Route path='Bookmark' element={< Bookmark/>}></Route>
        </Route>
      <Route path='/username-reset-page' element={ <Resetinfo/>}></Route>
      <Route path='/password-reset-page' element={ <Passwordinfo/>}></Route>
      <Route path='*' element={ <h1>Error page not found</h1>}></Route>
    </Routes>
    </SearchProvider>
    </>
  )
}

export default App
