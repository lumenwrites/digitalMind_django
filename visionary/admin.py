from django.contrib import admin
from visionary.models import Mindmap

class MindmapAdmin(admin.ModelAdmin):
        list_display = ('name',)

admin.site.register(Mindmap, MindmapAdmin)    
