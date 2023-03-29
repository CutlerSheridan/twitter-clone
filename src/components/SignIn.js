import './SignIn.css';
import { signInWithGoogle, signOutUser } from '../FirebaseController';

const SignIn = ({ user }) => {
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
