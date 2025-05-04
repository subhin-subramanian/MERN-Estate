import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom";

function PrivateRoute() {
    const {currentUser} = useSelector(state=>state.user);
  return (
    <div>
        {currentUser ? <Outlet/> : <h1 className='text-center p-25 font-bold text-red-500'>You have to sign-in to view this page</h1>}
    </div>
  )
}

export default PrivateRoute
