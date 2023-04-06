# Twitter Clone

## Get started with new social media site, Oinker! The site for pigs!

Very much in progress.

#### TODO NEXT

- add route for user's likes

#### TODO LATER

##### Features

- add ability to reply
- add page for user's replies
- add big tweet page
- generate random handle that hasn't been used before upon user creation
- ? add tweet searchbox that displays tweets containing search parameters

##### Behavior

##### Style

- add credit

#### DONE

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
