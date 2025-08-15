import { createContext, useContext, useState, useEffect, useRef  } from 'react'
import type {ReactNode } from 'react'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
// import Bookmark from '../../Schema/BookmarkScheme.js'
type Book = {
  id: number
  title: string
  authors: { name: string }[]
  formats: { [key: string]: string }
  summaries: string[]
  copyright: boolean
  languages: string[]
  subjects?: string[]
  bookshelves?: string[]
  download_count?: number
  expiredAt?: string
  dateAdded?: string
  _id: string // For MongoDB ObjectId
}

type SearchContextType = {
  books: Book[]
  previewBooks: Book[]
  setPreviewBooks: (books: Book[]) => void
  searchTerm: string
  filterType: string
  filterValue: string
  page: number
  isMobile: boolean
  loading: boolean
  isPreviewOpened: boolean, 
  Bookmark: Book[], 
  setBookmark: (books: Book[]) => void,
  setIspreviewOpened: (isPreviewOpened: boolean) => void,
  setIsMobile: (isMobile: boolean) => void
  setBooks: (books: Book[]) => void
  setSearchTerm: (term: string) => void
  setFilterType: (type: string) => void
  setFilterValue: (value: string) => void
  setPage: (page: number) => void
  fetchBooks: () => Promise<void>
  handlePreview: (book: Book) => void
  handleBookmark: (book: Book) => void
  handleRead: (book: Book) => void 
  handleRemove: (id: string) => void 
  handleSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFilter: (e: React.ChangeEvent<HTMLSelectElement>) => void
  containerRef: React.RefObject<HTMLDivElement>
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) throw new Error('useSearch must be used within SearchProvider')
  return context
}

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([])
  const [previewBooks, setPreviewBooks] = useState<Book[]>([])
  const [Bookmark, setBookmark] = useState<Book[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('Filter')
  const [filterValue, setFilterValue] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 600)
  const containerRef = useRef<HTMLDivElement>(null)
const [loading, setLoading] = useState<boolean>(false)
const [isPreviewOpened, setIspreviewOpened] = useState<boolean>(false)


const fetchBooks = async () => {
     setLoading(true)
  try{
   let url = `https://gutendex.com/books?search=${searchTerm}&page=${page}&page_size=${isMobile ? 13 : 26}`
   if (filterType !== 'Filter' && filterValue) {
      if (filterType === 'Author name') url += `&author=${filterValue}`
      if (filterType === 'Year of release') url += `&release_year=${filterValue}`
      if (filterType === 'ISBN') url += `&isbn=${filterValue}`
    }
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Failed to fetch books ${res.status}`)
    const data = await res.json()
    setBooks(data.results)
    console.log( 'Fetched Books:', data.results)
  } catch (err) {
    console.log(err instanceof Error ? err.message : 'Failed to fetch books')
    setBooks([])
  } finally {
    setLoading(false)
  }
}

 


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setPage(1)
  }
 
  const handleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value
    setFilterType(type)
    setPage(1)
    if (type !== 'Filter') {
      const value = prompt(`Enter ${type}`)
      if (value) {
        setFilterValue(value)
        setSearchTerm('')
      } else {
        setFilterType('Filter')
        setFilterValue('')
      }
      } else {
      setFilterValue('')
    }
  }

  const handlePreview = (book: Book) => {
    console.log('Preview:', book)
    setPreviewBooks([book])
    setIspreviewOpened(true)
  }

 

 const handleRead = (book: Book) => {
  console.log('Read:', book)
  toast.success(`Downloading...`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
  const formatPriority = [
    'application/epub+zip',
    'application/octet-stream',
    'application/rdf+xml',
    'text/html; charset=utf-8',
    'text/html',
    'text/plain',
    'text/plain; charset=utf-8',
    'application/pdf',
    'application/x-mobipocket-ebook',
    'image/jpeg',
    'text/plain; charset=us-ascii',

  ]

  const availableFormat = formatPriority.find(
    (format) => book.formats[format])
  if (availableFormat) {
    const Readurl = book.formats[availableFormat]
    if (Readurl) window.open(Readurl, '_blank', 'noopener,noreferrer')
  } else{
    toast.error(`No suitable format found for reading`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
  }
  toast.warn(`Checking....`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });

 }

useEffect(() => {
  const checkExiredBookmarks = () => {
    setBookmark(prevBookMarks => {
      const now = Date.now().toLocaleString()
      return prevBookMarks.filter(bookmark => {
        if (!bookmark.expiredAt) return true 
        if (bookmark.expiredAt > now) return true
        toast.warn(`Bookmark for "${bookmark.title}" has expired!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return false
      })
    })
  }
  checkExiredBookmarks()
  const interval = setInterval(checkExiredBookmarks, 60 * 60 * 1000)
  return () => clearInterval(interval) 
}, [])

  const handleBookmark = async (book: Book) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.warn("Please login to add", { theme: "dark" });
    return;
  }
  const existing = Bookmark.find(b => b.title === book.title);
  if(existing){
    alert('Already in bookmark')
  }

  setLoading(true)
  try {
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const res = await axios.post("http://localhost:3000/api/bookmark", {
      title: book.title,
      formats: book.formats,
      expiresAt
    }, {
      headers: 
      { Authorization: `Bearer ${token}` }
    });

    if (res.data?.success) {
      setBookmark(prev => [...prev, res.data.bookmark]);
      toast.success("Book added to bookmark!", { theme: "dark" });
    } else {
      toast.warn(res.data?.error || "Could not add bookmark", { 
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
      });
    }
  } catch (error) {
    console.error("Error adding bookmark:", error);
    toast.error('Failed to add bookmark', { 
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
    });
  }
  finally {
    setLoading(false);
  }
};


  const handleRemove = async (id: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    toast.warn("Please login to remove", { 
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark", });
    return;
  }
  setLoading(true)
  try {
    await axios.delete(`http://localhost:3000/api/bookmark/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setBookmark(prev => prev.filter(b => b._id !== id));
    toast.success("Book removed from bookmark!", {        position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark", });
  } catch {
    toast.error("Failed to remove bookmark",{          
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark", 
          });
  }
  finally {
    setLoading(false);
  }
};
  return (
    <SearchContext.Provider
      value={{
        books,
        searchTerm,
        filterType,
        filterValue,
        page,
        loading,
        isMobile,
        containerRef: containerRef as React.RefObject<HTMLDivElement>,
        isPreviewOpened, 
        previewBooks,
        Bookmark, 
        setIspreviewOpened,
        setBookmark,
        setSearchTerm,
        setFilterType,
        setFilterValue,
        setPreviewBooks,
        setPage,
        setBooks,
        fetchBooks,
        handlePreview,
        handleBookmark,
        handleRead,
        handleSearch,
        handleFilter,
        setIsMobile,
        handleRemove
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}