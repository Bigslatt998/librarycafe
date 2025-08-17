import './HomePage.css'
import Librarycafe from '../../assets/Librarycafe.png'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Preview from '../Preview/Preview'
import { useSearch } from '../SearchBooks/SearchConfig'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const HomePage = () => {
  const [CurrentPage, setCurrentPage] = useState<string>('Home')
  const {isPreviewOpened, setIspreviewOpened} = useSearch()


  useEffect(() => {
      if(isPreviewOpened){
        document.body.style.overflow = 'hidden';
      } else{
        document.body.style.overflow = '';
      }

      return () => {
      document.body.style.overflow = 'auto'
    }
  })
    const handleLogout = () => {
  localStorage.removeItem("token");
  toast.success("Logged out successfully!", { theme: "dark" });
  window.location.href = "/librarycafe/";
};

  return (
    <div className="HomePageContainer">
        <div className="HomePage">
          <div className="Nav">
          <nav>
            <div className="logo" >
              <img src={Librarycafe}/>
            </div>

            <ul>
              <li className={`${CurrentPage === 'Home' ? 'active' : ''}`} onClick={() => setCurrentPage("Home")}> <NavLink to=''>Home</NavLink></li>
            

              <li className={`${CurrentPage === 'Bookmark' ? 'active' : ''}`} onClick={() => setCurrentPage("Bookmark")}><NavLink to='Bookmark'>Bookmark</NavLink></li>

              <li className={`${CurrentPage === 'News' ? 'active' : ''}`} onClick={() => setCurrentPage("News")}>News</li>
            </ul>
          </nav>    
          
          <button className='logout' onClick={handleLogout}>Log out</button>

          </div>
           
           <main>
            

            <div className="outlet">
              <Outlet context={{isPreviewOpened, setIspreviewOpened}}/>
            </div>
            
            
           </main>
           {isPreviewOpened && (
              <Preview setIspreviewOpened ={setIspreviewOpened}/>
            )}
        </div>
    </div>
  )
}

export default HomePage