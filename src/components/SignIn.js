import './SignIn.css';
import { signInWithGoogle, signOutUser } from '../FirebaseController';
import { useContext, useState } from 'react';
import { UserContext } from '../UserContext';
import ComposeTweet from './tweets/ComposeTweet';
import ComposeTweetPopUp from './tweets/ComposeTweetPopUp';

const SignIn = () => {
  const user = useContext(UserContext);
  const [isTweeting, setIsTweeting] = useState(false);

  const launchTweetPopup = () => {
    setIsTweeting(true);
  };
  const exitTweetPopup = () => {
    setIsTweeting(false);
  };

  return (
    <div className="signIn-wrapper layout-element">
      {user ? (
        <div className="signIn-container">
          <div>{user.displayName}</div>
          <button onClick={signOutUser} className="signIn-signOutButton">
            Sign out
          </button>
          <button onClick={launchTweetPopup} className="signIn-tweetButton">
            <span className="material-symbols-outlined">history_edu</span>
          </button>
          {isTweeting ? (
            <ComposeTweetPopUp handleExit={exitTweetPopup} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign in</button>
      )}
    </div>
  );
};

export default SignIn;
