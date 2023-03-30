import './SignIn.css';
import { signInWithGoogle, signOutUser } from '../FirebaseController';
import { useContext } from 'react';
import { UserContext } from '../UserContext';

const SignIn = () => {
  const user = useContext(UserContext);
  return (
    <div className="signIn-wrapper">
      {user ? (
        <div>
          <div>{user.displayName}</div>
          <button onClick={signOutUser}>Sign out</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign in</button>
      )}
    </div>
  );
};

export default SignIn;
