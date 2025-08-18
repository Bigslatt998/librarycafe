import './DailyNews.css'
import { useEffect, useState } from 'react'
import Bookloading from '../../Loader/Bookloading'

type NewsItem = {
  title: string
  description: string
  url: string
  urlToImage: string
  publishedAt: string
  source: { name: string }
  content?: string
}

const categories = [
  'business',
  'sports',
  'technology',
  'entertainment',
  'health',
  'science',
  'general'
]

const DailyNews = () => {
  const [news, setNews] = useState<NewsItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const fetchNews = async (pageNum: number) => {
    setLoading(true)
    try {
      const promises = categories.map(cat => {
        const url = new URL("https://librarycafe-csuo.onrender.com/api/news")
        url.searchParams.append("category", cat)
        url.searchParams.append("page", pageNum.toString())
        url.searchParams.append("pageSize", "1")

        return fetch(url.toString())
          .then(res => res.json())
          .then(data => data.articles || [])
      })

      const results = await Promise.all(promises)
      const articles = results.flat() as NewsItem[]
      setNews(articles)
    } catch (err) {
      console.error("Error in fetchNews:", err)
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews(page)
  }, [page])

  const handleReadMore = (item: NewsItem) => {
    window.open(item.url, "_blank")
  }

  const trimDescription = (desc?: string) =>
    desc ? desc.split(" ").slice(0, 30).join(" ") + "..." : ""

  return (
    <div>
      <p className="SectionHead">News Section</p>
      <div className="DailryNewsContainer">
        {loading && <div>Loading news...</div>}
        {news.map((item, idx) => (
          <div className="Box Box1" key={idx}>
            <div className="DailyImg">
              <img src={item.urlToImage || 'https://via.placeholder.com/150'} alt='' />
            </div>
            <div className="DailyText">
              <p>{item.source.name}</p>
              <p className="Headline">{item.title}</p>
              <p className="Details">{trimDescription(item.description)}</p>
              <button onClick={() => handleReadMore(item)}>Read more</button>
            </div>
          </div>
        ))}
        <div className="NewsButton">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
      {loading && <Bookloading />}
    </div>
  )
}

export default DailyNews
