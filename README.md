# TICKETS-ON-FLIQ

## System Requirements

You must have [NodeJS](https://nodejs.org/en/download/) and [MongoDB](https://docs.mongodb.com/manual/installation/) installed locally.

## Run Locally

Clone the project

```bash
  git clone https://github.com/charlesonunze/fliqpay
```

Go to the project directory

```bash
  cd fliqpay
```

Install dependencies

```bash
  npm install
```

Create an `.env` from the `.env.example` file and replace the values with your the values you prefer

Start the server

```bash
  npm start
```

Run tests

```bash
  npm run test
```

## API Docs:

API documentation can be found [here](https://documenter.getpostman.com/view/6617447/TzY68DeP)

## Features Not Implemented

- PASSWORD RESET FOR AGENTS: An admin should create a temp password, which is reset by the agent to complete the sign up process.

- AGENT HANDOVER: An agent should be able to refer the ticket to an agent who is more appropriate to attend to the customer as more information is gotten about the customer's request.

- DB TRANSACTIONS: For updating the comments and the ticket status when an agents comments for the first time, and rolling back if any of them fails.
