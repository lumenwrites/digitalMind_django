from django.contrib import admin
from apps.blog.models import Post, Category

class BlogAdmin(admin.ModelAdmin):
    #exclude = ['posted']
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title',) #Display proper title    

class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title',) #Display proper title

admin.site.register(Post, BlogAdmin)
admin.site.register(Category, CategoryAdmin)
