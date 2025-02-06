from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UploadLink, UploadedFile, Client, ChatMessage


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id','name', 'email', 'created_at']
        read_only_fields = ['user']
        

class UploadedFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = UploadedFile
        fields = ['id', 'file', 'uploaded_at', 'summary_text']
        
    # def get_file_name(self, obj):
    #     # Extract the file name without the "uploads/" part
    #     return obj.file.name.split('uploads/')[1] if 'uploads/' in obj.file.name else obj.file.name
# class UploadLinkSerializer(serializers.ModelSerializer):
#     files = UploadedFileSerializer(many=True, read_only=True)
#     class Meta:
#         model = UploadLink
#         fields = ['id', 'unique_link', 'created_at', 'files']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'user_message', 'bot_response', 'role', 'content', 'timestamp']
