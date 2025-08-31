import { useEffect, useState } from 'react';
import { Alert, Spinner } from 'flowbite-react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt,FaBath, FaPhone } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { TbParkingCircle } from "react-icons/tb";
import { BsSignNoParking } from "react-icons/bs";
import { RiArmchairLine } from "react-icons/ri";
import { TbArmchair2Off } from "react-icons/tb";

function Ad() {
    const [ad,setAd] = useState([]);
    const [adError,setAdError] = useState(null);
    const [loading,setLoading] = useState(false);
    const {adId} = useParams();

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
          setAd(data);
        } catch (error) {
          setAdError(error.message);        
        }
      }
      fetchAd();
    },[adId])
  
  if (loading) return(
    <div className="flex justify-center items-center min-h-screen">
      <Spinner size='xl'/>
    </div>
  );
  if (adError) return(
    <Alert color='failure' className="flex justify-center items-center min-h-screen" >{adError}</Alert>
  );
  
  return (
    <div className=" flex flex-col p-5">
      <img src={ad.coverImg} alt="Image" className="rounded-md h-60 sm:h-100 w-180 self-center" />
      <div className="sm:px-20 py-5 flex flex-col gap-5 sm:gap-10">

        <p className="font-semibold italic">"{ad.description}"</p>

        <div className="flex gap-3 items-center text-sm sm:text-xl">
          <FaMapMarkerAlt />
          <p className="text-sm sm:text-lg">{ad.address}</p>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:gap-10">
          <div className="flex gap-5 sm:gap-10">
            <div className="flex items-center gap-2 sm:text-lg">
              <FaBed /> 
              <span className="text-sm font-semibold sm:text-lg">{ad.bed} {ad.bed>1?'bedrooms':'bedroom'}</span>
            </div>
            <div className="flex items-center gap-2 sm:text-lg">
              <FaBath/>
              <span className="text-sm font-semibold sm:text-lg">{ad.bed} {ad.bed>1?'bathrooms':'bathroom'}</span>
            </div>
          </div>

          <div className="flex gap-8 md:gap-10 ">
            {ad.furnished ?(
              <div className="flex items-center gap-2 sm:text-xl">
                  <RiArmchairLine/><span className="text-sm font-semibold sm:text-lg">Furnished</span>
              </div>):(
              <div className="flex items-center gap-2">
                  <TbArmchair2Off/><span className="text-sm font-semibold sm:text-lg">Not Furnished</span>
              </div>)}
            
            {ad.parking ?(
            <div className="flex items-center gap-2 sm:text-xl">
              <TbParkingCircle /><span className="text-sm font-semibold sm:text-lg">Parking</span>
            </div>):(
            <div className="flex items-center gap-2">
                <BsSignNoParking/><span className="text-sm font-semibold sm:text-lg">No Parking</span>
            </div>)}
          </div>
        </div>

        <div className="flex flex-col gap-5 md:flex-row md:gap-10">
          <div className="flex items-center gap-2">
            <span className='font-semibold sm:text-lg bg-amber-800 text-white px-3 py-1 rounded-4xl'>For {ad.type}</span>
            <span className="text-sm font-semibold sm:text-lg">{ad.type === 'rent' ? "Monthly Rent - "+ad.rent+" Rs" : "Selling Price"+ad.sellingPrice+" Rs"}</span>

          </div>

          <div className="flex items-center gap-2 mt-">
            <FaPhone/><span className="text-sm font-semibold sm:text-xl">{ad.phone}</span>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Ad
