import "./App.css";
import { useEffect } from "react";
import Loading from "./components/Loading";

import data from "./assets/data";
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Signin from "./components/Signin";
import { Outlet, Link } from "react-router-dom";
function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSignedout, setIsSignedout] = React.useState(false);
  const [user, setUser] = React.useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("token"))
      : {}
  );
 
  const [token, setToken] = React.useState(
    localStorage.getItem("token")
      ? JSON.parse(localStorage.getItem("token"))
      : null
  );

 
  // console.log("Keys and values", keyValues);
  
  const signOut = (e) => {
    setIsLoading(true);
    setIsSignedout(true);
    data
      .signOut(data.auth)
      .then(() => {
        // Sign-out successful.
        console.log("Signed out");
        localStorage.removeItem("token");
        localStorage.removeItem("loginData");
        setIsLoading(false);
        window.location.reload();
      })
      .catch((error) => {
        // An error happened.
        alert("error in signing out!");
        setIsLoading(false);
        console.log(error);
      });
  };
 

  useEffect(() => {
   //statements
  }, []);
  if (!isLoading) {
    return (
      <div className="App">
        <Navbar />

        <div className="body">
          {" "}
         <h1>Hello</h1>
        </div>
        <Footer />
      </div>
    );
  } else {
    return <Loading />;
  }


  // if (token) {
  //   if (!isLoading) {
  //     return (
  //       <div className="App">
  //         <Navbar />

  //         <div className="body">
  //           {" "}
  //          <h1>Hello</h1>
  //         </div>
  //         <Footer />
  //       </div>
  //     );
  //   } else {
  //     return <Loading />;
  //   }
  // } else {
  //   return <Signin />;
  // }
}

export default App;
