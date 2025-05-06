import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  const location = useLocation();
  const previousPath = location.state?.from || null;
  const user = location.state?.user || "User";
  const errMsg = location.state?.errMsg || null;
  const dp = location.state?.dp || null;
  const userDetails = location.state?.userDetails || null;
  const msg2 = location.state?.msg || null;
  const detail = location.state?.detail || null;

  let msg;
  if (errMsg) {
    msg = errMsg;
  } else if (previousPath === "/signin") {
    msg = `Login is successful, Welcome again ${user}`;
  } else if (previousPath === "/details") {
    msg = `${user} registered successfully`;
  } else if(msg2){
    msg = msg2;
  }else {
    msg = "Can't access success page directly";
  }

  const data = {
    dp: dp,
    userDetails: userDetails,
    detail: detail,
  };

  useEffect(() => {
    if (countdown === 0) {
      navigate("/home", {state: data});
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  const successStyle = previousPath
    ? {
        background: `url("/success3.jpg") no-repeat`,
        backgroundSize: "contain",
        overflow: "hidden",
      }
    : {};

  const failStyle = previousPath
    ? { color: '#355834' }
    : { color: "red" };

  return (
    <div className="Success" style={successStyle}>
      <div className="SuccessPage">
        <div className="SuccessPageContent">
          <h2 style={failStyle}>{msg} !!</h2>
          <br />
          Redirecting to Home page in {countdown} seconds. <br />
          <Link to={"/home"} state={{dp: dp, userDetails: userDetails}}>
            Back to Home <HiOutlineArrowNarrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
