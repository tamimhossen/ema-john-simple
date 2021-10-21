import React, { useContext, useState } from 'react';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, FacebookAuthProvider  } from "firebase/auth";
import { UserContext } from '../../App';
import { useHistory, useLocation } from 'react-router';






function Login() {
  
  initializeApp(firebaseConfig);
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

  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const history = useHistory();
  const location = useLocation();
  let { from } = location.state || { from: { pathname: "/" } };

  // Google Sign In Code Started

  const googleProvider = new GoogleAuthProvider();
  const fbProvider = new FacebookAuthProvider();
  const handleSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const {displayName, photoURL, email} = user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
        console.log(displayName, email, photoURL);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      });
  }

  const handlFbSignIn = () => {
    const auth = getAuth();
    signInWithPopup(auth, fbProvider)
      .then((result) => {
        const user = result.user;
        const {displayName, email, photoURL} = user;
        console.log(displayName, email, photoURL);
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(signedInUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        setUser(signedOutUser);
      }).catch((error) => {
        // An error happened.
      });
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
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, user.email, user.password)
        .then((userCredential) => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name)
          console.log(userCredential);
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
          // ..
        });
    }

    if (!newUser && user.email && user.password) {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, user.email, user.password)
        .then((res) => {
          const newUserInfo = {...user};
          newUserInfo.error = '';
          newUserInfo.success = true;
          setUser(newUserInfo);
          setLoggedInUser(newUserInfo);
          history.replace(from);
          console.log('signed in user info', res.user);
        })
        .catch((error) => {
          const newUserInfo = {...user};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  }

  const updateUserName = name => {
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(() => {
      console.log('username udated successfully')
    }).catch((error) => {
      console.log(error)
    });
  }

  return (
    <div style={{textAlign: 'center'}}>
      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out</button> :
        <button onClick={handleSignIn}>Sign In</button>
      }
      <br/>
      <button onClick={handlFbSignIn}>Sign In Using Facebook</button>
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
