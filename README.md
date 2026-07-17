# Cybersecurity Education Platform

A web application helping users understand data breaches and online privacy policies. Built as a group project for COM2027 (Software Engineering) at the University of Surrey.

## My Contribution

I built the **home page** (`src/app/page.tsx`) and **quizzes pages** (`src/app/quizzes/`) of the frontend:

- Home page fetches live breach statistics from the HaveIBeenPwned API using React `useEffect` and `useState`, displaying the total number of accounts exposed across all known data breaches
- Quizzes pages render interactive quiz cards from local JSON data
- Used React Icons for visual indicators and Chart.js for data visualisation components
- Worked within a team of six on a trunk-based Git workflow with peer-reviewed merge requests on GitLab

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TypeScript |
| Styling | Tailwind CSS |
| Data Visualisation | Chart.js |
| Backend | Django REST Framework, PostgreSQL |
| Containerisation | Docker, Docker Compose, Nginx |

## Project Structure

## Running the Project

Requires Docker. From the `group10-project` directory:

```bash
docker-compose up --build
```

The frontend will be available at `http://localhost:80`.
