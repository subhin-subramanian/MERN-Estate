import { FaMapMarkerAlt,FaBath, FaPhone } from "react-icons/fa";
import { FaBed } from "react-icons/fa6";
import { TbParkingCircle } from "react-icons/tb";
import { BsSignNoParking } from "react-icons/bs";
import { RiArmchairLine } from "react-icons/ri";
import { TbArmchair2Off } from "react-icons/tb";
import { Link } from "react-router-dom";

function AdCard({ad}) {
  return (
    <Link to={`/ad/${ad._id}`}>
    <div className="border border-amber-600 max-w-90 h-115 flex flex-col gap-3 rounded-md hover:transition-transform hover:scale-102 hover:border-3 transition-all duration-300">
      <img src={ad.coverImg} alt="Image" className="rounded-t-md h-60" />
      <div className="p-3 flex flex-col gap-3">

        <p className="line-clamp-2 font-semibold italic">"{ad.description}"</p>

        <div className="flex gap-3 items-center text-sm">
          <FaMapMarkerAlt />
          <p className="text-sm line-clamp-1">{ad.address}</p>
        </div>

        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            <FaBed /> 
            <span className="text-sm font-semibold">{ad.bed} {ad.bed>1?'bedrooms':'bedroom'}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaBath />
            <span className="text-sm font-semibold">{ad.bed} {ad.bed>1?'bathrooms':'bathroom'}</span>
          </div>
        </div>

        <div className="flex gap-8">
          {ad.furnished ?(
            <div className="flex items-center gap-2">
                <RiArmchairLine/><span className="text-sm font-semibold">Furnished</span>
            </div>):(
            <div className="flex items-center gap-2">
                <TbArmchair2Off/><span className="text-sm font-semibold">Not Furnished</span>
            </div>)}
          
          {ad.parking ?(
          <div className="flex items-center gap-2">
            <TbParkingCircle /><span className="text-sm font-semibold">Parking</span>
          </div>):(
          <div className="flex items-center gap-2">
              <BsSignNoParking/><span className="text-sm font-semibold">No Parking</span>
          </div>)}
        </div>

        <div className="flex items-center gap-2">
          <FaPhone/><span className="text-sm font-semibold"></span>
        </div>

      </div>
    </div>
    </Link>
  )
}
export default AdCard
