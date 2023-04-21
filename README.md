# Twitter Clone

## Use it just like Twitter!

Very much in progress.

#### TODO NEXT

- ? make big tweet show own user's future thread from current tweet, not just extraneous replies, and that should be first
- figure out why I had to click my own profile twice when on another user's profile for the user profile to refresh

#### TODO LATER

##### Features

- add ability to retweet
- start profile edit inputs with current values
- ? add notifications
- ? add ability to change avi
- ? add tweet searchbox that displays tweets containing search parameters
- ? add follow button to each user card in UserListPopup

##### Behavior

- make "Tweets" feed on profile show user's replies to their own tweets even if not in the "Replies" tab
- ? add confirmation to delete tweet button
- investigate if I need to pass currentUserInfo to TweetCard or if I can just use context
- handle manually navigating to UserListPopup component without a user IDs array in state from Link
- handle search box when non-existant user is searched
- handle visiting pages when not signed in
- fix how when signed out, nav elements not there (correct behavior), but when signing in (or maybe only new user signing in?), they don't populate, which they should
- ? prevent reply label from blinking a few times upon loading

##### Style

- make colors consistent
- make profile links in TweetCards, UserListPopups underline
- make middle section consistent widths
- ? make replies have a line to indicate they're replies

- add credit

#### DONE

_0.7.6_

- fix every big tweet saying they've been deleted
- fix testuser's tweet not showing replies; it's showing the big tweet again in small tweet form as a reply, what the fuck

_0.7.5_

- make routes work when on Big Tweet page and click to go straight to another Big Tweet page
- program behavior for handling tweets in threads that no longer exist
- make deleted big tweets display as deleted

_0.7.4_

- add reply label in big tweets
- refactor [tweetInfo] useEffect() in BigTweet to prevent uncaught promises
- clean up console.logs
- adjust routing so big tweet links don't need to be prefaced with another page
- fix reply button on previous tweet in thread; currently brings up popup of most recent tweet instead of selected reply
  - fixed by only using params if they exist AND if component is not part of a popup reply

_0.7.3_

- make big tweets show previous tweets in the chain
- make big tweets show replies in the thread
- fix replying so it adds correct tweetId and userId to previous tweet's replies

_0.7.2_

- add reply label in tweetCards
- link reply label to user's page

_0.7.1_

- make small tweets reply button bring up reply compose popup

_0.7.0_

- add logic to reply to tweets

_0.6.3_

- add referrerpolicy to img elements so profile pictures actually show up
- make user's number of followers update upon following/unfollowing on profile

_0.6.2_

- make likes bring you to likers page
- style Likes link
- add hover underline to all instances of linked display names
- adjust styling on Tweetcards
- make like buttons pink on hover

_0.6.1_

- adjust styling for BigTweet
- separate actions and stats on BigTweet

_0.6.0_

- make /likes route a child of /tweet/:userIdTweetId
- add big tweet page
- adjust big tweet layout

_0.5.8_

- add bio section to profile headers
- add bio to each user card in list
- refactor routing so any path ending in /likes or /followers or /following will work
- refactor routing again so checking user's following/ers doesn't unmount profile component and require reload upon returning

_0.5.7_

- make each user card into a link to their profile

_0.5.6_

- make user cards in list a little prettier
- fix "follows you" label so it doesn't say you follow yourself

_0.5.5_

- make UserListPopup fetch display names and pictures and handles for each user
- pass title to UserListPopup

_0.5.4_

- create component to show a list of users from a list of user IDs
- link following and followers counts to UserListPopup component

_0.5.3_

- add cancel button to header edit view
- make header display number of followers/ing
- add routes for followers/ing

_0.5.2_

- fix duplicate handle prevention
- add alert for duplicate handles

_0.5.1_

- add ability to edit handle
- add ability to edit display name
- make user's info refresh upon editing without refreshing entire page

_0.5.0_

- generate random handle that hasn't been used before upon user creation
- test random handle generation
- make sure first character in random handle after "newuser" is a number so it's clear where it becomes random

_0.4.4_

- add feed on profiles for that user's likes

_0.4.3_

- add feed selector tabs to profiles

_0.4.2_

- fix profile tweet feed not refreshing if going straight from other user's profile to current user's profile
  - just had to add [idsForFeed] parameter to useEffect in TweetFeed
- polish useEffect logic in Profile
- clean up outdated code in Profile

_0.4.1_

- refactor Profile to use TweetFeed instead of creating its own
- absract currentUser from TweetCard to parent component so every tweet card doesn't have to fetch current user info, what the fuck

_0.4.0_

- create Feed component usable by profile as well as home
- add home page logic to show what the people you follow have tweeted
- make displayName and handle navigate to that user's profile upon clicking

_0.3.3_

- update user fields
- make new users follow themselves automatically
- add ability to follow user
- add ability to unfollow user
- adjust "find user" searchbox so it's case-insensitive
- slight layout adjustments

_0.3.2_

- add "find user" input in Navbar that takes you to profile of user's handle

_0.3.1_

- adjust profile router to use handles instead of user.id
- Reformat layout using grid

_0.3.0_

- refactor router to drop /profile/, now just goes [URL]/:userId

_0.2.6_

- get "like" numbers to change upon clicking the heart without reloading entire page

_0.2.5_

- add ability to like and dislike tweets
- make heart red if user has liked it
- make page refresh after user likes a tweet so the number updates
- fix test tweets's fields

_0.2.4_

- make tweetCards check if current user has liked tweet

_0.2.3_

- add delete button
- add ability to delete tweets
- adjust send/delete logic to make sure the db updates before the page refreshes

_0.2.2_

- write New Tweet logic

_0.2.1_

- write tweet constructor
- add TweetCard component

_0.2.0_

- Make profile display user's tweets

_0.1.2_

- add logic to create new user object and upload to db upon signing in

_0.1.1_

- add Google authentication + sign in button
- write logic to check if user exists already
- add function to create new user
- add sign out button

_0.1.0_

- create preliminary components
- wire up BrowserRouter
- add Firebase

_0.0.0_

- Initial commit
