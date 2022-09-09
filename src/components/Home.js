import React from 'react'
import "./Home.css"
import data from "../assets/data"

function Home() {
  const isLoading = React.useState(false);
  const [loginData, setLoginData] = React.useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );
  // const signedIn = React.useState(false);
  const [token, setToken] = React.useState(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );

  const signOut = (e)=>{

    data.signOut(data.auth).then(() => {
      // Sign-out successful.
      console.log("Signed out")
      localStorage.removeItem("token");
      localStorage.removeItem("loginData");
      window.location.reload();
    }).catch((error) => {
      // An error happened.
      alert("error in signing out!");
      console.log(error);
    });
   
   }

  

 
  return (
    <div> <div className="home-profile">
    <div className="app__wrapper">
      <div className='.app__wrapper_info '>
        <div className='container'> <h3>You are now logged in as , {loginData.displayName}</h3> </div>
      
      </div>
       
      {loginData && (
        <button className="custom__button" onClick={signOut}>
          LogOut
        </button>
     )} 
    </div>
    </div>
  </div>
  )
}

export default Home