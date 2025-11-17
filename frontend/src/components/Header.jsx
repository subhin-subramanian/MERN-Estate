import { Alert, Avatar, Button, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Label, Modal, ModalBody, ModalHeader, Spinner, TextInput} from 'flowbite-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BiSearchAlt2 } from "react-icons/bi";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure, signInStart, signInSuccess, signOutFailure, signOutStart, signOutSuccess } from '../redux/userSlice';
import { FaMoon, FaSun } from 'react-icons/fa';
import { toggleTheme } from '../redux/themeSlice';
import { GoogleLogin } from '@react-oauth/google';

function Header() {

  const [showSignup,setShowSignup] = useState(false);
  const [showSignin,setShowSignin] = useState(false);
  const [signinData,setSigninData] = useState({});
  const [signupData,setSignupData] = useState({});
  const [signupError,setsignupError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [authStat,setAuthStat] = useState(null);
  const dispatch = useDispatch();
  const {theme} = useSelector(state=>state.theme);
  const {currentUser,loading:signinLoading,error:signinError} = useSelector(state=>state.user);
  const location = useLocation();
  const [searchTerm,setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Useeffect to show success alert on signout and delete account from profile page
  useEffect(()=>{
    if(location.state?.message){
      setAuthStat(location.state.message);
      setTimeout(() => {setAuthStat(null)}, 5000);
    }
  },[location.state])
  
  // Data storage for sign-up form
  const handleSignupChange = (e)=>{
    setSignupData({...signupData,[e.target.id]:e.target.value.trim()});
  }

  // Data storage for sign-in form
  const handleSigninChange = (e)=>{
    setSigninData({...signinData,[e.target.id]:e.target.value.trim()});
  }
  
  // Function to handle signing up
  const handleSignup = async(e)=>{
    e.preventDefault();
    setsignupError(null);
    setLoading(true);
    if(signupData.phone.length <10){
      setsignupError('Please enter a valid phone no.')
    }
    try {
      const res = await fetch('/api/user/sign-up',{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify(signupData)
      });
      const data = await res.json();
      if(data.success === false){
        setsignupError(data.message);
        return;
      }
      setLoading(false)
      setShowSignup(false);
      setAuthStat('Signup Successfull, now sign-in with your details');
      setTimeout(() => {
        setAuthStat(null);
      }, 5000);
    } catch (error) {
      setsignupError(error.message);
      setLoading(false);
    }
  }

  // Function for google Sign-Up
  const handleGoogleSignup = async(credentialResponse)=>{
    setsignupError(null);
    setLoading(true);
    if(!signupData.password || signupData.password==='' || !signupData.phone || signupData.phone===''){
      return setsignupError("You should enter the password and phone, even if signingup with google-account");
    }
    if(signupData.phone.length <10){
      return setsignupError('Please enter a valid phone no.')
    }
    try {
      const res = await fetch('/api/user/google/sign-up',{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({token:credentialResponse.credential,signupData})
      });
      const data = await res.json();
      if(!res.ok){
        setsignupError(data.message);
        return;
      }
      setLoading(false)
      setShowSignup(false);
      setAuthStat('Signup Successfull, now sign-in with your details');
      setTimeout(() => {
        setAuthStat(null);
      }, 5000);
    } catch (error) {
      setsignupError(error.message);
      setLoading(false);
    }
  }

  // Function to handle signing in
  const handleSignin = async(e)=>{
    e.preventDefault();
    dispatch(signInStart());
    try {
      const res = await fetch('/api/user/sign-in',{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify(signinData)
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data.rest));
      setShowSignin(false);
      setAuthStat('Successfully signed in');
      setTimeout(() => {
        setAuthStat(null);
      }, 5000);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  // Function to handle google sign in 
  const handleGoogleSignin = async(credentialResponse)=>{
    if(!signinData.password){
      return dispatch(signInFailure('Password is required'));
    }
    dispatch(signInStart());
    try {
      const res = await fetch('/api/user/google/sign-in',{
        method: "POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({token:credentialResponse.credential,password:signinData.password})
      });
      const data = await res.json();
      if(!res.ok){
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data.rest));
      setShowSignin(false);
      setAuthStat('Successfully signed in');
      setTimeout(() => {
        setAuthStat(null);
      }, 5000);
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  // Function to handle signing out from an account
  const handleSignOut = async()=>{
    dispatch(signOutStart());
    try {
      const res = await fetch('/api/user/sign-out',{method:'POST'});
      const data = await res.json();
      if(!res.ok){
        return dispatch(signOutFailure(data));
      }
      dispatch(signOutSuccess(data));
      setAuthStat("You're signed out");
      setTimeout(() => {
        setAuthStat(null);
      }, 5000);      
    } catch (error) {
      dispatch(signOutFailure(error)); 
    }
  }

  // Useeffect to get the searchterm
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get('searchTerm');
    setSearchTerm(searchTermUrl);
  },[location.search]);

  // Function to handle search submit
  const handleSearchSubmit = async(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm',searchTerm);
    const queryUrl = urlParams.toString();
    navigate(`/search?${queryUrl}`)
  }

  return (
    <>
    <div className=' items-center px-2 sm:px-10 flex flex-wrap gap-3 sm:justify-between py-3  text-amber-800 shadow-sm dark:shadow-2xl'>

      <Link to={'/'}>
        <span className='text-xl sm:text-3xl font-bold flex gap-2 bg-amber-950 text-white whitespace-nowrap font-serif p-2 items-center rounded-full shadow-md'><span className='bg-white text-black rounded-full p-2'>1</span>Cent<span className='font-semibold'><i>Property</i></span></span>
      </Link>

      <form className='mt-5 mx-auto order-2 md:mt-0 md:order-0 flex relative w-full md:max-w-96 max-w-4xl shadow-lg' onSubmit={handleSearchSubmit}>
        <input
        type="text"
        id="search"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 dark:bg-gray-200 p-2.5 text-sm text-gray-900 "
        defaultValue={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        placeholder="Search here..." />
        <button type='submit'>
         <BiSearchAlt2 className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500  cursor-pointer'/>     
        </button>
      </form>

      <div className="flex gap-2 items-center">
        {currentUser ? 
          <Dropdown arrowIcon={false} inline label={<Avatar alt='user' img={currentUser.  profilePic} rounded/>} className='border-amber-600'>
            <DropdownHeader><span>{currentUser.username}</span></DropdownHeader>
            <DropdownDivider className='bg-gray-300'/>
            <Link to={'/profile'}>
              <DropdownItem className='font-semibold'>Profile</DropdownItem>
            </Link>
            <DropdownItem className='font-semibold' onClick={handleSignOut}>Sign Out</DropdownItem>
          </Dropdown>
          : <Button className='dark:text-white' outline onClick={()=>setShowSignin(true)}>Sign In</Button>}

        <Link to={'/create-add'}>
          <Button className='bg-gradient-to-r from-amber-600 to-amber-400 hover:opacity-85 border-none shadow-lg' >Create Your Add</Button>
        </Link>
        
        <button className="w-10 h-10 p-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-400  text-white flex items-center justify-center  hover:opacity-85 border-none dark:bg-amber-600 shadow-lg" onClick={()=>dispatch(toggleTheme())}>
          {theme === 'light'? <FaMoon/> : <FaSun/>}
        </button>

      </div>
    </div>

    {/* Modal for sign-up popup */}

    <Modal show={showSignup} onClose={()=>setShowSignup(false)} popup size='md' >
      <ModalHeader className='border-none'/>
      <ModalBody className='text-amber-950 py-0 flex flex-col gap-3'>
        <h1 className='text-center text-2xl font-semibold'>Create an Account</h1>
        <div className="">
          <Label className='ml-0.5'>Username</Label>
          <TextInput placeholder='Username' type='text' id='username' required onChange={handleSignupChange}/>
        </div>
        <div className="">
          <Label className='ml-0.5'>E-mail</Label>
          <TextInput placeholder='Enter your e-mail' type='text' id='email' required onChange={handleSignupChange}/>
        </div>
        <div className="">
          <Label className='ml-0.5'>Phone/Mobile</Label>
          <TextInput placeholder='Phone/mobile no.' type='number' id='phone' required onChange={handleSignupChange}/>
        </div>
        <div className=" mb-3">
          <Label className='ml-0.5'>Password</Label>
          <TextInput placeholder='********' type='password' id='password' required onChange={handleSignupChange}/>
        </div>
        <Button className='bg-amber-950 hover:bg-amber-950 hover:opacity-90' onClick={handleSignup}disabled={loading}>
          {loading ? 
          <>
           <Spinner size='sm'/>
           <span>Loading...</span>
          </>:'Sign Up'}
        </Button>

        <GoogleLogin   text="signup_with" onSuccess={handleGoogleSignup} onError={() => {
              console.log("Google Login Failed")
              setsignupError("Something went wrong on google login")}} /> 
        
        <div className="flex pt-0 gap-2 py-5 items-center">
          <span className='text-sm font-semibold'>Already have an account.</span>
          <span className='text-blue-700 cursor-pointer font-semibold hover:underline' onClick={()=>{setShowSignup(false);setShowSignin(true)}}>SignIn</span>
        </div>
        {signupError && <Alert className='py-3' color='failure'>{signupError}</Alert>}
      </ModalBody>
    </Modal>

    {/* Modal for sign-in popup */}

    <Modal show={showSignin} onClose={()=>setShowSignin(false)} popup size='md' >
      <ModalHeader className='border-none'/>
      <ModalBody className='text-amber-950 py-0 flex flex-col gap-3'>
        <h1 className='text-center text-2xl font-semibold'>Sign In to Your Account</h1>
        <div className="">
          <Label className='ml-0.5'>username</Label>
          <TextInput placeholder='Username' type='text' id='username' required onChange={handleSigninChange}/>
        </div>  
        <div className=" mb-3">
          <Label className='ml-0.5'>Password</Label>
          <TextInput placeholder='********' type='password' id='password' required onChange={handleSigninChange}/>
        </div>
        
        <Button className='bg-amber-950 hover:bg-amber-950 hover:opacity-90' onClick={handleSignin}  disabled={signinLoading}>
          {signinLoading ? 
          <>
           <Spinner size='sm'/>
           <span>Loading...</span>
          </>:'Sign In'}
        </Button>

        <GoogleLogin onSuccess={handleGoogleSignin} onError={() => {
              console.log("Google Login Failed")
              dispatch(signInFailure('Google Sign-in Failed'));}} /> 

        <div className="flex pt-0 gap-2 py-5 items-center">
          <span className='text-sm font-semibold'>Don't have an account.</span>
          <span className='text-blue-700 cursor-pointer font-semibold hover:underline' onClick={()=>{setShowSignup(true);setShowSignin(false)}}>Create-Account</span>
        </div>
        {signinError && <Alert className='py-3' color='failure'>{signinError.message}</Alert>}
      </ModalBody>
    </Modal>

    {/* Authentication status */}
    {authStat && <Alert className='fixed top-25 right-25 z-50 shadow-lg' color='success'>{authStat}</Alert>}
    </>
  )
}

export default Header
