import { Button, Footer, FooterCopyright, FooterDivider, FooterIcon, FooterLinkGroup, FooterTitle } from 'flowbite-react'
import { FaFacebook,FaInstagram,FaTwitter,FaGithub,FaDribbble,FaEnvelope,FaPhone,FaWhatsapp } from "react-icons/fa";
import { Link } from 'react-router-dom';

function FooterComp() {
  return (
    <Footer container className='border-t-2 border-amber-400 flex flex-col '>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:w-full  mx-auto items-center sm:justify-between ">
        <Link to={'/'}>
          <span className='max-w-52 sm:max-w-72 text-xl sm:text-3xl font-bold flex gap-2 bg-amber-950 text-white whitespace-nowrap font-serif p-2 items-center rounded-full shadow-md'><span className='bg-white text-black rounded-full p-2'>1</span>Cent<span className='font-semibold'><i>Property</i></span></span>
        </Link>
        <Link to={'/post-add'}>
          <Button className='bg-gradient-to-r from-amber-600 to-amber-400'>Want to Advertise in our site -- Click Here</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-20 items-center">
        <FooterLinkGroup className='flex gap-5 items-center'>
          <FooterTitle title='Follow Us On' className='text-amber-950 font-bold mt-6 items-center'/>
          <FooterIcon href='#' icon={FaFacebook} className='text-amber-400'/>
          <FooterIcon href='#' icon={FaInstagram} className='text-amber-400'/>
          <FooterIcon href='#' icon={FaTwitter} className='text-amber-400'/>
          <FooterIcon href='#' icon={FaGithub} className='text-amber-400'/>
          <FooterIcon href='#' icon={FaDribbble} className='text-amber-400'/>
        </FooterLinkGroup>
    
        <FooterLinkGroup className='flex gap-5 items-center'>
          <FooterTitle title='Contact Us' className='text-amber-950 font-bold mt-6'/> 
          <FooterIcon href='#' icon={FaEnvelope} className='text-amber-400'/>
          <FooterIcon href='#' icon={FaPhone} className='text-amber-400'/>
          <FooterIcon href='#' icon={FaWhatsapp} className='text-amber-400'/>
        </FooterLinkGroup>
      </div>
      

      <FooterCopyright  href='#' by="1 Cent Property" year={new Date().getFullYear()} className='flex justify-center'/>

    </Footer>
   
  )
}

export default FooterComp
