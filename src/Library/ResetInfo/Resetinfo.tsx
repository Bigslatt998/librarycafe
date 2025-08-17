import './Resetinfo.css'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Librarycafe from '../../assets/Librarycafe.png'
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faBars } from '@fortawesome/free-solid-svg-icons'
import {  useState } from 'react'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Bookloading from '../../Loader/Bookloading';

const Resetinfo = () => {
      const [step, setStep] = useState<1 | 2 | 3 >(1)
 const [email, setEmail] = useState("");
  const [code, setCode] = useState<string>("");
  const [newUsername, setNewUsername] = useState("");
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

const requestCode = async () => {
      setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/forgot-password", { email });
      console.log(res.data.code)
      localStorage.setItem("resetEmail", email);
      setStep(2);
    } catch (err) {
        console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
  try {
    const res = await axios.post("http://localhost:3000/verify-code", { email, code });
    alert(res.data.message);
    setStep(3);
  } catch (err) {
    console.log(err);
  } finally{
    setLoading(false)
  }
};
  
const handleResetUsername = async () => {
  const email = localStorage.getItem("resetEmail");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/reset-username", {
        email,
        newUsername,
      });
      console.log(res.data.message)
    } catch (err) {
      console.log(err);
    }
    finally {
    setLoading(false);
  }
  };

  return (
    <div className="ResetinfoContainer">
        <div className="ResetPage">
        <div className="ResetNav">
          <nav>
            <div className="logo" >
              <img src={Librarycafe}/>
            </div>
          </nav>    
              <p className='Reseeeeet'>Reset username</p>
            <p></p>
          </div>

          <div className="ResetContent">
            {step === 1 && (
              <>
                <p>Enter email</p>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <button onClick={requestCode} disabled={loading}>{loading ? "Sending..." : "Send Code"}</button>
              </>
            )}

            {step === 2 && (
              <>
                <p>Enter verification code</p>
                <input type='text' placeholder='Enter code' value={code} onChange={(e) => setCode(e.target.value)} />
                <button onClick={handleVerifyCode}>Verify code</button>
              </>
            )}

            {step === 3 && (
              <>
                <p>Enter email</p>
                <input type='text' placeholder='New username' value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required/>
                <button onClick={handleResetUsername}>Reset</button>
              </>
            )}
            
          </div>
          </div>

                        {loading &&(
                        <Bookloading/>
                        )}
    </div>
  )
}

export default Resetinfo