// import './RegisterPage.css'
// import { useEffect, useRef } from "react";
// import { gsap } from "gsap";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faAngleDoubleUp, faEye } from "@fortawesome/free-solid-svg-icons"
// import Librarycafe from '../../assets/Librarycafe.png'
// import Libraryvideo from '../../assets/Libraryvideo2.mp4'
// import { useForm } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup'
// import * as yup from 'yup'
// import { useState } from 'react'
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// const schema = yup.object().shape({
//   firstname: yup.string().required('First name is required'),
//   middlename: yup.string(),
//   lastname: yup.string().required('Last name is required'),
//   username: yup.string().required('username is required'),
//   email: yup.string().required('Email is required').email('Invalid email format'),
//   phoneNumber: yup
//     .string()
//     .required('Phone number is required')
//     .matches(/^\+?[0-9]{10,15}$/, 'Invalid phone number format'),
//   password: yup
//     .string()
//     .required('Password is required')
//     .min(8, 'Password must be at least 8 characters')
//     .max(16, 'Password must not exceed 16 characters'),
//     // .matches(
//     //   /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
//     //   'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
//     // ),
//   ConfirmPassword: yup
//     .string()
//     .required('Please confirm your password')
//     .oneOf([yup.ref('password')], 'Passwords must match'),
//   address: yup.string().required('Address is required'),
//   country: yup.string().required('select a country'),
//   state: yup.string().required('select a state'),
//   city: yup.string().required('select a city'),
//   postCode: yup.string().required('Postal code is required').min(4, 'Postal code must be at least 4 characters').max(8),
// });

// const RegisterPage = () => {
//     const [isRegisterActive, setIsRegisterActive] = useState<boolean>(false);
//     const [isOverlayvisible, setIsOverlayvisible] = useState<boolean>(true);
//     const WelcomeContainerRef = useRef<HTMLDivElement>(null);
//     const loginFormRef = useRef<HTMLDivElement>(null);
//     const handleLoginClick = () => setIsRegisterActive(false);
//     const handleRegisterClick = () => setIsRegisterActive(true);

// const handleButtonClick = () => {
//     // Animate red container UP with elastic ease
//     gsap.to(WelcomeContainerRef.current, {
//       y: "-100%",
//       ease: "bounce.out", 
//       duration: 3.5,
//       onComplete: () => setIsOverlayvisible(false)
//     });

//     // // Animate login form UP with smooth ease
//     // gsap.to(loginFormRef.current, {
//     //   y: "-100%",
//     //   ease: "power3.out", // Smooth ease
//     //   duration: 1,
//     // });
//   };

//   useEffect(() => {
//     document.body.style.overflow = isOverlayvisible ? 'hidden' : 'auto';

//     return () => {
//       document.body.style.overflow = 'auto'
//     }
//   }, [isOverlayvisible])
//   return (
//      <div className="RegisterPageContainer">
//       <div onClick={handleButtonClick} className="Welcome" ref={WelcomeContainerRef}>
//                 <img src={Librarycafe}/>

//           <div className="Clickup"  title='Welcome'>
//             <i><FontAwesomeIcon icon={faAngleDoubleUp}/></i>
//             <i><FontAwesomeIcon icon={faAngleDoubleUp}/></i>
//           </div>
        
//       </div>
//           <div className="RegisterVideo">
//           <video loop muted 
//                   playsInline preload='auto' 
//                   autoPlay>
//             <source src={Libraryvideo} type='video/mp4'/>
//           </video>
//           </div>
//           <div className="REgPage">
//             <div className={`RegisterPage ${isRegisterActive ? "right-panel-active" : ""}`}>
//               <div className="logo">
//                 <img src={Librarycafe}/>
//               </div>
              
//               <div className="FormCOntainer">

//               <div className="form">
                
//               <div className="Loginform formContainer">
//                 <form>
//                   <div className="Username">
//                     <label htmlFor='username'>Username</label>
//                       <input id='username' type='text' placeholder='Enter your username' />
//                 </div>
               
//               <div className="password">
//                   <label htmlFor='password'>Password</label>
//                     <div className="passwordXeye">
//                     <input id='password' type='password' placeholder='Enter your password' />
//                     <span><FontAwesomeIcon icon={faEye} /></span>
//                     </div>
//                 </div>
//                   <div className="forget">
//                     <p>Forget your  <a href='#'>username?</a></p>
//                     <p>Forget your <a href='#'>password?</a></p>
//                   </div>
//                 <button>Login</button>
//                   </form>
//               </div>

//               <div className="Registraform formContainer">
//               <form>

//                 <div className="Firstname">
//                   <label htmlFor='firstname'>First Name*</label>
//                   <input id='firstname' type='text' placeholder='Enter your firstname' />
//                   </div>

//                   <div className="Middlename">
//                   <label htmlFor='Middlename'>Middle Name</label>
//                   <input id='Middlename' type='text' placeholder='Enter your middle name' />
//                   </div>

//                   <div className="Lastname">
//                   <label htmlFor='Lastname'>Last Name</label>
//                   <input id='Lastname' type='text' placeholder='Enter your last name' />
//                   </div>

//                   <div className="Username">
//                   <label htmlFor='username'>Username</label>
//                   <input id='username' type='text' placeholder='Enter your username' />
//                   </div>


//                   <div className="Username">
//                   <label htmlFor='username'>Username</label>
//                   <input id='username' type='text' placeholder='Enter your username' />
//                   </div>

//                   <div className="Username">
//                   <label htmlFor='username'>Username</label>
//                   <input id='username' type='text' placeholder='Enter your username' />
//                   </div>
    
//                   <div className="password">
//                   <label htmlFor='password'>Password</label>
//                     <div className="passwordXeye">
//                       <input id='password' type='text' placeholder='Enter your password' />
    
//                       <span><FontAwesomeIcon icon={faEye} /></span>
//                     </div>

//                     <div className="RegsterBtoon">
//                       <button >Register</button>
//                     </div>
//                   </div>
//               </form>
//             </div>
//             </div>
// {/* ${isRegisterActive ? "right-panel-active" : ""} */}
//             <div className={`OverLayContainer ${isRegisterActive ? "right-panel-active" : ""}`}>
//               <div className="Overlay">
//                 <div className="overlapPanel overlayLeft">
                  

//                    <h1 className='tittle'>Start reading now, Chef</h1>
//                   <p>You don't have an account yet? Join <span style={{color: 'rgb(219, 180, 80)', textTransform: 'uppercase'}}><i>Library cafe</i></span> to start your journey today.</p>
//                   <button className='ghost'  onClick={handleRegisterClick} >Register</button>
//                 </div>
//                 <div className="overlapPanel overlayRight">
//                  <h1 className='tittle'>Hello, Chef</h1>
//                   <p>You have an accont already? Login to <span style={{color: 'rgb(219, 180, 80)', textTransform: 'uppercase'}}><i>Library cafe</i></span> to start reading.</p>
//                   <button className='ghost' id='login' onClick={handleLoginClick}>Login</button>
//                 </div>
//               </div>
//             </div>
//               </div>
//             </div>
//         </div>
//         </div>
//   )
// }

// export default RegisterPage