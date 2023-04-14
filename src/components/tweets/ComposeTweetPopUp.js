import './ComposeTweetPopUp.css';
import BigTweet from './BigTweet';
import ComposeTweet from './ComposeTweet';

const composeTweetPopUp = ({ repliedToIdsObj = null }) => {
  const userAuth = useContext(UserContext);
  const [isReply, setIsReply] = useState(repliedToIdsObj ? true : false);

  return (
    <div className="composePopUp-wrapper">
      <div className="composePopUp-innerContainer">
        {isReply ? (
          <BigTweet
            userId={repliedToIdsObj.userId}
            tweetId={repliedToIdsObj.tweetId}
          />
        ) : (
          <></>
        )}
        <ComposeTweet repliedToIdsObj={repliedToIdsObj} />
      </div>
    </div>
  );
};
