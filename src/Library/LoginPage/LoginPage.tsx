import { useState, useEffect, useRef } from 'react'
import './LoginPage.css'
import gsap from 'gsap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark, faBookOpenReader, faEye, faAngleDoubleLeft, faAngleDoubleRight, faMagnifyingGlass  } from "@fortawesome/free-solid-svg-icons"
import SearchBooks from '../../Library/SearchBooks/SearchBooks.tsx'
import WeatherSection from '../../Library/WeatherSection/WeatherSection.tsx'
import DailyNews from '../DailyNews/DailyNews.tsx'
import axios from "axios";
import { useSearch } from '../../Library/SearchBooks/SearchConfig.tsx'
const getIndex = (current: number, offset: number, length: number) => {
  return (current + offset + length) % length
}

const LoginPage = () => {
const {
    handleRead,
    searchTerm,
    handleSearch,
    containerRef,
    handlePreview,
    handleBookmark,
  } = useSearch()
  const [middleImg, setMiddleImg] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const bounceRef  = useRef<HTMLDivElement>(null)
const [sliderBooks, setSliderBooks] = useState<any[]>([])
const size = 12
  useEffect(() => {
  const fetchSliderBooks = async () => {
    try {
      const res = await fetch(`https://gutendex.com/books?page_size=${size}`)
      const data = await res.json()
      setSliderBooks(data.results)
      console.log('Slider Books:', data.results)
    } catch {
      // setError(err)
      setSliderBooks([])
    }
  }
  fetchSliderBooks()
}, [])

  useEffect(() => {
    if(bounceRef.current){
      gsap.to(bounceRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      gsap.to(bounceRef.current, {
        rotate: 2,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: 'none'
      })
    }
  }, [])

const SlideAnimation = ()=>{
    gsap.fromTo('.MiddleImge',
      {x: -300, opacity: 0 , scale: 0.5},
      {x: 0, opacity: 1, scale: 1, duration: 0.5}
    )
    gsap.fromTo('.rightImage ',
      {x: -200, opacity: 0 , scale: 0.5},
      {x: 0, opacity: 1, scale: 1, duration: 0.5}
    )
    gsap.fromTo('.leftImage',
      {x: 100, opacity: 0 , scale: 0.5},
      {x: 0, opacity: 1, scale: 1, duration: 0.5}
    )
    gsap.fromTo('.left2Image',
      {x: 10, opacity: 0 , scale: 0},
      {x: 0, opacity: 1, scale: 1, duration: 0.5}
    )
  }

   useEffect(() => {
    const interval = setInterval(() => {
      setMiddleImg(prev =>
        prev === sliderBooks.length - 1 ? 0 : prev + 1
      )
      SlideAnimation()
    }, 5000)
    return () => clearInterval(interval)
  }, [sliderBooks.length])

  const left2 = getIndex(middleImg, -2, sliderBooks.length)
  const left1 = getIndex(middleImg, -1, sliderBooks.length)
  const right1 = getIndex(middleImg, 1, sliderBooks.length)
  const right2 = getIndex(middleImg, 2, sliderBooks.length)

  
   const increament = () => {
    setMiddleImg(middleImg === sliderBooks.length - 1 ? 0 : middleImg + 1)
    SlideAnimation()
   }

  const decreament = () => {
    setMiddleImg(middleImg === 0 ? sliderBooks.length - 1 : middleImg - 1);
    SlideAnimation()
  }

   const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchEndX - touchStartX.current
    if (diff > 50) {
      // Swipe right
      decreament()
      SlideAnimation()
    } else if (diff < -50) {
      // Swipe left
      increament()
      SlideAnimation()
    }
    touchStartX.current = null
  }
// import User from '../Schema/RegistrationSchema.js'
  const [username, setUsername] = useState<string | null>(null);

 useEffect(() => {
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert('please login')
    };

    try {
      const res = await axios.get("https://librarycafe-csuo.onrender.com/api/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data?.success) {
        setUsername(res.data?.user?.Username);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  fetchUser();
}, []);

    
  return (
    <div className="SeachContainer">
      <div className="WelcomBack">
        <p>Welcome Back, {username}!</p>
        </div>
      <div className="search">
        
                <input type='search' placeholder='Search for books' value={searchTerm}
          onChange={handleSearch}/>
                <i><FontAwesomeIcon icon={faMagnifyingGlass}/></i>
              </div>
              <h2 className='browesbook'>Browse books online</h2>

              <div className="NewBooks">
                <div className="NewsBookSliderContainer">
                  <p className="SectionHead">New Books</p>
                  <div ref={bounceRef} className="NewBookImages"
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}>

                  
                    <img src={sliderBooks[left2]?.formats['image/jpeg']} alt='new book' className='left2Image'/>
            <img src={sliderBooks[left1]?.formats['image/jpeg']} alt='new book' className='leftImage'/>

            <div className='MiddleContainer'>
                    <div>
                      <img className='MiddleImge' src={sliderBooks[middleImg]?.formats['image/jpeg']} alt='new book'/>
                    </div>
                    <div className='NewBookText'>
                      <i title='Read' onClick={() => handleRead(sliderBooks[middleImg])}><FontAwesomeIcon icon={faBookOpenReader}/></i>
                      <i title='Preview' onClick={() => handlePreview(sliderBooks[middleImg])}><FontAwesomeIcon icon={faEye}/></i>
                      <i title='Bookmark' onClick={() => handleBookmark(sliderBooks[middleImg])}><FontAwesomeIcon icon={faBookmark}/></i>
                    </div>
                  </div>
            <img src={sliderBooks[right1]?.formats['image/jpeg']} alt='new book' className='rightImage'/>
            <img src={sliderBooks[right2]?.formats['image/jpeg']} alt='new book' className='right2Image'/>
                  </div>
                </div>

                <div className='newsButton'>
                    <button onClick={() => decreament() }><i><FontAwesomeIcon icon={faAngleDoubleLeft}/></i></button>
                    <button onClick={() => increament()}><i><FontAwesomeIcon icon={faAngleDoubleRight}/></i></button>
                </div>
              </div>

              <div className="SeacrhedBooks" ref={containerRef}>
                  <SearchBooks/>
              </div>

              <div className="DailyNews">
                <DailyNews/>
                
                </div>

                <div className="Weather">
                  <WeatherSection/>
                {/*  */}
              </div>
    </div>
  )
}

export default LoginPage