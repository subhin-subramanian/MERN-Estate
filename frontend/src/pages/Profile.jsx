
import { Alert, Button, Modal, ModalBody, ModalHeader, Spinner, TextInput } from 'flowbite-react';
import { useRef, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutFailure, signOutStart, signOutSuccess, updateFailure, updateStart, updateSuccess } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

function Profile() {
    const {currentUser,error,loading} = useSelector(state=>state.user);
    const [formdata,setFormdata] = useState({username:currentUser.username,email:currentUser.email,phone:currentUser.phone,profilePic:currentUser.profilePic});
    const [imageError,setImageError] = useState(null);
    const fileRef = useRef();
    const [updateStatus,setUpdateStatus] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showModal,setShowModal] = useState(false);

    // Function to store formdata
    const handleChange = (e)=>{
        setFormdata({...formdata,[e.target.id]:e.target.value});
    }

    // Function to handle image upload functionality
    const handleImageChange = async(e)=>{
        setImageError(null);
        const file = e.target.files[0];
        if(!file) return;
        if(file.size > (2*1024*1024)){
            return setImageError("Image size must be less than 2mb");
        }
        // Uploading image to backend
        const imageFile = new FormData();
        imageFile.append('image',file);
        try {
            const res = await fetch('/api/upload',{method:'POST',body:imageFile});
            const data = await res.json();
            if(data.imageUrl){
                setFormdata({...formdata,profilePic:data.imageUrl});
            }
        } catch (error) {
            setImageError('Upload failed' +error);
        }
    }

    // Function to handle the submission of the form
    const handleSubmit=async(e)=>{
        e.preventDefault();
        dispatch(updateStart());
        setUpdateStatus(null);
        if(formdata.password.length < 7){
          setUpdateStatus('Password must be greater than 6 letters')
        }
        try {
            const res = await fetch(`api/user/update/${currentUser._id}`,{
              method:'PUT',
              headers:{'Content-Type':'application/json'},
              body:JSON.stringify(formdata)
          });
            const data = await res.json();
            if(!res.ok){
              return dispatch(updateFailure(data));
            }
            setUpdateStatus('Profile updated successfully');
            dispatch(updateSuccess(data));
            setTimeout(() => {setUpdateStatus(null)}, 5000);
        } catch (error) {
            dispatch(updateFailure(error.message));
        }
    }

    // Function to handle signing out from an account
    const handleSignOut = async()=>{
      dispatch(signOutStart());
      try {
        const res = await fetch('api/user/sign-out',{method:'POST'});
        const data = await res.json();
        if(!res.ok){
          return dispatch(signOutFailure(data));
        }
        dispatch(signOutSuccess(data));      
        navigate('/');
      } catch (error) {
        dispatch(signOutFailure(error)); 
      }
    }

    // Function to handle deleting of an account
    const handleDelete = async()=>{
      setShowModal(false);
      dispatch(deleteUserStart());
      try {
        const res = await fetch(`api/user/delete/${currentUser._id}`,{method:'DELETE'});
        const data = await res.json();
        if(!res.ok){
          dispatch(deleteUserFailure(data));
          return;
        }
        dispatch(deleteUserSuccess(data));
        navigate('/');
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }

  return (
    <>
    <div className='py-10 mx-auto max-w-sm w-full'>

      <h1 className='text-3xl font-semibold font-serif tracking-wider text-center'>Profile</h1>

      <form className='flex flex-col gap-5' onSubmit={handleSubmit}>

        <input type='file' accept='image/*' ref={fileRef} hidden onChange={handleImageChange}/>
        <div className="w-32 h-32 rounded-full mt-5 self-center shadow-md">
          <img src={formdata.profilePic} alt="User" className='w-full h-full rounded-full border-3' id='profilePic' />
        </div>  

        {updateStatus && <Alert color='success' className='mt-5'>{updateStatus}</Alert>}
        {error && <Alert color='failure' className='mt-5'>{error.message}</Alert>}

        <Button className='w-40 mx-auto bg-gradient-to-r from-amber-800 to-amber-300 hover:opacity-85' onClick={()=>fileRef.current.click()}>Change Image</Button>
        <TextInput type='text' defaultValue={formdata.username} placeholder='username' id='username' required onChange={handleChange}/>
        <TextInput type='email' defaultValue={formdata.email} placeholder='email' id='email' required onChange={handleChange} />
        <TextInput type='number' defaultValue={formdata.phone} placeholder='number' id='number' required onChange={handleChange}/>
        <TextInput type='password' placeholder='password' id='password' required onChange={handleChange}/>
        <Button className='bg-gradient-to-r from-amber-300 to-amber-800 hover:opacity-85' type='submit'>
          {loading ? <><Spinner size='sm'/><span>Loading...</span></> : 'Update'}</Button>
          
      </form>

      <div className="text-red-600 flex justify-center gap-55 mt-2 text-sm font-semibold dark:text-red-300">
        <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account?</span>
        <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
      </div>

    </div>
    
    {/* Modal for deleting user */}
  <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
  <ModalHeader >
    <ModalBody className='text-amber-950'>
      <div className="text-center">
        <HiOutlineExclamationCircle className="h-14 w-14 mb-4 mx-auto"/>
        <h3 className="mb-5 text-lg ">Are you sure you want to delete the account?</h3>
        <div className="flex justify-center gap-5">
          <Button color='alternative' className='hover:text-amber-950 hover:opacity-80' onClick={handleDelete}>Yes I'm sure</Button>
          <Button className='bg-amber-600 hover:bg-amber-600 hover:opacity-80' onClick={()=>setShowModal(false)}>No I'm not</Button>
        </div>
      </div>
    </ModalBody>
    </ModalHeader>
  </Modal>

  </>
  )
}
export default Profile
