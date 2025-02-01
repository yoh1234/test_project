import os
import pdfplumber
import pytesseract
from PIL import Image
import openai
from openai import OpenAI
from dotenv import load_dotenv

from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

# env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "api", ".env")
load_dotenv()
# OpenAI API Key

def extract_text(file_path):
    """Extracts text from PDFs and images using OCR."""
    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
        return text

    elif file_path.endswith((".png", ".jpg", ".jpeg")):
        image = Image.open(file_path)
        return pytesseract.image_to_string(image)  # OCR for images
    
    return None

def summarize_text(text):
    """Summarizes text using OpenAI's ChatGPT API. Also, tell what kind of
    document is this. total 3 to 5 lines are ideal"""
    if len(text.split()) < 50:  # If text is too short, return as is
        return text
    
        # Initialize the OpenAI chat model with LangChain
    chat_model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    # Define the prompt template (you can adjust based on your requirements)
    template = """
    # You are a helpful legal assistant. 
    # Summarizes text using OpenAI's ChatGPT API. Also, tell what kind of
    document is this. 
    # total 3 to 5 lines are ideal.
    text: {text}
    """

    # Prepare the prompt
    chat_prompt = ChatPromptTemplate.from_messages([("user", template)])

    # Create a chain that takes user input and returns the response
    llm_chain = LLMChain(prompt=chat_prompt, llm=chat_model)

    ai_response = llm_chain.run({"text": text})

    print(ai_response)
    return ai_response

def check_requirements(summaries, requirements):
           # Initialize the OpenAI chat model with LangChain
    chat_model = ChatOpenAI(model="gpt-4o-mini", temperature=0)
    print(requirements)
    # Define the prompt template (you can adjust based on your requirements)
    template = f"""
    The following are requirements from lawyers:
    {requirements}.
    client uploaded their document for lawyers request.
    The given text is their document: "{summaries}"
    
    Identify which requirements are not furfilled (missing client document).
    
    
    """
    print(template)

    # Prepare the prompt
    chat_prompt = ChatPromptTemplate.from_messages([("user", template)])

    # Create a chain that takes user input and returns the response
    llm_chain = LLMChain(prompt=chat_prompt, llm=chat_model)

    ai_response = llm_chain.run({"summaries": summaries})

    return ai_response
