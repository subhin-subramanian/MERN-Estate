import { useEffect, useState } from 'react';
import bg from '../assets/bg.jpg';
import { Alert, Spinner } from 'flowbite-react';
import AdCard from '../components/AdCard';


function Home() {
  const [ads,setAds] = useState([]);
  const [type,setType] = useState('rent');
  const [adsError,setAdsError] = useState(null);
  const [loading,setLoading] = useState(false);
  const [showMore,setShowMore] = useState(false);
  
  useEffect(()=>{
    const fetchAds = async()=>{
      setAdsError(null);
      try {
        const res = await fetch(`/api/adds/getads?limit=9&type=${type}`);
        const data = await res.json();
        if(!res.ok){
          setAdsError(data.message);
          return;
        } 
        if(data.ads.length === 9){   
          setShowMore(true);
        }else setShowMore(false);
        setAds(data.ads);
      } catch (error) {
        setAdsError(error.message);        
      }
    }
    fetchAds();
  },[type])

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
    <div className="mb-10">
      {/* Home Wallpaper */}
      <div className="relative w-full h-[80vh]">
        <img src={bg} alt="coverImage" className='w-full h-full object-cover'/>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        <h1 className='absolute inset-0 flex items-center justify-center text-white font-bold text-xl font-serif tracking-wider'><i>"NB: This is a demo site. But you can signup and check out the features of my app. For works go to subhinms.com"</i></h1>
      </div>
      {/* Ad cards section */}

      <div className="flex items-center justify-center py-5 gap-10">
        <button onClick={()=>setType('rent')} className={`font-bold px-4 py-1 rounded-4xl ${type==='rent' ? "bg-amber-950 text-white" :"bg-white text-amber-950"}`}>For Rent</button>
        <button onClick={()=>setType('sale')} className={`font-bold px-4 py-1 rounded-4xl ${type==='sale' ? "bg-amber-950 text-white" :"bg-white text-amber-950"}`}>For Sale</button> 
      </div>

      {adsError && <Alert className='flex justify-center items-center' color='failure'>{adsError}</Alert>}
      {loading && <Spinner className='flex justify-center items-center' size='lg'/>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center gap-6">
        {ads.map(ad=>(<AdCard key={ad._id} ad={ad}/>))}
      </div>

      {showMore && <button onClick={handleShowMore} className="hover:underline flex mx-auto py-3 font-semibold cursor-pointer">Show More</button>}

    </div>
  )
}
export default Home
