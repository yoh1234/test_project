from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [

    path("clients/", views.ClientListCreate.as_view(), name="note-list"),
    path("clients/delete/<int:client_id>/", views.delete_client, name="delete-note"),
    path("client-files/<int:client_id>/", views.ClientFilesView.as_view(), name="client-files"),  # Files for a specific client
    path('send-email/', views.send_email, name='send_email'),
    path('send-link/<int:client_id>/', views.GenerateUploadLinkView.as_view(), name='send-link'),
    path('upload/<uuid:unique_link>/', views.UploadFileView.as_view(), name='upload-file'),
    path('download/<int:file_id>/', views.FileDownloadView.as_view(), name='download-file'),
    path('files/delete/<int:file_id>/', views.delete_file, name='download-file'),
    path('chat/<int:client_id>/', views.chat_with_bot, name="chat_with_bot"),
    path('chat-history/<int:client_id>/', views.get_chat_messages, name="get_chat_messages"),
    
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)