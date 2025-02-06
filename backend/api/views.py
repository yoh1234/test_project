from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.views import APIView
from .serializers import UserSerializer,UploadedFileSerializer, ClientSerializer, ChatMessageSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import UploadLink, UploadedFile, Client, ChatMessage
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail
from django.http import JsonResponse
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.files.storage import default_storage
from django.utils.crypto import get_random_string
from django.utils.timezone import now, timedelta
from rest_framework.response import Response
from django.http import FileResponse, Http404
from django.contrib.auth import authenticate, login
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import user_passes_test
import boto3

import json
import uuid
import os

from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough

# import extract_text, summarize_text from "../components/summarize_text.py"
from components.summarize_text import summarize_text, extract_pdf_text, extract_image_text, check_requirements

from .faiss_index_manager import FAISSManager

from dotenv import load_dotenv
# faiss_manager = FAISSManager()
load_dotenv()


# class CreateUserView(generics.CreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [AllowAny]
@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({"error": "Username and password are required."}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({"error": "Username already taken."}, status=400)

        user = User.objects.create_user(username=username, password=password)
        user.is_active = False  # Lock account on signup
        user.save()

        return JsonResponse({"message": "Account created and locked. Await manual activation."})

    return JsonResponse({"error": "Invalid request method."}, status=405)


class ClientListCreate(generics.ListCreateAPIView):
    serializer_class = ClientSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print(self.request.data)
        user = self.request.user
        return Client.objects.filter(user=user)

    def perform_create(self, serializer):
        print("test1", "Request Data:")
        # if serializer.is_valid():
        #     serializer.save(user=self.request.user)
        # else:
        #     print(serializer.errors)
        serializer.save(user=self.request.user)
            
# class ClientDelete(generics.DestroyAPIView):
#     serializer_class = ClientSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         return Client.objects.filter(user=user)
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_client(request, client_id):
    try:
        # Fetch the client instance
        client = Client.objects.get(id=client_id)
        
        # Delete all files associated with this client (files are automatically deleted due to the CASCADE delete)
        client.files.all().delete()  # Manually delete associated files if needed
        
        # Delete the client record
        client.delete()

        return JsonResponse({"message": "Client and associated files deleted successfully"}, status=204)
    
    except Client.DoesNotExist:
        return JsonResponse({"error": "Client not found"}, status=404)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_file(request, file_id):
    try:
        client_file = UploadedFile.objects.get(id=file_id)
        client_file.file.delete() # This removes the file from storage
        client_file.delete()  # This removes the file from the database
        return JsonResponse({"message": "file deleted successfully"}, status=204)
    except UploadedFile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    # def post(self, request):
    #     serializer = UserSerializer(data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def send_email(request):
    try:
        # Extract the email data from the request body
        data = json.loads(request.body)
        email = data.get('email')
        message = data.get('message')

        # Your email sending logic
        subject = 'Message from Your Web App'
        body = f"Message: {message}\n\nBest regards,\nYour Company Name"

        print(email, message)
        send_mail(
            subject,
            body,
            'settings.EMAIL_HOST_USER',  # Sender's email
            [email],  # Recipient's email
            fail_silently=False,
        )

        return JsonResponse({"message": "Email sent successfully!"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

class GenerateUploadLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, client_id):
        try:
            data = json.loads(request.body)
            message = data.get('message')
            print(message, "------------------------------------------")
            client = Client.objects.get(id=client_id, user=request.user)
            upload_link = UploadLink.objects.create(client=client)
            upload_link.requirement_message = message # requirements from lawyers
            upload_link.save()
            # link_url = os.environ['FRONT_UPLOAD_URL'] + f"{upload_link.unique_link}/"
            link_url = os.path.join(os.environ.get("FRONTEND_URL"), 'upload/', f"{upload_link.unique_link}/")
            subject = 'Message from Your Lawyer'
            body = f"""

                {message}

                To upload your files (PDF recommended), please visit the following link (expires in 24 hours):
                {link_url}

            """
            print("now send email")
            # Send the email
            send_mail(
                subject,
                body,
                'settings.EMAIL_HOST_USER',  # Sender's email
                [client.email],  # List of recipient emails
                fail_silently=False,  # Will raise an exception if the email can't be sent
            )

            return Response({"message": "Upload link sent successfully!"}, status=status.HTTP_200_OK)
        except Client.DoesNotExist:
            return Response({"error": "Client not found"}, status=404)

# class FileUploadView(generics.CreateAPIView):
#     def post(self, request, unique_link):
#         if request.method == 'POST':
#             try:
#                 client_link = ClientLink.objects.get(unique_link = unique_link, is_expired = False)
#                 if now() > client_link.expiration_date:
#                     client_link.is_expired = True
#                     client_link.save()
#                     return JsonResponse({'error': "Link has expired."}, status = status.HTTP_400_BAD_REQUEST)
                
#                 # Check if file is present in the request
#                 if 'file' not in request.FILES:
#                     return JsonResponse({'error': 'No file provided.'}, status=400)
                
#                 uploaded_file = request.FILES['file']
#                 FileUpload.objects.create(client_link = client_link, uploaded_file = uploaded_file)
                
#                 if uploaded_file.content_type not in ['application/pdf', 'image/jpeg']:
#                     raise ValidationError("Invalid file type. Only PDF and JPG are allowed.")
                
#                 # Save the file to a storage system (default Django storage in this case)
#                 file_path = default_storage.save(uploaded_file.name, uploaded_file)

#                 return JsonResponse({"message": "File uploaded successfully!", "file_path": file_path}, status=200)

#             except ValidationError as e:
#                 return JsonResponse({"error": str(e)}, status=400)
#             except Exception as e:
#                 return JsonResponse({"error": str(e)}, status=500)

class UploadFileView(APIView):
    
    permission_classes = [AllowAny]
    
    def post(self, request, unique_link):
        
        upload_link = get_object_or_404(UploadLink, unique_link = unique_link, is_active=True)

        
        files = request.FILES.getlist('files')
        extracted_texts = []
        summaries = ""
        uploaded_files = []
        
        # upload_link = UploadLink(unique_link = unique_link)
        requirements = upload_link.requirement_message

        for file in files:
            print("start file")
            uploaded_file = UploadedFile.objects.create(client=upload_link.client, file=file)
            uploaded_file.save()
            
            print(os.path.join(settings.BASE_DIR, str(uploaded_file.file)))
            # file_path = os.path.join(settings.BASE_DIR, str(uploaded_file.file))
            # file_path = os.path.join(os.environ['BASE_DIR'], str(uploaded_file.file))
            file_path = uploaded_file.file.path
            print("file_path_done")
            extracted_text = ""
            if file_path.endswith(".pdf"):
                extracted_text = extract_pdf_text(file_path)
                
            if extracted_text == "":
                extracted_text = extract_image_text(file_path)
                
                
            print("extracted_text: ", extracted_text)
            
            # if extracted_text:
            print("text is successfully extracted")
            extracted_texts.append(extracted_text)
            summary = summarize_text(extracted_text)
            uploaded_file.summary_text = summary
            uploaded_file.save()
            summaries += summary
            uploaded_files.append(uploaded_file)
        
        ai_check_requirements = check_requirements(summaries, requirements)
        
        print(ai_check_requirements)
        serializer = UploadedFileSerializer(uploaded_files, many=True)  
        
        return Response({"data": serializer.data, "extracted_texts":extracted_texts, "summaries": summaries, "ai_response": ai_check_requirements})


class FileDownloadView(APIView):
    
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        
        uploaded_file = UploadedFile.objects.get(id=file_id)
        # file_path = os.path.join(settings.MEDIA_ROOT, uploaded_file.file.path)
        file_path = uploaded_file.file.path
        file_name = uploaded_file.file.name.split("/")[-1]

        response = FileResponse(open(file_path, 'rb'), as_attachment=True)
        return response
        # print(file_path)
        # if os.path.exists(file_path):
        #     return FileResponse(open(file_path, 'rb'), as_attachment=True)
        # return Response({"error": "File not found"}, status=status.HTTP_404_NOT_FOUND)
        # file_obj = get_object_or_404(UploadedFile, id=file_id)

        # # Ensure the user has permission to access the file
        # # if file_obj.client not in request.user.assigned_clients.all():
        # #     return Response({"error": "Unauthorized"}, status=403)

        # try:
        #     response = FileResponse(file_obj.file.open(), as_attachment=True, filename=file_obj.file.name)
        #     return response
        # except FileNotFoundError:
        #     raise Http404("File not found")  

class ClientFilesView(generics.ListAPIView):
    serializer_class = UploadedFileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Returns files uploaded by a specific client."""
        client_id = self.kwargs['client_id']
        return UploadedFile.objects.filter(client_id=client_id)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def chat_with_bot(request, client_id):
    
    user_input = request.data.get('message')
    if not user_input:
        return Response({"error": "Message cannot be empty"}, status=400)
    print(user_input)
    embedder = HuggingFaceEmbeddings(
    model_name = "sentence-transformers/all-MiniLM-L6-v2"
    )

    # print(settings.BASE_DIR)
    # os.path.join(settings.BASE_DIR,"/api/faiss_index")
    vectorstore = FAISS.load_local("/mnt/data", embedder, allow_dangerous_deserialization=True)
    # vectorstore = faiss_manager.vectorstore
    # vectorstore = FAISS.load_local("./faiss_index", embedder, allow_dangerous_deserialization=True)
    retriever = vectorstore.as_retriever(
        search_kwargs={"k": 5},
    )
    # print("vectorstore loaded")
    # Initialize the OpenAI chat model with LangChain
    # chat_model = ChatOpenAI(model="gpt-4o-mini", temperature=0)

#     query_vector = embedder.encode(user_input)
#     print(query_vector)
#   # Replace with actual input data
#     results = faiss_manager.search(query_vector, k=3)
    print("start")
    uploaded_files = UploadedFile.objects.filter(id=client_id)
    # Combine all summaries into one large chunk of text
    summaries = " ".join(uploaded_file.summary_text for uploaded_file in uploaded_files)
    print(summaries)

#     print(results)
    # Define the prompt template (you can adjust based on your requirements)
    prompt = PromptTemplate.from_template(
    #     """You are an legal research assistant for question-answering tasks. 
    # You use the following pieces of retrieved context and summary of evidence uploaded by client to answer the legal question.
    # For simple problem, briefly answer their questions, however, you have to use given context and give them similar case example to answer.
    # If user ask details of similar case law, use bullet point to elaborate following: 
    
    # You can asnwer based on your analysis, but you have to explain the reason based on the real legal case law I gave you. 
    # For example, if you mention Age Discrimination in Employment Act (ADEA) at the beginning, you have to find ADEA information from the context.
    # before writing plaintiff's claim, make blank gaps between paragraphs.
    f"summariesof evidence: {summaries} " + """You are a Legal Assistant AI designed to retrieve and summarize court opinions. Your task is to find similar employment termination cases based on given context and question and evidence summary, analyze the provided court opinion and extract the most crucial information. Follow these steps:
    
    Identify the Case: Provide the case name, citation, court, and date of decision.

    Summarize the Facts: Briefly describe the relevant facts of the case.

    State the Legal Issue: Identify the central legal question or issue the court addressed.

    Explain the Court’s Decision:

    What was the holding (e.g., affirmed, reversed, remanded)?

    Summarize the court’s reasoning and key legal principles relied upon.

    Highlight the Legal Significance: Explain why the case is important or how it impacts the law.

    Output Format:

    Case: [Case name and citation]

    Court: [Court name]

    Date: [Date of decision]

    Facts: [Brief summary of relevant facts]

    Issue: [Central legal question]

    Holding: [Court’s decision]

    Reasoning: [Summary of the court’s analysis]

    Significance: [Why the case matters]
    
    Note: You could add your brief opinions and analysis before and after this format.

    Example:

    Case: Miranda v. Arizona, 384 U.S. 436 (1966)

    Court: U.S. Supreme Court

    Date: June 13, 1966

    Facts: Ernesto Miranda was arrested and interrogated by police without being informed of his right to remain silent or his right to an attorney. He confessed during the interrogation, and his confession was used as evidence at trial.

    Issue: Whether statements made by a defendant during police interrogation are admissible if the defendant was not informed of their constitutional rights.

    Holding: The Supreme Court held that the Fifth Amendment requires law enforcement to inform suspects of their rights before interrogation.

    Reasoning: The Court ruled that the Fifth Amendment’s protection against self-incrimination applies to police interrogations. Suspects must be informed of their rights, including the right to remain silent and the right to an attorney, to ensure their statements are voluntary.

    Significance: The decision established the “Miranda rights,” which are now a standard part of police procedure in the United States.

    Now, retrieve and summarize the following court opinion: [Insert court opinion text or document]."

    
    #Context: 
    {context}
    
    #Question:
    {question}

    #Answer:"""
    )
    
    print("prompt ready")
    llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0)
    print("llm ready")
    chain = (
        {"context": retriever,"question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
    print("chain ready")
    # Prepare the prompt
    # chat_prompt = ChatPromptTemplate.from_messages([("user", template)])

    # Create a chain that takes user input and returns the response
    # llm_chain = LLMChain(prompt=chat_prompt, llm=chat_model)

    # bot_response = llm_chain.run({"user_input": user_input})
    print("llm start")
    bot_response = chain.invoke(user_input)
    
    user = request.user
    client = Client.objects.get(id=client_id)
    # response = openai.ChatCompletion.create(
    #     model="gpt-4o-mini",
    #     messages=[{"role": "user", "content": user_input}]
    # )

    # bot_response = response['choices'][0]['message']['content']

    # chat_message = ChatMessage.objects.create(user = user, client = client, user_message=user_input, bot_response=bot_response)
    chat_message = ChatMessage.objects.create(user = user, 
                                              client = client, 
                                              user_message=user_input, 
                                              bot_response=bot_response,
                                              role = 'bot',
                                              content = bot_response
                                              )
    serializer = ChatMessageSerializer(chat_message)

    return Response(serializer.data)

@permission_classes([IsAuthenticated])
def get_chat_messages(request, client_id):
    """Retrieve chat history for a specific client."""
    chat_messages = ChatMessage.objects.filter(client_id=client_id).order_by("timestamp")
    return JsonResponse(list(chat_messages.values("role", "content")), safe = False)
# @permission_classes([IsAuthenticated])
# def get_chat_messages(request, client_id):
#     """Retrieve chat history for a specific client."""
#     user = request.user
#     chat_messages = ChatMessage.objects.filter(client_id=client_id).order_by("timestamp")
#     print(chat_messages)
#     data = [
#         {
#             "id": msg.id,
#             "user_message": msg.user_message,
#             "bot_response": msg.bot_response,
#             "timestamp": msg.timestamp.strftime("%Y-%m-%d %H:%M:%S")
#         }
#         for msg in chat_messages
#     ]

#     return JsonResponse(data, safe=False)