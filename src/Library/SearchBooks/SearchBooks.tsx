import './SearchBooks.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark, faBookOpenReader, faEye } from "@fortawesome/free-solid-svg-icons"
// import { useSearch } from './SearchConfig'
import {useSearch} from './SearchConfig.tsx'
import { useEffect} from 'react'

const SearchBooks = () => {
const {
    books,
    searchTerm,
    handlePreview,
    handleBookmark,
    handleRead,
    page,
    setPage,
    loading,
    filterType,
    filterValue,
    handleFilter,
    setIsMobile,
    fetchBooks,
    setBooks,
    isMobile
  } = useSearch()
  useEffect(() => {
      const handleResize = () => setIsMobile(window.innerWidth < 600)
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [setIsMobile])

    useEffect(() => {
        if (searchTerm || (filterType !== 'Filter' && filterValue)) {
          fetchBooks()
        } else {
          setBooks([])
        }
      }, [searchTerm, filterType, filterValue, page, isMobile, fetchBooks,setBooks])
    
  return (
    <div className="SearchBooksContainer">
            <p className="SectionHead">Library Section</p>
                <div className='Filter'>
                  {books.length > 0 && (
                    <select value={filterType} onChange={handleFilter}>
                    <option>Filter</option>
                    <option>Author name</option>
                    <option>Year of release</option>
                    <option>ISBN</option>
                  </select>
                  )}
                  
                </div>
                  <div className='galleryContainer'>

                  
        {books.length === 0 && !searchTerm && !filterValue && (
          <div className="emptyShelf">Hey chef your Library shelf is empty</div>
        )}
        {loading ? (
          <p>Loading</p>
        ) : !books ? (
          <>
          <p>No books found</p>
          </>
        ) : (
          <>
          {books.map((book) => (
          <div className='galleryitem' key={book.id}>
            <div className='SeacrhImages'>
              <img src={book.formats['image/jpeg']} alt={book.title} width='100%' height='100%' />
            </div>
            <div className='SearchText'>
              <i title='Read' onClick={() => handleRead(book)}><FontAwesomeIcon icon={faBookOpenReader}/></i>
              <i title='Preview' onClick={() => handlePreview(book)}><FontAwesomeIcon icon={faEye}/></i>
              <i title='Bookmark' onClick={() => handleBookmark(book)}><FontAwesomeIcon icon={faBookmark}/></i>
            </div>
          </div>
        ))}
          </>
        )}
        
        {books.length > 0 && (
          <div className="SearchButton">
              <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
          <button onClick={() => setPage(page + 1)} disabled={books.length < (isMobile ? 13 : 26)}>Next</button>
          </div>
        )}
                </div>
    </div>
  )
}

export default SearchBooks