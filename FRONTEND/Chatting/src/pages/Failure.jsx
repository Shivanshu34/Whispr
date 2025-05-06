import React from 'react';
import {Link, useLocation } from 'react-router-dom';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const Failure = () => {
   const location = useLocation();

   const errMsg = location.state?.errMsg || "Can't access failure page directly ";
   const path1 = location.state?.path1 || null;
   const path2 = location.state?.path2 || null;
   
   const failStyle = { color: "red" };

   return (
       <div className="Success">
         <div className="SuccessPage">
           <div className="SuccessPageContent">
             <h2 style={failStyle}>{errMsg} !!</h2>
             <br />
             {path1 && path2 && 
             <>
             <Link to={path1}>
             <HiOutlineArrowNarrowRight /> SignUp 
             </Link> <br/> <br />
             <Link to={path2}>
             <HiOutlineArrowNarrowRight /> SignIn
             </Link> <br /><br />
             </>
             }
             <Link to={"/home"}>
             <HiOutlineArrowNarrowRight /> Back to Home 
             </Link>
           </div>
         </div>
       </div>
     );
}

export default Failure;
