from django.contrib import admin


from django.contrib import admin
from .models import Client, ChatMessage, UploadLink, UploadedFile

admin.site.register(Client)
admin.site.register(ChatMessage)
admin.site.register(UploadLink)
admin.site.register(UploadedFile)
