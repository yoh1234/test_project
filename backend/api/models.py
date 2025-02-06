from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now, timedelta
import uuid

def file_upload_path(instance, filename):
    return f"uploads/{instance.client.id}/{filename}"

class Client(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='clients')
    name = models.CharField(max_length=255)
    email = models.EmailField(null=True, max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
class UploadLink(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name="upload_links", default=1)
    unique_link = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    requirement_message = models.TextField(default=" ")
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Link {self.unique_link} by {self.user.username}"

class UploadedFile(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='files')
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    summary_text = models.TextField(default="No summary available")

    def __str__(self):
        return self.file.name

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_user')
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='chat_client')
    role = models.CharField(default = "") # "user" or "bot" 
    user_message = models.TextField(default="")
    bot_response = models.TextField(default="")
    content = models.TextField(default = "")
    timestamp = models.DateTimeField(auto_now_add=True)