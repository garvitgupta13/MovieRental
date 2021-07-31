# <u>Movie Rental</u>
</br>

This is the backend for a movie rental application which allows customers to rent a movie for a particular amount of time. 
It involves special access to people with user role who can perform CRUD operation on data.

### Run The Server Locally
1. Fork This Repository.
2. Clone Fork Repository.
`git clone <url_of_your_forked_clone>`

3. Open the Project and navigate to the project directory.
4. Run the following commands;
 ```
 cd backend
 npm install
$env: backend_jwtPrivateKey="your jwt token"
 nodemon index.js
 ```
 5. To run the test `npm test`

#### Your backend server will start running at [http://localhost:3000](http://localhost:3000)

#### To know more about it please refer our [documentation](/documentation.md)

#### You can also check the backend live server at [https://garvit-vidlybackend.herokuapp.com/](https://garvit-vidlybackend.herokuapp.com/)
I have used AWS cloud service to store the database and heroku for deployment
