import { Alert, Button, Checkbox, Label, Radio, Spinner, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import AdCard from '../components/AdCard';

function Search() {
  const [sidebarData,setSidebarData] = useState({sort:'desc',type:'rent',rent:15000,furnished:false,parking:false,bed:1,bath:1});
  const navigate = useNavigate();
  const [adsError,setAdsError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [showMore,setShowMore] = useState(false);
  const [ads,setAds] = useState([]);

  // Function to store whether the property is for sale or rent
  const handlePropertyType= (event)=>{setSidebarData({...sidebarData,type:event.target.value})}

  // Function to store property cost
  const handlePropertyCost = (event)=>{
    if(sidebarData.type==='rent'){
      setSidebarData({...sidebarData,sellingPrice:0,rent:event.target.value});
    }else{
      setSidebarData({...sidebarData,rent:0,sellingPrice:event.target.value});
    }
  }

  // Function to store formdata while entering
  const handleChange=(event)=>{setSidebarData({...sidebarData,[event.target.id]:event.target.value})}

  // Function to store data from checkboxes clicking
  const handleCheckboxes =(event)=>{setSidebarData({...sidebarData,[event.target.id]:event.target.checked})}

  // Function to handle submit
  const handleSubmit = async(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    sidebarData.searchTerm ? urlParams.set('searchTerm',sidebarData.searchTerm) : urlParams.delete('searchTerm');
    urlParams.set('sort',sidebarData.sort);
    urlParams.set('type',sidebarData.type);
    if (sidebarData.type === 'rent') {
      urlParams.delete('sellingPrice'); 
      urlParams.set('rent', sidebarData.rent);
    } else {
      urlParams.delete('rent'); 
      urlParams.set('sellingPrice', sidebarData.sellingPrice);
    }
    sidebarData.furnished && urlParams.set('furnished',sidebarData.furnished);
    sidebarData.parking && urlParams.set('parking',sidebarData.parking);
    urlParams.set('bed',sidebarData.bed);
    urlParams.set('bath',sidebarData.bath);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  // Useeffect to fetch ads
  useEffect(()=>{
    const fetchAds = async()=>{
      const urlParams = new URLSearchParams(location.search);
      const searchQuery = urlParams.toString();
      setLoading(true);
      setAdsError(null);
      try {
        const res = await fetch(`/api/adds/getads?${searchQuery}`);
        const data = await res.json();
        if(!res.ok){
          setAdsError(data.message);
          setLoading(false);
          return;
        } 
        if(data.ads.length === 9){   
          setShowMore(true);
        }else setShowMore(false);
        setAds(data.ads);
        setLoading(false);
      } catch (error) {
        setAdsError(error.message);   
        setLoading(false);     
      }
    }
    fetchAds();
  },[location.search]);

  // Function to fetch more posts onclicking show more 
  const handleShowMore = async()=>{
    try {
      const res = await fetch(`/api/adds/getads?startIndex=8&limit=8`);
      const data = await res.json();
      if(!res.ok){
        setAdsError(data.message);
        return;
      }
      if(data.ads.length === 9){   
        setShowMore(true);
      }else{
        setShowMore(false);
      }
      setAds(prev=>([...prev,...data.ads]));
      setAdsError(null);
    } catch (error) {
      setAdsError(error.message);        
    }
  }

  return (
    <div className='flex flex-col md:flex-row'>

      {/* Sidebar */}
      <div className="min-h-screen px-5 sm:w-72 sm:border-r-1 shadow-lg w-full">

       <TextInput type='text' id='searchTerm' placeholder='Enter keyword to search' onChange={handleChange} className='my-8' defaultValue={sidebarData.searchTerm && sidebarData.searchTerm}/>

       <form onSubmit={handleSubmit}>
        <div className="flex flex-col mt-2">
            <div className="flex gap-3">
              <Radio id='sale' name='type' value='sale' checked={sidebarData.type === 'sale'} onChange={handlePropertyType}/>
              <Label htmlFor='sale'>For Sale</Label>
              <Radio id='rent' name='type' value='rent' checked={sidebarData.type === 'rent'} onChange={handlePropertyType} />
              <Label htmlFor='rent'>For rent</Label>
            </div>
          <Label className='mt-8 mb-1'>Enter your max budget for</Label>
          <TextInput className='flex-1' type='number' placeholder={sidebarData.type  === 'sale' ? "Selling Price in Rs" : 'Monthly rent in Rs'} defaultValue={sidebarData.type  === 'sale' ? (sidebarData.sellingPrice && sidebarData.sellingPrice):(sidebarData.rent && sidebarData.rent)} required onChange={handlePropertyCost}/>
        </div>

         <div className="flex flex-col mt-8 gap-8">
            <div className="items-center flex gap-2">
              <Checkbox onChange={handleCheckboxes} id='furnished' checked={sidebarData.furnished}/>
              <Label>Furnished</Label>
            </div>
            <div className="items-center flex gap-2">
              <Checkbox onChange={handleCheckboxes} id='parking' checked={sidebarData.parking}/>
              <Label>Parking</Label>
            </div>
            <div className="items-center flex gap-2">
              <TextInput type='number' id='bed' required defaultValue={sidebarData.bed && sidebarData.bed} onChange={handleChange} />
              <Label>Bedrooms</Label>           
            </div>
            <div className="items-center flex gap-2">
              <TextInput type='number' id='bath' defaultValue={sidebarData.bath && sidebarData.bath} required onChange={handleChange}/>
              <Label>Bathrooms</Label>           
            </div>
         </div>
         <Button className='mt-8 w-52 bg-gradient-to-r from-amber-600 to-amber-400 hover:opacity-85 border-none shadow-lg' type='submit'>Apply Filters</Button>
        </form>
      </div>

      {/* Ad results */}
      <div className="">
        {adsError && <Alert className='flex items-center justify-center'>{adsError}</Alert>}
        
        <h1 className='text-xl font-semibold m-5'>Search Results:</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2  gap-10 mx-15 sm:mx-30 my-20">
        {loading && <Spinner className='flex items-center justify-center' size='lg'/>}
          {ads.map((ad)=>(
            <AdCard key={ad._id} ad={ad}/>
          ))}
        </div>
        {showMore && (
          <span className='font-semibold text-center p-3 hover:underline' onClick={handleShowMore}>Show More</span>
        )}
      </div>

    </div>
  )
}

export default Search
