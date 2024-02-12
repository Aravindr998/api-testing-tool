# Postman Clone

This is an API testing tool built with Next.js 14. It supports various HTTP methods and body content types.

## Features

- Supports HTTP methods: GET, POST, PUT, PATCH, and DELETE.
- Allows adding headers and body to the requests.
- Supports JSON and form-data in the request body.
- Provides three options for the body:
  - Default: JSON key-value pairs in a table format.
  - form-data: Key-value pairs in a table format.
  - JSON: Can be written as JSON in the provided text editor.

## Installation

Ensure you have Node.js installed. Then run the following commands:

```bash
# Clone the repository
git clone https://github.com/Aravindr998/api-testing-tool.git

# Navigate to the project directory
cd postman-clone

# Install dependencies
npm install

# Start the development server
npm run dev

```
Open http://localhost:3000 with your browser to see the result.

## Usage
1. Select an HTTP method from the dropdown
2. Enter your API endpoint URL
3. Add headers if needed by clicking on the "Headers" tab
4. Chodode a body type: 
    - Default: Enter JSON key-value pairs in a table format
    - form-data: Enter key-value pairs in a table format
    - JSON: Write raw JSON in the provided text editor
5. Click Submit to send your request

## Scripts

In the project directory, you can run:
- ```npm run dev```: Runs the app in development mode
- ```npm run build```: Builds the app for production
- ```npm start```: Runs the built app in production mode.
- ```npm run lint```: Lints the codebase using ESLint according to Next.js conventions.

## Dependencies
This project is built using Next.js 14 with React 18 and other modern libraries for optimal performance and user experience. For more details about dependencies, refer to the package.json file or the documentation of the respective packages used in this project.

## Screenshots
![Screenshot 1](/screenshots/1.png)
![Screenshot 2](/screenshots/2.png)