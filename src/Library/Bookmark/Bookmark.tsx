import './Bookmark.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpenReader, faEye, faTrash } from "@fortawesome/free-solid-svg-icons"
import { useSearch } from '../../Library/SearchBooks/SearchConfig.tsx'
import {useEffect} from 'react'
import axios from 'axios'
import Bookloading from '../../Loader/Bookloading';
import {useState} from 'react'
const Bookmark = () => {
    const {Bookmark, handleRead, handleRemove, handlePreview, setBookmark} = useSearch()
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
  const fetchBookmarks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setBookmark([]);
      return;
    }
    setLoading(true)

    try {
      
      const res = await axios.get("https://librarycafe-csuo.onrender.com/api/bookmark", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success) {
        setBookmark(res.data.bookmarks);
      }
    } catch (err) {
      console.error("Error fetching bookmarks", err);
    }
    finally {
    setLoading(false);
  }
  };
  fetchBookmarks();
}, [setBookmark]);

  return (
    <div className="BookmarkContainer">
      Bookmarks

      {Bookmark.length > 0 ? (
        <div className="BookmarkContent">
          {Bookmark.map((bookmark) => (
          <div className="BookmarkItem" key={bookmark._id}>
            <img src={bookmark.formats['image/jpeg']} alt={bookmark.title} width='100%' height='100%' />
            {bookmark.expiredAt && (
              <p className="BookExpiration">
                {bookmark.expiredAt > Date.now().toLocaleString() ? 
                  `Expires on: ${new Date(bookmark.expiredAt).toLocaleDateString()}` : 
                  "This bookmark has expired."
                }
              </p>
            )}
            <div className='ICons'>
            <i onClick={() => handleRead(bookmark)}><FontAwesomeIcon icon={faBookOpenReader}/></i>
            <i onClick={() => handlePreview(bookmark)}><FontAwesomeIcon icon={faEye}/
            ></i>
            <i onClick={()=> handleRemove(bookmark._id)}><FontAwesomeIcon icon={faTrash}/
            ></i>

          </div>
          </div>
            
          ))}
        </div>
          
        ): (
          <div className="NoBookmark">
            <h2>No Preview Available</h2>
            <p>Please save book to bookmark.</p>
          </div>
        )}
      
       {loading &&(
        <Bookloading/>
        )}
    </div>
  )
}

export default Bookmark