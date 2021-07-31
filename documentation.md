# <u>Backend Documentation</u>
</br>

Before executing every route function validation middleware gets executed which checks whether the input is in the given format or not also for all the routes except get route, auth middleware gets executed which checks the validity of token in authorization header.

Note: Add the user token in header to access all these route `x-auth-token : userToken`

### Genres module 
The Genres module is responsible for all the functions related to genre, for example : fetching particular genre data from the database, creating a new genre, changing genre and deleting genre. 

- #### Get all genres `/api/genres` [GET]
    - Get the array of all movie genres present in database
    - This is a public Route (No Auth token Required).   

- #### Get particular genre `/api/genre/:genreId` [GET]
    - Get the movie details from database 
    - This is a public Route (No Auth token Required). 

- #### Add new genre `/api/genres` [POST]
     - request body : 
        | Parameter   | description |
        | ----------- | ------------
        | name   | string, required|

- #### Update existing genre `/api/genre/:genreId` [PUT]
     - request body : 
        | Parameter   | description |
        | ----------- | ------------
        | name   | string, required|

- #### Delete existing genre `/api/genre/:genreId` [DELETE]
    - Only user with admin access will be allowed to access this route.

### Movie module 
The Movie module is responsible for all the functions related to movie, for example : fetching particular movie data from the database, adding new movie, updating existing movie, deleting movie. 


- #### Get all movies `/api/movies` [GET]
    - Get the array of all movies present in database 
    - This is a public Route (No Auth token Required). 

- #### Get particular movie `/api/movies/:movieId` [GET]
     -  Get the movie details from database
     - This is a public Route (No Auth token Required). 

- #### Add new movie `/api/movies` [POST]
     - request body : 
        | Parameter   | description |
        | ----------- | ------------
        | title   | string(min(5), max(5)) ,  required|
        | genreId| objectId , required |
        |numberInStock | number, min(0)|
        | dailyRentalRate | number(min(5).max(1000)) |

- #### Update existing movie `/api/movies/:movieId` [PUT]
     - request body : 
         | Parameter   | description |
        | ----------- | ------------
        | title   | string(min(5), max(5)) ,  required|
        | genreId| objectId , required |
        |numberInStock | number, min(0)|
        | dailyRentalRate | number(min(5).max(1000)) |

- #### Delete existing movie `/api/movies/:movieId` [DELETE]
    - Only user with admin access will be allowed to access this route.

### Customers module 
The Customers module is responsible for all the functions related to customers, for example : adding a new customers, updating customers. 

- #### Add new customer `/api/customers` [POST]
     - This is a public route (no auth token required) 
     - request body : 
        | Parameter   | description |
        | ----------- | ------------
        | name   | string(min(3)) ,  required|
        |phone | string(min(10),max(10)) , unique|
        |isGold|Boolean , default(false)|

- #### Update existing customer `/api/customers/:customerId` [PUT]
     - request body : 
        | Parameter   | description |
        | ----------- | ------------
        | name   | string(min(3)) ,  required|
        |phone | string(min(10),max(10)) , unique|

### Users module 
Users refers to people with special previlage of updating the data. Do not misunderstand them customers.
The Users module is responsible for all the functions related to users, for example : fetching the logged in user details and adding a new user.

- #### Get the logged user deatils `/api/users/me` [GET]
    - Gives the details of user whose token is provided in header

- #### Add new user `/api/users` [POST]
     - Only user with admin privalage can access this route
     - request body : 
        | Parameter   | description |
        | ----------- | ------------
        | name   | string(min(3)) ,  required|
        |email | string , unique , required|
        |password|string(min(5)), required|

### Rental module
Rental module refers to all the functions related to rentals, for example: adding new rental, fetching particular rental, fetching all rentals.

- #### Get all genres `/api/rentals` [GET]
    - Get the array of all rentals present in database.

- #### Get particular genre `/api/rentals/:rentalId` [GET]
    - Get the particular rental object 
  
- #### Add new rental `/api/rentals` [POST]
    - request body : 
        | Parameter   | description |
        | ----------- | ------------
        | customerId   | objectId, required|
        | movieId   | objectId, required|

        
### Authorization route
This route is to verify the user credential for user signin purposes.

- #### Signin route `/api/auth` [POST]
     - This is a public route (no auth token required) 
     - request body : 
        | Parameter   | description |
        | ----------- | ------------
        |email | string , required|
        |password|string(min(5)), required|

### Return route
This route is for handling the information when user returns a movie.

- #### Add new rental `/api/returns` [POST]
    - request body : 
        | Parameter   | description |
        | ----------- | ------------
        | customerId   | objectId, required|
        | movieId   | objectId, required|

