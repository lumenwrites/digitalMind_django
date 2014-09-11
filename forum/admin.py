from forum.models import *
from django.contrib import admin

class PostAdmin(admin.ModelAdmin):
    #exclude = ['posted']
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title',) #Display proper title    

class CategoryAdmin(admin.ModelAdmin):
    #exclude = ['posted']
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title',) #Display proper title    

class UserProfileAdmin(admin.ModelAdmin):
    #exclude = ['posted']
    #prepopulated_fields = {'slug': ('title',)}
    #list_display = ('title',) #Display proper title
    pass
    

    
admin.site.register(Post, PostAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(UserProfile, UserProfileAdmin)
