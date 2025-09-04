import './RegisterPage.css'
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleDoubleUp, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import Librarycafe from '../../assets/Librarycafe.png'
import Libraryvideo from '../../assets/Libraryvideo2.mp4'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from '@emailjs/browser';
import { useState } from 'react'
import Bookloading from '../../Loader/Bookloading';

interface iRegisterInfo {
  Firstname: string;
  Lastname: string;
  Email: string;
  Username: string;
  Password: string;
  ConfirmPassword: string;
}

const registerSchema = yup.object().shape({
  Firstname: yup.string().required('First name is required'),
  Lastname: yup.string().required('Last name is required'),
  Username: yup.string().required('Username is required').min(5).max(15),
  Email: yup.string().required('Email is required').email('Invalid Email format'),
  Password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(12, 'Password must not exceed 12 characters'),
    // .matches(
    //   /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
    //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    // ),
  ConfirmPassword: yup
    .string()
    .required('Please confirm your Password')
    .oneOf([yup.ref('Password')], 'Passwords must match'),
});

const RegisterPage = () => {
    const [isRegisterActive, setIsRegisterActive] = useState<boolean>(false);
    const [isOverlayvisible, setIsOverlayvisible] = useState<boolean>(true);
    const [showPassword, setshowPassword] = useState<boolean>(false);
    const [LshowPassword, setLshowPassword] = useState<boolean>(false);
    const WelcomeContainerRef = useRef<HTMLDivElement>(null);
    const handleLoginClick = () => setIsRegisterActive(false);
    const handleRegisterClick = () => setIsRegisterActive(true);

    const [loading, setLoading] = useState<boolean>(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [sentCode, setSentCode] = useState('');
    const [codeSent, setCodeSent] = useState<boolean>(false);
    const [resendDisable, setResendDisabe] = useState<boolean>(false);
    const [resendCountDown, setResendCountDown] = useState<number>(0);
    const navigate = useNavigate();

    
    const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<iRegisterInfo>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      Firstname: '',
      Lastname: '',
      Email: '',
      Username: '',
      Password: '',
      ConfirmPassword: '',
    }
  });
const handleButtonClick = () => {
    // Animate red container UP with elastic ease
    gsap.to(WelcomeContainerRef.current, {
      y: "-100%",
      ease: "bounce.out", 
      duration: 3.5,
      onComplete: () => setIsOverlayvisible(false)
    });
  };

  useEffect(() => {
    document.body.style.overflow = isOverlayvisible ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOverlayvisible])

  const RegSubmit = async (data: iRegisterInfo) => {
    if(verificationCode === ''){
      console.log('Enter code')
      toast.warn('Input verification code!', {
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
    else if(verificationCode !== sentCode){
      console.log('Wrong code')
      toast.warn('Incorrect verification code!', {
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
    else {
      setLoading(true)
        try{
          await axios.post('https://librarycafe-csuo.onrender.com/api/register', {
            Firstname: data.Firstname,
            Lastname: data.Lastname,
            Email: data.Email,
            Username: data.Username,
            Password: data.Password,
            ConfirmPassword: data.ConfirmPassword,
          });
          console.log('Registration succesfull!')
        toast.success('Registration successfull!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setIsRegisterActive(false)
          reset()
        }
      
    catch (error: unknown){
      if(axios.isAxiosError(error)){
    console.log('error')
    toast.error(error.response?.data?.error, {
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
    } finally {
    setLoading(false);
  }
  }
  }

  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');  
  const handleLogin = async (e: React.FormEvent<HTMLButtonElement>) => { 
  e.preventDefault();
  // setError(null);
  setLoading(true);

  try {
    const res = await axios.post("https://librarycafe-csuo.onrender.com/api/login", {
      emailOrUsername,
      password
    });

    if (res.data?.success) {
      localStorage.setItem("token", res.data.data.token);
      toast.success('Login successful!', { 
         position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
       });
      navigate('/Homepage')
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.error || 'Something went wrong', {
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
  } finally {
    setLoading(false);
  }
};


  //  const LoginSubmit = async (data: iLoginInfo) => {
  //   console.log('Login user info:', data)

  // }
  
  
  const code = Math.floor(10000 + Math.random() * 90000).toString(); 
   const handleCode = async () => {
  setSentCode(code);
  setCodeSent(true);
  setLoading(true);
  try {
    await emailjs.send(
      'service_l2gm8zq', 
      'template_idy1dcq', 
      {
        to_email: getValues('Email'), 
        code: code, 
      },
      'HNJz2Y8Qxdon-91G6'
    );
    toast.success('Code sent to your email!', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    startResendCountdown();
  } catch{
    toast.error('Failed to send code to email.', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
  } finally {
    setLoading(false);
  }
}

   const startResendCountdown = async () => {
  setResendDisabe(true);
  let seconds = 60;
  setResendCountDown(seconds);

  const timer = setInterval(() => {
    seconds -= 1;
    setResendCountDown(seconds);
    if(seconds <= 0) {
      clearInterval(timer)
      setResendDisabe(false);
    }
  }, 1000);
}
const resendCode = async () => {
  if(resendDisable) return; 
  await handleCode();
  toast.success('Code resent to your email!', {
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
  return (
     <div className="RegisterPageContainer">
      <div onClick={handleButtonClick} className="Welcome" title='Click' ref={WelcomeContainerRef}>
                <img src={Librarycafe}/>

          <div className="Clickup"  title='Welcome'>
            <i><FontAwesomeIcon icon={faAngleDoubleUp}/></i>
            <i><FontAwesomeIcon icon={faAngleDoubleUp}/></i>
          </div>
        
      </div>
          <div className="RegisterVideo">
          <video loop muted 
                  playsInline preload='auto' 
                  autoPlay>
            <source src={Libraryvideo} type='video/mp4'/>
          </video>
          </div>
          <div className="REgPage">
            <div className={`RegisterPage ${isRegisterActive ? "right-panel-active" : ""}`}>
              <div className="logo">
                <img src={Librarycafe}/>
              </div>
              <div className="FormCOntainer">

              <div className="form">
                
              <div className="Loginform formContainer">
                <form>
                  <div className="Username">
                    <label htmlFor='LUsername'>Username or Email<span className='hash'>*</span></label>
                      <input id='LUsername' type='text' placeholder="Email or Username"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)} />
                </div>
               
              <div className="Password">
                  <label htmlFor='LPassword'>Password<span className='hash'>*</span></label>
                    <div className="PasswordXeye">
                    <input id='LPassword' type={LshowPassword ? 'text' : 'password'}  placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)} />
                    <i onClick={()=>setLshowPassword(!LshowPassword)}><FontAwesomeIcon icon={LshowPassword ? faEyeSlash : faEye} /></i>
                    </div>
                </div>

                  <div className="forget">
                    <p>Forget your  <a href='/username-reset-page'>Username?</a></p>
                    <p>Forget your <a href='/password-reset-page'>Password?</a></p>
                  </div>
                <button onClick={handleLogin} >Login</button>
                  </form>
              </div>

              <div className="Registraform formContainer">
              <form onSubmit={handleSubmit(RegSubmit)}>

                <div className="Firstname">
                  <label htmlFor='Firstname'>First Name<span className='hash'>*</span></label>
                  <input id='Firstname' type='text' placeholder='Enter your Firstname' required 
                  {...register('Firstname')}/>
                  {errors.Firstname && 
                  <span className='Error'>{errors.Firstname.message}</span>}
                </div>

                  <div className="Lastname">
                  <label htmlFor='Lastname'>Last Name<span className='hash'>*</span></label>
                  <input id='Lastname' type='text' placeholder='Enter your last name' required 
                  {...register('Lastname')}/>
                  {errors.Lastname && 
                  <span className='Error'>{errors.Lastname.message}</span>}
                  </div>

                  <div className="Username">
                  <label htmlFor='Email'>Email<span className='hash'>*</span></label>
                  <input id='Email' type='email' placeholder='example@gmail.com' required 
                  {...register('Email')}/>
                  {errors.Email && 
                  <span className='Error'>{errors.Email.message}</span>}
                  </div>


                  <div className="Username">
                  <label htmlFor='Username'>Username<span className='hash'>*</span></label>
                  <input id='Username' type='text' placeholder='Enter your Username' 
                  {...register('Username')}/>
                  {errors.Username && 
                  <span className='Error'>{errors.Username.message}</span>}
                  </div>
    
                  <div className="Password">
                  <label htmlFor='Password'>Password<span className='hash'>*</span></label>
                    <div className="PasswordXeye">
                      <input id='Password' type={showPassword ? 'text' : 'password'} placeholder='Create Password' 
                      {...register('Password')}/>
                      {errors.Password && 
                      <span className='Error'>{errors.Password.message}</span>}
                      <i onClick={()=>setshowPassword(!showPassword)}><FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /></i>
                    </div>
                  </div>

                    <div className="Password">
                  <label htmlFor='ConfirmPassword'>Confirm Password<span className='hash'>*</span> </label>
                    <div className="PasswordXeye">
                      <input id='ConfirmPassword' type={showPassword ? 'text' : 'password'} placeholder='Confirm Password' 
                      {...register('ConfirmPassword')}/>
                      {errors.ConfirmPassword && 
                      <span className='Error'>{errors.ConfirmPassword.message}</span>}
                    </div>
                      <div className="Verification">
                        {!codeSent ? (
                        <button type='button' onClick={handleCode}>Send code</button>
                        ) : (
                          <div>
                            <label>
                              <p>Enter verification code</p>
                              <input type='text' placeholder='Enter code'
                              value={verificationCode}
                              onChange={e => setVerificationCode(e.target.value)}
                              maxLength={5}
                              />
                              <button onClick={resendCode} disabled={resendDisable}>{resendDisable ? `Resend in ${resendCountDown}s` : 'Resend code'}</button>
                            </label>
                          </div>
                        )}
              </div>
                    <div className="RegsterBtoon">
                      <button type='submit' >Register</button>
                    </div>
                  </div>
              </form>

              
            </div>
            </div>
{/* ${isRegisterActive ? "right-panel-active" : ""} */}
            <div className={`OverLayContainer ${isRegisterActive ? "right-panel-active" : ""}`}>
              <div className="Overlay">
                <div className="overlapPanel overlayLeft">
                  

                   <h1 className='tittle'>Start reading now, Chief</h1>
                  <p>You don't have an account yet? Join <span style={{color: 'rgb(219, 180, 80)', textTransform: 'uppercase'}}><i>Library cafe</i></span> to start your journey today.</p>
                  <button className='ghost'  onClick={handleRegisterClick} >Register</button>
                </div>
                <div className="overlapPanel overlayRight">
                 <h1 className='tittle'>Hello, Chief</h1>
                  <p>You have an accont already? Login to <span style={{color: 'rgb(219, 180, 80)', textTransform: 'uppercase'}}><i>Library cafe</i></span> to start reading.</p>
                  <button className='ghost' id='login' onClick={handleLoginClick}>Login</button>
                </div>
              </div>
            </div>
              </div>
            </div>
        </div>
              {loading &&(
              <Bookloading/>
              )}

        </div>
  )
}

export default RegisterPage