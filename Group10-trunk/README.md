## Running our project
- As per the coursework requirements, our project has been fully containerised in Docker.
- We have, as explained in the Final Audit Report, also provided a .bat file to run the Docker containers.
#### Running the batch file
- Ensure you are in the `/group10-project` directory.
- Run the batch file named `start-containers.bat`.
#### Running the containers if the batch file does not work
- We have tested the batch file across all our systems, and never encountered an issue.
- However, if you cannot get it working, here are the commands to run.
    1. Ensure Docker is running.
    2. Ensure you are in the same directory as the `docker-compose.yaml` file (this should be the `/group10-project` directory).
    3. Ensure there are no old, cached Docker images which could cause conflicts or undefined behaviour.
    4. Build the Docker images with `docker-compose build --no-cache`.
    5. Start hte Docker containers with `docker-compose up` (optionally including `-d` to start them in detached mode, if you want access to the CLI after running).
#### Viewing the frontend
- The frontend should be running on port 3000.