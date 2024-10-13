# Fitness Assessment Reporting Tool - Backend

This is the backend portion of the Fitness Assessment Reporting Tool, built using **FastAPI** and **Python**. The backend handles data storage, user authentication, and provides APIs for the frontend to interact with the fitness assessment data.

## Table of Contents

-   [Fitness Assessment Reporting Tool - Backend](#fitness-assessment-reporting-tool---backend)
    -   [Table of Contents](#table-of-contents)
    -   [Project Overview](#project-overview)
    -   [Requirements](#requirements)
    -   [Installation Guide](#installation-guide)
        -   [1. Obtain a Secret Key](#1-obtain-a-secret-key)
        -   [2. Create a .env File](#2-create-a-env-file)
        -   [3. Clone the Repository](#3-clone-the-repository)
        -   [4. Install Dependencies](#4-install-dependencies)
        -   [5. Start the Development Server](#5-start-the-development-server)
    -   [Available Scripts](#available-scripts)
    -   [Other Useful FastAPI Tips](#other-useful-fastapi-tips)

## Project Overview

This tool serves the Sport and Exercise Science students at UWA by providing a secure backend for logging fitness assessments, storing data, and generating reports. The backend ensures data integrity and provides APIs for the frontend to interact with.

## Requirements

Before starting, ensure you have the following installed on your machine:

-   **Python** (version 3.8 or later)
-   **pip** (Python package installer)

## Installation Guide

### 1. Obtain a Secret Key

Go to this website to obtain a random 32 Digit Hex Code:
[Random 32 Digit Hex Code Generator](https://numbergenerator.org/random-32-digit-hex-codes-generator)

### 2. Create a .env File

Create a file named `.env` in the current directory (backend).

Add the following line in the `.env` file:

```
SECRET_KEY='your_secret_key'
```

Replace 'your_secret_key' with the HEX Code generated from step 1. Make sure to keep the HEX Code within the single quotes.

### 3. Clone the Repository

**Skip this step if you have already cloned the repository (from the front-end README).**
Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/Martin-EvansUWA/FitnessAssessmentReportingTool.git
```

Navigate to the back-end directory:

```bash
cd back-end
```

### 4. Install Dependencies

To install the required Python packages, use the following command:

```
pip install -r requirements.txt
```

This command will download and install all necessary dependencies listed in the requirements.txt file, ensuring that the project can run smoothly.

If you encounter any issues with admin permissions, you may need to run the command with elevated privileges (e.g., using `sudo` on Unix-based systems).

### 5. Start the Development Server

Once the dependencies are installed, you can start the FastAPI server:

```
uvicorn main:app --reload
```

This will start the FastAPI server, and you should be able to access the API documentation in your browser at:

```
http://localhost:8000/docs
```

The server will automatically reload when you make changes to the code, allowing for quick and easy development.

## Available Scripts

In the project directory, you can run the following scripts:

-   `uvicorn main:app --reload`: Starts the FastAPI server in development mode.
-   `pytest`: Runs the test suite.

## Other Useful FastAPI Tips

-   **Interactive API Documentation:** FastAPI provides interactive API documentation using Swagger UI, accessible at `/docs`.
-   **Automatic Data Validation:** FastAPI automatically validates request data using Pydantic models.
-   **Asynchronous Support:** FastAPI supports asynchronous request handling for better performance.

For more information, refer to the [FastAPI documentation](https://fastapi.tiangolo.com/) and [Python documentation](https://docs.python.org/3/).
