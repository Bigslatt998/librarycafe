import Librarycafe from '../../assets/Librarycafe.png'
import {  useState } from 'react'
import axios from 'axios';
import Bookloading from '../../Loader/Bookloading';

const Passwordinfo = () => {
  const [step, setStep] = useState<1 | 2 | 3 >(1)
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const requestCode = async () => {
        setLoading(true);
      try {
        const res = await axios.post("http://localhost:3000/forgot-password", { email });
        console.log(res.data.code)
        localStorage.setItem("resetEmail", email);
        setStep(2);
      } catch{
          console.error('Failed');
      } finally {
        setLoading(false);
      }
    };
  
    const handleVerifyCode = async () => {
      setLoading(true)
    try {
      const res = await axios.post("http://localhost:3000/verify-code", { email, code });
      console.log(res.data.message);
      setStep(3);
    } catch (err) {
      console.log(err)
    }
    finally {
        setLoading(false);
      }
  };
    
  const handleResetPaaword = async () => {
    const email = localStorage.getItem("resetEmail");
    setLoading(true)
      try {
        await axios.post("http://localhost:3000/reset-password", {
          email,
          newPassword,
        });
      } catch (err) {
        console.log(err)
      }
      finally {
        setLoading(false);
      }
    };

  return (
    <div className="PasswordinfoContainer">
        <div className="ResetPage">
        <div className="ResetNav">
          <nav>
            <div className="logo" >
              <img src={Librarycafe}/>
            </div>
          </nav>    
            <p className='Reseeeeet'>Reset password</p>
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
                <p>New password</p>
                <input type='text' placeholder='New password' value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required/>
                
              <>
              </>
                <p>Confirm Password</p>
               
                <button onClick={handleResetPaaword}>Reset</button>
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

export default Passwordinfo