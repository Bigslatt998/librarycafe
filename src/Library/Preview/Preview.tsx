import { useSearch } from '../SearchBooks/SearchConfig'
import './Preview.css'
 type PreeviewProps = {
  setIspreviewOpened: (value: boolean) => void,
 }


const Preview = ({ setIspreviewOpened}: PreeviewProps) => {
 const {previewBooks, handleRead, Bookmark, handleBookmark} = useSearch()
    
  return (
    <div className="Preview">
      <i onClick={() => setIspreviewOpened(false)}>X</i>
      <div className="PreviewContainer">

        {previewBooks.length > 0 ? (
          <div className="PreviewContent">
            <h2>Book Preview</h2>
            <div className="BookDetails">
            {previewBooks.map((book, index) => {
               const isBookmarked = Bookmark.some(bookmark => bookmark.title === book.title)

                const BookmarkedItems = Bookmark.find(bookmark => bookmark.title === book.title)
              return(
                <div key={index} className="BookItem">
                  <img src={book.formats['image/jpeg']} alt={book.title} />
                  <h3><span>Title:</span> {book.title}</h3>
                  <p><span>Author's name:</span> {book.authors?.map(author => author.name)?.join(', ')}</p>
                  <p><span>language:</span> {book.languages?.join(', ')}</p>
                  <p><span>Total downloads:</span> {book.download_count}</p>
                  <p><span>Summary:</span> <br/> {book.summaries ? book.summaries?.join(' ') : 'No summary available'}</p>
                  
                  <div className='DateXExpire'>
                    {isBookmarked && BookmarkedItems?.dateAdded && (
                    <p>Date Added: {new Date(BookmarkedItems.dateAdded).toLocaleDateString()} </p>

                    )}

                  {isBookmarked && BookmarkedItems?.expiredAt && (
                    <p className="Expiration">
                {BookmarkedItems.expiredAt > Date.now().toLocaleString() ? 
                  `Expires on: ${new Date(BookmarkedItems.expiredAt).toLocaleDateString()}` : 
                  "This bookmark has expired."
                }
              </p>
                  )}

                  </div>
                  
                  <div className='BookItemBTN'>
                    <button onClick={() => handleRead(book)} >Read Online</button>
                    {!isBookmarked && (
                  <button onClick={() => handleBookmark(book)}> Bookmark</button>

                    )}
                  </div>
                </div>
              )
            })}
            </div>
          </div>
        ): (
          <div className="NoPreview">
            <h2>No Preview Available</h2>
            <p>Please select a book to preview.</p>
          </div>
        )}
                  
    </div>
    </div>
  )
}

export default Preview

