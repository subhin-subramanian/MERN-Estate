import { Button} from 'flowbite-react'
import { Link } from 'react-router-dom'
import { BiSearchAlt2 } from "react-icons/bi";
import { useState } from 'react';

function Header() {
  const [signup,setSignUp] = useState('signup');
  return (
    <div className=' items-center px-4 flex flex-wrap gap-3 justify-between py-3  text-amber-800 shadow-sm dark:shadow-2xl'>

      <Link to={'/'}>
        <span className='text-xl sm:text-3xl font-bold flex gap-2 bg-amber-950 text-white dark:text-gray-500 whitespace-nowrap font-serif p-2 items-center rounded-full shadow-md'><span className='bg-white dark:bg-gray-500 text-black rounded-full p-2'>1</span>Cent<span className='font-semibold'><i>Property</i></span></span>
      </Link>

      <form className='className="mt-5 mx-auto order-2 md:mt-0 md:order-0 flex relative w-full md:max-w-96 max-w-4xl'>
        <input
        type="text"
        id="search"
        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 "
        placeholder="Search here..." />
        <BiSearchAlt2 className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none'/>     
      </form>

      <div className="flex gap-2">
        <Link to={'/post-add'}>
          <Button className='bg-gradient-to-r from-amber-600 to-amber-400'>Post Add</Button>
        </Link>
        <Button className='' outline>Sign Up</Button>
        
      </div>

    </div>
  )
}

export default Header
