import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Alert, Button, Checkbox, FileInput, Label, Radio, Textarea, TextInput } from 'flowbite-react'
import { useSelector } from 'react-redux'
import house from '../assets/house.jpg'
import { useNavigate } from 'react-router-dom';

function EditAd() { 
  const {adId} = useParams();
  const [formdata,setFormdata] = useState({});
  const {currentUser} = useSelector(state=>state.user)
  const [adError,setAdError] = useState(null);
  const [imageError,setImageError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [formError,setFormError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(()=>{
    const fetchAd = async()=>{
        setAdError(null);
        try {
        const res = await fetch(`/api/adds/getad/${adId}`);
        const data = await res.json();
        if(!res.ok){
            setAdError(data.message);
            return;
        }
        setFormdata(data);
        } catch (error) {
        setAdError(error.message);        
        }
    }
    fetchAd();
  },[adId]);

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
      // Uploading image to cloudinary
      const reader = new FileReader();
      reader.onloadend = async()=>{
        const base64String = reader.result;
        try {
            const res = await fetch('/api/upload',{
              method:'POST',
              headers: {'Content-Type':'application/json'},
              body:JSON.stringify({image:base64String})
            });
            const data = await res.json();
            if(!res.ok) return setImageError(data.message);
            if(data.imageUrl){
                setFormdata({...formdata,coverImg:data.imageUrl});  
            }
        } catch (error) {
            setImageError('Upload failed' +error);
        }   
      }
      if(file){
        reader.readAsDataURL(file);
      }
  }
  
  // Function to store submit an add request to database
  const handleSubmit = async(event)=>{
    event.preventDefault();
    setFormError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/adds/edit/${adId}`,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(formdata)
      });
      const data = await res.json();
      if(!res.ok){
        return setFormError(data.message);
      }
      setLoading(false);
      navigate('/',{state:{message:"Ad edited"}});
    } catch (error) {
      setFormError(error.message);
      setLoading(false);
    }
  }

  return (
    <div>
    {currentUser.isAdmin ? 
    (
    <>
    {adError ? <Alert color='failure' className='flex justify-center items-center'>{adError}</Alert>:
    <div className='px-2 mx-auto min-h-screen'>
      <h1 className='text-2xl font-bold text-center py-10 '>Edit Add</h1>

      <form className='flex flex-col max-w-xl lg:max-w-5xl w-full mx-auto' onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-10 ">

          {/* Left Part */}
          <div className="flex flex-col w-md sm:w-xl gap-5 mt-2">
            <TextInput placeholder='userId' required id='userId' defaultValue={formdata.userId} onChange={handleChange}/>
            <Textarea placeholder='Type the address of the property here' id='address' required className='h-44' maxLength='300' defaultValue={formdata.address} onChange={handleChange}/>
            <Textarea placeholder='Write a description for your property here' id='description' required className='h-38' maxLength='300' defaultValue={formdata.description} onChange={handleChange}/>
            <div>
              <Label>Contact Phone Number</Label>
              <TextInput type='number' placeholder='Enter your contact phone no.' id='phone' defaultValue={formdata.phone} required onChange={handleChange}/>
            </div>
          </div>

          {/* Right Part */}
          <div className="flex flex-col w-md sm:w-xl gap-5">

            <div className="flex gap-7 items-center">
                <div className="flex gap-2">
                  <Radio id='sale' name='type' value='sale' checked={formdata.type === 'sale'} onChange={handlePropertyType}/>
                  <Label htmlFor='sale'>For Sale</Label>
                </div>
                <div className="flex gap-2">
                  <Radio id='rent' name='type' value='rent' checked={formdata.type === 'rent'} onChange={handlePropertyType} />
                  <Label htmlFor='rent'>For rent</Label>
                </div>
                <TextInput className='flex-1' type='number' placeholder={formdata.type === 'sale' ? "Selling Price in Rs" : 'Monthly rent in Rs'} required defaultValue={formdata.type === 'sale'? formdata.sellingPrice : formdata.rent} onChange={handlePropertyCost}/>
              </div>

            <div className="flex gap-2 sm:gap-4">
              <div className="items-center flex gap-2">
                <Checkbox onChange={handleCheckboxes} id='furnished' checked={!!formdata.furnished}/>
                <Label>Furnished</Label>
              </div>
              <div className="items-center flex gap-2">
                <Checkbox onChange={handleCheckboxes} id='parking' checked={!!formdata.parking}/>
                <Label>Parking</Label>
              </div>
              <div className="items-center flex gap-2 sm:ml-4">
                <TextInput type='number' id='bed' required defaultValue={formdata.bed} onChange={handleChange}/>
                <Label>Bedrooms</Label>           
              </div>
              <div className="items-center flex gap-2">
                <TextInput type='number' id='bath' required defaultValue={formdata.bath} onChange={handleChange}/>
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

        <Button type='submit' className='my-10 w-md flex mx-auto bg-amber-900 hover:bg-amber-900 hover:opacity-85'>{loading ? 'Loading...':'Update'}</Button>
      </form>
      {formError && <Alert color='failure' className='py-3'>{formError}</Alert>}
    </div>}</>):(
      <h1 className='text-center p-25 font-bold text-red-500'>Only admins can view this page</h1>)}
  </div>
  )
}
export default EditAd


