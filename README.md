# Tick Tack Toe 5

This project of simple game Tick Tack Toe modified for 5-in-a-row version was build specifically 
for a school project at Westbohemian University in Pilsen. In this project is user able to create account,
invite other online user to be friends, see the statistics and last but not least, play the game.

## Build and configuration

Build is done via docker-compose file. It consists of 4 parts:
- API (written in Golang) - `localhost:8081`
- Web application (written in Angular) - `localhost:8080`
- Database (MariaDB) - `localhost:3306`
- PHPMyAdmin (for viewing the database online) - `localhost:8082`

Build process of API is quite fast, however building a Web application in Angular takes approximately
about 15-25 minutes. Build can be done with command `docker-compose build`. After successful build
run command `docker-compose run` for running all applications.

The folder structure (for example folder ttt) for correct build should be following:<br>
`ttt/api`<br>
`ttt/web`<br>
`ttt/api.env`<br>
`ttt/db.env`<br>
`ttt/docker-compose.yaml`<br>
`ttt/init.sql`<br>
`ttt/phpmyadmin.env`<br>


## Login

For a login into the application user can use either Google OAuth2 
(_Please provide your e-mail to the author as OAuth provided by Google is set only to a testing regime_) 
or register via redirection to a registration
formula on the login page. In the registration formula user need to provide a username, email, password (and retype)
and confirm (non-existent) terms and conditions to be successful registered.

In login page user can use Sign with Google button or login with e-mail and password.

## Friends handling

Once more users are online, user can ask other online user to become friends. After user ask
a confirmation message appears. The second user will soon (in max 20 secs - periodical REST calls) see
a change in the notification bubble next to user icon. This icon will guide him then to administration page,
where he can confirm or delete the request.

Once friendship is confirmed, after getting back on the main page (or reloading) the new friend will appear in
friend list.

## Administration

In the administration page user can change password and manage requests for friendship and as well delete friendships
Password change is done via form, and it is available only for users that registered in the app.
As for managing requests, these can be accepted or deleted.

## Game

User can ask other user to play game whether he is his friend or not. The other user will get a pop-up
notification (make sure they are enabled by the browser). Once other user joins the game the status of
both users is changed. Game is played on a fixed 20X20 board - asking user always starts and has "X" symbols. Second user
is playing with "O". After reaching five-in-row, both users have notification of the winner. After closing
the pop-up a page is refreshed (this is known issue).

After winnig a game user can have a look on the leaderboard via tab in header.

## Swagger

In the API can be found swagger specification of the underlying REST API.

## Help and questions

To get help or ask me questions please contact me at [email](mailto:vrbalu00@students.zcu.cz) .
