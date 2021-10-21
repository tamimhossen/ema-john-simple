import React, { useContext, useState } from 'react';

import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import { handleGoogleSignIn, handleSignOut, initializeLoginFramework, handlFbSignIn, createUserWithFirebaseWithEmailAndPass, signInUserWithFirebaseWithEmailAndPassword } from './LoginManager';






function Login() {
  
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    password: '',
    photo: '',
    error: '',
    success: false
  });

  initializeLoginFramework();

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  // Google Sign In Code Started

  const googleSignIn = () => {
      handleGoogleSignIn()
      .then(res => {
          handleResponse(res, true)
      })
  }

  const fbSignIn = () => {
    handlFbSignIn()
    .then(res => {
        handleResponse(res, true)
    })
  }

  const signOut = () => {
      handleSignOut()
      .then(res => {
          handleResponse(res, false)
      })
  }


  const handleResponse = (res, redirect) => {
    setUser(res);
    setLoggedInUser(res);
    if(redirect) {
        history.replace(from);
    }
  }

  
  
  
  

  

  // Google Sign In Code Ended


  //Form Sign In Code Started

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S+/.test(e.target.value);
    }

    if (e.target.name === "password") {
      const isPasswordValid = e.target.value.length > 6;
      const passwordHadNumber = /\d{1}/.test(e.target.value);
      isFieldValid = isPasswordValid && passwordHadNumber;
    }

    if (isFieldValid) {
      const newUserInfo = {...user};
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  }

  const handleSubmit = (e) => {
    if (newUser && user.email && user.password) {
      createUserWithFirebaseWithEmailAndPass(user.name, user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }

    if (!newUser && user.email && user.password) {
      signInUserWithFirebaseWithEmailAndPassword(user.email, user.password)
      .then(res => {
        handleResponse(res, true);
      })
    }
    e.preventDefault();
  }

  

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={signOut}>Sign Out</button> :
        <button onClick={googleSignIn}>Sign In</button>
      }
      <br/>
      <button onClick={fbSignIn}>Sign In Using Facebook</button>
      {
        user.isSignedIn && <div>
          <p>Welcome: {user.name}</p>
          <p>Your Email: {user.email}</p>
          <img src={user.photo} alt=""/>
        </div>
      }

      <h1>Our Own Authentication System</h1>
      <input type="checkbox" onChange={() => setNewUser(!newUser)} name="newUser" id=""/>
      <label htmlFor="newUser">New User Sign Up</label>
      <form onSubmit={handleSubmit}>
        {
          newUser && <input name="name" onBlur={handleBlur} type="text" placeholder="Your Name"/>
        }
        <br/>
        <input type="text" onBlur={handleBlur} name="email" placeholder="Your Email Address" required/>
        <br/>
        <input type="password" onBlur={handleBlur} name="password" id="password" placeholder="Your password" required/>
        <br/>
        <input type="submit" value={newUser ? 'Sign Up' : "Sign In"}/>
      </form>
      <p style={{color: 'red'}}>{user.error}</p>
      {
        user.success && <p style={{color: 'green'}}>User {newUser ? 'Created' : 'Logged In'} Successfully</p>
      }
    </div>
  );
}

export default Login;
