import './SignIn.css';
import { signInWithGoogle, signOutUser } from '../FirebaseController';
import { useContext } from 'react';
import { UserContext } from '../UserContext';
import ComposeTweet from './tweets/ComposeTweet';
import { updateUserFields, updateTweetFields } from '../FirebaseController';

const SignIn = () => {
  const user = useContext(UserContext);
  return (
    <div className="signIn-wrapper layout-element">
      {user ? (
        <div>
          <div>{user.displayName}</div>
          <button onClick={signOutUser}>Sign out</button>
          <ComposeTweet />
          <button onClick={() => updateUserFields()}>Update user fields</button>
          <button onClick={() => updateTweetFields(user.uid)}>
            Update Tweet fields
          </button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign in</button>
      )}
    </div>
  );
};

export default SignIn;
