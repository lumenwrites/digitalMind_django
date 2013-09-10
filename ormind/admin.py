from django.contrib import admin
from ormind.models import OrmindBlog, OrmindCategory

class OrmindBlogAdmin(admin.ModelAdmin):
    #exclude = ['posted']
    prepopulated_fields = {'slug': ('title',)}

class OrmindCategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}

admin.site.register(OrmindBlog, OrmindBlogAdmin)
admin.site.register(OrmindCategory, OrmindCategoryAdmin)
