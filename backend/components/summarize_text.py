import os
import pdfplumber
import pytesseract
from PIL import Image
import easyocr
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

def extract_pdf_text(file_path):
    """Extracts text from PDFs and images using OCR."""
    with pdfplumber.open(file_path) as pdf:
        text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    return text

def extract_image_text(file_path):
    reader = easyocr.Reader(['en'])  # 'en' is for English; you can add other languages if needed.
    # Perform OCR to extract text
    result = reader.readtext(file_path)
    # Combine the text from the result
    text = " ".join([item[1] for item in result])
    return text  # OCR for images
    

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
    
    Say that your upload is completed if summaries is similar to the lawyers' requirements.
    If there is no similar file summaries, Identify which requirements are not furfilled (missing client document).
    
    
    """
    print(template)

    # Prepare the prompt
    chat_prompt = ChatPromptTemplate.from_messages([("user", template)])

    # Create a chain that takes user input and returns the response
    llm_chain = LLMChain(prompt=chat_prompt, llm=chat_model)

    ai_response = llm_chain.run({"summaries": summaries})

    return ai_response
