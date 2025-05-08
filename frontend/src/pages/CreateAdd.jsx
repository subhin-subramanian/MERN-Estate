import { Alert, Button, Checkbox, FileInput, Label, Radio, Textarea, TextInput } from 'flowbite-react'
import { useState } from 'react';
import { useSelector } from 'react-redux'
import house from '../assets/house.jpg'
import { useNavigate } from 'react-router-dom';

function CreateAdd() {
  const {currentUser} = useSelector(state=>state.user);
  const [formdata,setFormdata] = useState({type:'rent',rent:0,sellingPrice:0,furnished:false,parking:false});
  const [imageError,setImageError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [formError,setFormError] = useState(null);
  const navigate = useNavigate();

  // Function to store whether the property is for sale or rent
  const handlePropertyType= (event)=>{setFormdata({...formdata,type:event.target.value})}

  // Function to store property cost
  const handlePropertyCost = (event)=>{
    if(formdata.type==='rent'){
      setFormdata({...formdata,sellingPrice:0,rent:event.target.value});
    }else{
      setFormdata({...formdata,rent:0,sellingPrice:event.target.value});
    }
  }

  // Function to store formdata while entering
  const handleChange=(event)=>{setFormdata({...formdata,[event.target.id]:event.target.value})}
  
  // Function to store data from checkboxes clicking
  const handleCheckboxes =(event)=>{setFormdata({...formdata,[event.target.id]:event.target.checked})}
  
  // Function to handle image upload to backend and sotre the  url from backend to formdata
  const handleImageChange = async(event)=>{
    setImageError(null);
    const file = event.target.files[0];
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
            setFormdata({...formdata,coverImg:data.imageUrl});  
        }
    } catch (error) {
        setImageError('Upload failed' +error);
    }   
  }

  // Function to store submit an add request to database
  const handleSubmit = async(event)=>{
    const submitdata = {...formdata,userId:currentUser._id};
    event.preventDefault();
    setFormError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/adds/add-request`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(submitdata)
      });
      const data = await res.json();
      if(!res.ok){
        return setFormError(data.message);
      }
      setLoading(false);
      navigate('/',{state:{message:"Your request has been submitted successfully, Our agent will contact you soon"}});
    } catch (error) {
      setFormError(error.message);
      setLoading(false);
    }
  }  

  return (
    <>
    {currentUser ? 
    (
    <div className='px-2 mx-auto min-h-screen'>
      <h1 className='text-2xl font-bold text-center py-10 '>Create Your Add</h1>

      <form className='flex flex-col max-w-xl lg:max-w-5xl w-full mx-auto' onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-10 ">

          {/* Left Part */}
          <div className="flex flex-col w-md sm:w-xl gap-5">
            <Textarea placeholder='Type the address of the property here' id='address' required className='h-38' maxLength='300' onChange={handleChange}/>
            <Textarea placeholder='Write a description for your property here' id='description' required className='h-32' maxLength='300' onChange={handleChange}/>
            <div className="flex gap-7 items-center">
              <div className="flex gap-2">
                <Radio id='sale' name='type' value='sale' checked={formdata.type === 'sale'} onChange={handlePropertyType}/>
                <Label htmlFor='sale'>For Sale</Label>
              </div>
              <div className="flex gap-2">
                <Radio id='rent' name='type' value='rent' checked={formdata.type === 'rent'} onChange={handlePropertyType} />
                <Label htmlFor='rent'>For rent</Label>
              </div>
              <TextInput className='flex-1' type='number' placeholder='Monthly rent in Rs' required onChange={handlePropertyCost}/>
            </div>
            <div>
              <Label>Contact Phone Number</Label>
              <TextInput type='number' placeholder='Enter your contact phone no.' required onChange={handleChange}/>
            </div>
          </div>

          {/* Right Part */}
          <div className="flex flex-col w-md sm:w-xl gap-5">

            <div className="flex gap-2 sm:gap-4">
              <div className="items-center flex gap-2">
                <Checkbox onChange={handleCheckboxes} id='furnished' checked={formdata.furnished}/>
                <Label>Furnished</Label>
              </div>
              <div className="items-center flex gap-2">
                <Checkbox onChange={handleCheckboxes} id='parking' checked={formdata.parking}/>
                <Label>Parking</Label>
              </div>
              <div className="items-center flex gap-2 sm:ml-4">
                <TextInput type='number' id='bed' required onChange={handleChange}/>
                <Label>Bedrooms</Label>           
              </div>
              <div className="items-center flex gap-2">
                <TextInput type='number' id='bath' required onChange={handleChange}/>
                <Label>Bathrooms</Label>           
              </div>
            </div>

            <div className=" flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <Label htmlFor='image'>Upload an image of the property</Label>
                <FileInput type="file" id='image' accept='image/*' onChange={handleImageChange}/>          
              </div>
              {imageError && <Alert color='failure' py-3>{imageError }</Alert>}
              <img className='h-[300px] w-[500px] flex mx-auto' src={formdata.coverImg ? formdata.coverImg : house} alt="Picture" />
          </div>
          </div>

        </div>

        <Button type='submit' className='my-10 w-md flex mx-auto bg-amber-900 hover:bg-amber-900 hover:opacity-85'>{loading ? 'Loading...':'Submit Add request'}</Button>
      </form>
      {formError && <Alert color='failure' className='py-3'>{formError}</Alert>}
    </div>):(
      <h1 className='text-center p-25 font-bold text-red-500'>You have to sign-in to view this page</h1>)}
    </>
  )
}
export default CreateAdd
