import './WeatherSection.css'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from 'react'

type WeatherData = {
  country: string
  city: string
  temp: number
  weather: string
  icon: string
  time: string
}

const API_KEY = 'd1fe9bcb0d9c6c7b2e17646e70bc86a7'

const cities = [
  { city: 'Abuja' },
  { city: 'London' },
  { city: 'New York' },
  { city: 'Tokyo'},
  { city: 'Paris'},
  { city: 'Berlin'},
  { city: 'Moscow'},
  { city: 'Cairo'},
  { city: 'Beijing'},
  { city: 'Sydney'},
  { city: 'Rio de Janeiro' },
  { city: 'Cape Town' },
  { city: 'Toronto'},
  { city: 'Mumbai' },
  { city: 'Istanbul' },
  { city: 'Rome'},
  { city: 'Madrid'},
  { city: 'Seoul'},
  { city: 'Bangkok' },
  { city: 'Dubai'},
]

const WeatherSection = () => {
    const [weatherList, setWeatherList] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      setError('')
      try {
        const promises = cities.map(async ({ city }) => {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},&appid=${API_KEY}&units=metric`
          )
          if (!res.ok) throw new Error(`Failed! Please check your internent connection`)
          const data = await res.json()
          const nowUTC = Date.now() + new Date().getTimezoneOffset() * 60000
          const localTime = new Date(nowUTC + data.timezone * 1000)
          const timeString = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }).format(localTime)
          return {
            city: data.name,
            temp: Math.round(data.main.temp),
            weather: data.weather[0].main,
            icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
            time: timeString,
          } as WeatherData
        })
        const results = await Promise.all(promises)
        setWeatherList(results)
      } catch(err) {
        console.log(err)
      }
      finally{
        setLoading(false)
      }
    }
    fetchWeather()
    }, [])
  return (
    <div className="WeatherSectionContainer">
      <p className="SectionHead">Weather Section</p>
        <div className="WeatherContainer">
                {loading && <div>Loading weather...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {!loading && !error && weatherList.map((w, idx) => (
          <div className='Box Box2' key={idx}>
            <div className='StateName'>
              <p>{w.city}</p>
              <p>
                <img src={w.icon} alt={w.weather} style={{ width: 30, verticalAlign: 'middle' }} /> {w.weather}
              </p>
            </div>
            <div className='TempName'>
              <p>{w.temp}&deg;C</p>
              <p>{w.time}</p>
            </div>
          </div>
        ))}
                  </div>
    </div>
  )
}

export default WeatherSection