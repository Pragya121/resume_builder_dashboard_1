import React from 'react'

import { Outlet, Link } from "react-router-dom";
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiFillCloseCircle } from "react-icons/ai";
import data from '.././assets/data'
import "./Navbar.css"
function Navbar() {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  const [isLoading, setIsLoading]  = React.useState(false);
  const signOut = (e)=>{
    setIsLoading(true);
    data.signOut(data.auth).then(() => {
      // Sign-out successful.
      console.log("Signed out")
      localStorage.removeItem("token");
      localStorage.removeItem("loginData");
      setIsLoading(false)
      window.location.reload();
    }).catch((error) => {
      // An error happened.
      alert("error in signing out!");
      setIsLoading(false);
      console.log(error);
    });
   
   }
  return (
    <div>  <nav className="app__navbar">
    <div className="app__navbar-logo">
      <img src={data.logo} alt="app__logo" /> 
    </div> <div className='p__opensans'><h1>Grammer analytics </h1></div>
    <div>
      <ul className='app__navbar-links'> 
  
        <li className='p__opensans'><Link to="/"> <button>Home </button></Link>
        </li>
        <li className='p__opensans'>    <button onClick={signOut}>Sign Out</button>
        </li>
        </ul>
      </div>
      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu color="#fff" fontSize={27} onClick={() => setToggleMenu(true)} />
        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <AiFillCloseCircle fontSize={27} className="overlay__close" onClick={() => setToggleMenu(false)} />
            <ul className="app__navbar-smallscreen_links">
              <li><Link to="/"><a  onClick={() => setToggleMenu(false)}>Home</a></Link></li>
              <li><a  onClick={() => {setToggleMenu(false); signOut() }}>Sign out</a></li>
             
            </ul>
          </div>
        )}
      </div>
    </nav></div>
  )
}

export default Navbar