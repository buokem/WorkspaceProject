# Project Setup Guide

## Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the `server` folder**
   ```bash
   cd server
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Running the Server

To start the server, run:
```bash
node server.js
```

If you prefer to run the server with automatic restarts during development, use:
```bash
npm install -g nodemon
nodemon server.js
```

## Default Port
By default, the server will run on **http://localhost:3000** unless otherwise specified in your environment variables.
