## Car Viewer API

---

### Local Setup

-   #### Prerequisite
    -   Please confirm that you have docker installed on your device
-   #### Steps

    -   Clone the repository
    -   Change the directory to the repository folder
    -   Add a `.env` file with the following variables <br/>

        ```ini
          BASE_URL= # your frontend app base url
          NODE_ENV="development"
          PORT=3000
          MONGODB_PORT=27017

          ACCESS_TOKEN_SECRET= # Follow the instruction for creating token section

          REFRESH_TOKEN_SECRET=# Follow the instruction for creating token section

          GAMIL_USER= # Your gmail address
          GMAIL_PASSWORD= # You gamil app password

          //DOCKER VARIABLES

          NODE_DOCKER_PORT=3000
          MONGODB_PREFIX=mongodb
          MONGODB_HOST=mongodb
          MONGODB_USER= # Your MongoDB username
          MONGODB_PASSWORD= # Your MongoDB password
          MONGODB_DATABASE= # Your database name
          MONGODB_DOCKER_PORT=27017
        ```

    -   Token creation: </br>
        If you have node installed then on your terminal perform the following commands
        ```shell
            node
            > require('crypto').randomBytes(64).toString('hex')
        ```
    -   Start the container <br/>
        on your terminal run the following command
        ```shell
        docker compose -f docker-compose.yml up
        ```
    -   To access the mongodb run the following command in the new terminal <br/>
        ```shell
        docker exec -it mongodb mongosh -u <username> -p <password> --authenticationDatabase admin
        ```
    -   To access the API documentation go to [https://localhost:3000/docs](https://localhost:3000/docs) on your browser
