import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.config';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, FacebookAuthProvider  } from "firebase/auth";

 export const initializeLoginFramework = () => {
    initializeApp(firebaseConfig);
}


// google sign in handler started

export const handleGoogleSignIn = () => {
    const googleProvider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        const {displayName, photoURL, email} = user;
        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,
          success: true
        }
        return signedInUser;
        console.log(displayName, email, photoURL);
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorCode, errorMessage, email, credential);
      });
  }

//google sign in handler ended

// facebook login handler started 

export const handlFbSignIn = () => {
    const fbProvider = new FacebookAuthProvider();
  const auth = getAuth();
  return signInWithPopup(auth, fbProvider)
    .then((result) => {
      const user = result.user;
      const {displayName, email, photoURL} = user;
      console.log(displayName, email, photoURL);
      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL,
        success: true
      }
      return signedInUser;
    })
    .catch((error) => {
      console.log(error);
    });
}

//facebook login handler ended


// sign out handler started
export const handleSignOut = () => {
    const auth = getAuth();
    return signOut(auth)
      .then(() => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: ''
        }
        return signedOutUser;
      }).catch((error) => {
        // An error happened.
      });
  }
// sign out handler ended


// form account creation submit function started

export const createUserWithFirebaseWithEmailAndPass = (name, email, password) => {
    const auth = getAuth();
      return createUserWithEmailAndPassword(auth, email, password)
        .then((res) => {
          const newUserInfo = res.user;
          newUserInfo.error = '';
          newUserInfo.success = true;
          updateUserName(name)
          console.log(res);
          return newUserInfo;
        })
        .catch((error) => {
          const newUserInfo = {};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          return newUserInfo;
        //   setUser(newUserInfo);
          // ..
        });
}

// form account creation submit function ended

// form sign in submit function started

export const signInUserWithFirebaseWithEmailAndPassword = (email, password) => {
    const auth = getAuth();
      return signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
          const newUserInfo = res.user;
          newUserInfo.error = '';
          newUserInfo.success = true;
          console.log('signed in user info', res.user);
          return newUserInfo;
        })
        .catch((error) => {
          const newUserInfo = {};
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          return newUserInfo;
        });
}

// form sign in submit function ended


// update user info function started 

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

// update user info function ended