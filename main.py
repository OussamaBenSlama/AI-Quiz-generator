from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from model import get_answer
from langchain_community.document_loaders import UnstructuredPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from werkzeug.utils import secure_filename
from pydantic import BaseModel
import requests

app = FastAPI()


origins = [
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"], 
)

UPLOAD_DIR = "uploads"
ALLOWED_EXTENSIONS = {"pdf"}
os.makedirs(UPLOAD_DIR, exist_ok=True)

def allowed_file(filename):
    """Check if the file is a PDF."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.post("/post")
async def post_document_and_question(document: UploadFile = File(...)):
    """Handles POST request to upload a PDF and process questions."""
    if not allowed_file(document.filename):
        raise HTTPException(status_code=400, detail="File type not allowed. Only PDF files are accepted.")

    # Save the uploaded PDF file
    file_path = os.path.join(UPLOAD_DIR, secure_filename(document.filename))
    with open(file_path, "wb") as f:
        f.write(await document.read())
    loader = UnstructuredPDFLoader(file_path=file_path)
    data = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=7500, chunk_overlap=100)
    chunks = text_splitter.split_documents(data)
    question = """
    Based ONLY on the following context, generate a structured JSON containing multiple questions.
    Each question should be formatted as follows:
    
    {
      "questions": [
        {
          "id": <unique integer>,
          "text": "<question_text>",
          "format": "<question_type: QCM | yesNo | reponse_courte>",
          "options": {
            "option1": "<option_text_if_applicable>",
            "option2": "<option_text_if_applicable>",
            "option3": "<option_text_if_applicable>"
          },
          "correct_response": "<correct_answer>",
          "explanation": "<brief_explanation_of_the_answer>"
        }
      ]
    }

    Ensure:
    - "format" is either "QCM" (multiple-choice), "yesNo" (Yes/No), or "reponse_courte" (short response).
    - If "format" is "QCM", include 3 answer choices in "options".
    - Provide a relevant "explanation" for each question.
    - Maintain proper JSON structure.

    Generate at least **8 questions** relevant to the given context. Ensure the result is in JSON format.
    """
    print("loadin ...")
    answer = get_answer(question, chunks)
    try:
        answer_json = parse_answer_to_json(answer)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=f"Failed to parse AI response into JSON format: {e}")
    
    os.remove(file_path)
    
    return JSONResponse(content={"answer": answer_json})

def parse_answer_to_json(answer):
    try:
        return json.loads(answer)
    except json.JSONDecodeError:
        answer = answer.strip().strip("```json").strip("```")
        try:
            return json.loads(answer)
        except json.JSONDecodeError:
            raise ValueError("Failed to parse AI response into JSON format.")


class Question(BaseModel):
    id: int
    text: str
    format: str
    options: dict = {}
    correct_response: str
    explanation: str
    user_response: str

@app.post("/evaluate_questions")
async def evaluate_questions(questions: list[Question]):
    results = []
    
    for question in questions:
        result = {
            "id": question.id,
            "text": question.text,
            "user_response": question.user_response,
            "correct_response": question.correct_response,
            "format": question.format,
            "is_correct": False,
            "explanation": question.explanation
        }

        # Compare based on format type
        if question.format == "QCM" or question.format == "yesNo":
            # Normalize and compare the responses for QCM and yesNo
            if question.user_response.strip().lower() == question.correct_response.strip().lower():
                result["is_correct"] = True

        elif question.format == "reponse_courte":
            # Here you would compare using a semantic check (using llama or other methods)
            response = requests.post(
                "http://localhost:11434/api/chat",
                json={
                    "model": "llama3:latest",
                    "messages": [ 
                        {
                            "role": "user",
                            "content": f"Is the following user response similar to the correct response? {question.user_response} vs {question.correct_response} . return True or False only , just one word"
                        }
                    ],
                    "stream": False,
                    "options": {
                        "temperature": 0.3,
                        "seed": 101, 
                        "num_predict": 100,
                    }
                }
            )
            similarity_result = response.json()['message']['content']
            print(similarity_result)
            if similarity_result == 'True':
                result["is_correct"] = True

        results.append(result)

    return {"results": results}
