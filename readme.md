# AI Quiz Generator

## Overview
This project is a web application built with **FastAPI** and **Nextjs** that allows users to upload documents and generate a quiz based on their content. The application uses **LangChain**, **ChromaDB**, and **Ollama** embeddings to process documents and retrieve relevant answers through **Retrieval-Augmented Generation (RAG)**.

## Features
- Dynamically upload documents
- Process and split text into smaller chunks for improved retrieval
- Store document embeddings in **ChromaDB**
- Use **Ollama embeddings** for vector similarity search
- Generate a quiz with 8 questions based on the content
- Submit your answers and receive feedback

## Demo
<p align="center">
    <img src="./images/capture.png" width="450">
</p>

## Technologies Used
- **FastApi** (Backend Web Framework)
- **LangChain** (Document Processing & Retrieval)
- **ChromaDB** (Vector Database)
- **Ollama** (Embeddings for text retrieval)
- **NextJS** (Frontend Interface)
- **Unstructured.io** (Document Parsing)

## Installation

### Prerequisites
Before getting started, make sure you have the following installed:

- **Python 3.11** or later
- A virtual environment manager (e.g., `venv`, `virtualenv`)

### Steps to Install

1. Clone the repository:
    ```bash
    git clone https://github.com/OussamaBenSlama/Ollama-RAG-PDF
    ```

2. Navigate to the project directory:
    ```bash
    cd backend
    ```

3. Create a virtual environment (optional but recommended):
    ```bash
    python3 -m venv .venv
    ```

4. Activate the virtual environment:
    - On Windows:
      ```bash
      .\venv\Scripts\activate
      ```

5. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

6. Install **Ollama** and download the model:
    - First, ensure you have **Ollama** installed. If you haven't, you can get it from [ollama.com](https://ollama.com/).
    - Then, run the following command to download the **Llama3** model:
    ```bash
    ollama run llama3:latest
    ```
7. Set up and run the Next.js frontend:
    - Navigate to the `project` directory:
    ```bash
    cd project
    ```
    - Install the required dependencies for Next.js:
    ```bash
    npm install
    ```
    - Start the Next.js development server:
    ```bash
    npm run dev
    ```
    - The frontend will now be available at `http://localhost:3000`.

Once you've completed these steps, you're ready to use both the backend and frontend of the application.

Once you've completed these steps, you're ready to use the application.


## Usage

1. Upload a PDF file through the web interface.
2. The system will generate a quiz with 8 questions based on the content of the document.
3. Respond to each question in the quiz.
4. Submit your answers when you're finished.
5. Receive feedback on your responses.
