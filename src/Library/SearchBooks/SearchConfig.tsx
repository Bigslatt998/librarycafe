import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import type {ReactNode } from 'react'
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios'
// import Bookmark from '../../Schema/BookmarkScheme.js'
type Book = {
  id: number | string;
  title: string;
  authors?: { name: string }[];
  formats: { [key: string]: string };
  summaries?: string[];
  copyright?: boolean;
  languages?: string[];
  subjects?: string[];
  bookshelves?: string[];
  download_count?: number;
  expiredAt?: string;
  dateAdded?: string;
  _id: string;
  cover_i?: number;
  cover?: string;
  source?: 'gutendex' | 'openlibrary';
};

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


const fetchBooks = useCallback(async () => {
    setLoading(true);

    try {
      const pageSize = isMobile ? 13 : 26;

      // If filter applied → search OpenLibrary only
      if (filterType !== 'Filter' && filterValue) {
        let query = '';
        if (filterType === 'Author name') query = `author=${filterValue}`;
        if (filterType === 'Year of release') query = `first_publish_year=${filterValue}`;
        if (filterType === 'ISBN') query = `isbn=${filterValue}`;

        const url = `https://openlibrary.org/search.json?${query}&page=${page}&limit=${pageSize}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`OpenLibrary fetch failed: ${res.status}`);
        const data = await res.json();

        const mappedBooks: Book[] = data.docs.map((doc: any, idx: number) => ({
          id: doc.key || idx,
          title: doc.title,
          authors: doc.author_name ? doc.author_name.map((a: string) => ({ name: a })) : [],
          formats: {},
          cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : undefined,
          source: 'openlibrary',
        }));

        setBooks(mappedBooks);
        return;
      }

      // No filters → fetch both Gutendex + OpenLibrary
      const gutendexUrl = `https://gutendex.com/books?search=${searchTerm}&page=${page}&page_size=${pageSize}`;
      const openLibUrl = `https://openlibrary.org/search.json?q=${searchTerm || 'book'}&page=${page}&limit=${pageSize}`;

      const [gutendexRes, openLibRes] = await Promise.all([fetch(gutendexUrl), fetch(openLibUrl)]);
      if (!gutendexRes.ok || !openLibRes.ok) throw new Error('Failed fetching APIs');

      const gutendexData = await gutendexRes.json();
      const openLibData = await openLibRes.json();

      const gutendexBooks: Book[] = gutendexData.results.map((b: any) => ({
        id: b.id,
        title: b.title,
        authors: b.authors,
        formats: b.formats,
        cover: b.formats['image/jpeg'],
        source: 'gutendex',
      }));

      const openLibBooks: Book[] = openLibData.docs.map((doc: any, idx: number) => ({
        id: doc.key || `ol-${idx}`,
        title: doc.title,
        authors: doc.author_name ? doc.author_name.map((a: string) => ({ name: a })) : [],
        formats: {},
        cover: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : undefined,
        source: 'openlibrary',
      }));

      // Shuffle merge both
      const merged = [...gutendexBooks, ...openLibBooks].sort(() => Math.random() - 0.5);

      setBooks(merged);
    } catch (err) {
      console.error(err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, filterType, filterValue, page, isMobile]);

 


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
    if (!book.formats) {
      toast.warn('No readable formats for this book',{
        position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
      });
      return;
    }

    const formatPriority = [
      'application/epub+zip',
      'application/pdf',
      'text/plain',
      'text/html',
    ];

    const available = formatPriority.find((f) => book.formats && book.formats[f]);
    if (available) {
      window.open(book.formats![available], '_blank', 'noopener,noreferrer');
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
    } else {
      toast.error('No suitable format found',{
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
  };

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
    const res = await axios.post("https://librarycafe-csuo.onrender.com/api/bookmark", {
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
    await axios.delete(`https://librarycafe-csuo.onrender.com/api/bookmark/${id}`, {
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