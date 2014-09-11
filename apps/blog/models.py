from django.db import models
from django.db.models import permalink
from django.core.urlresolvers import reverse

#from djangocms_text_ckeditor.fields import HTMLField
#Editing this ^^ file that comes who the fuck knows from
from django.db import models
from django.contrib.admin import widgets as admin_widgets
from djangocms_text_ckeditor.html import clean_html
from djangocms_text_ckeditor.widgets import TextEditorWidget
try:
    from south.modelsinspector import add_introspection_rules
    add_introspection_rules([], ['^djangocms_text_ckeditor\.fields\.HTMLField'])
except ImportError:
    pass


class HTMLField(models.TextField):
    def formfield(self, **kwargs):
        defaults = {'widget': TextEditorWidget}
        defaults.update(kwargs)

        # override the admin widget
        if defaults['widget'] == admin_widgets.AdminTextareaWidget:
            defaults['widget'] = TextEditorWidget

        return super(HTMLField, self).formfield(**defaults)

#    def clean(self, value, model_instance):
#        value = super(HTMLField, self).clean(value, model_instance)
#        return clean_html(value, full=False)
#### End editing html field, it doesn't strip html anymore - sweet!!

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    #body = models.TextField()
    body = HTMLField(blank=True)
    posted = models.DateTimeField(db_index=True, auto_now_add=True)
    category = models.ForeignKey('blog.Category')
    

    class Meta:
        ordering = ['-posted']

    def __unicode__(self):
        return '%s' % self.title

    @permalink
    def get_absolute_url(self):
        return ('view_blog_post', None, { 'slug': self.slug })

class Category(models.Model):
    title = models.CharField(max_length=100, db_index=True)
    slug = models.SlugField(max_length=100, db_index=True)
    parent = models.ForeignKey('self', blank = True, null = True, related_name="children")
    
    class Meta:
    	verbose_name_plural = "Categories" #correct name in the admin
    	
    def __unicode__(self):
        return self.title    	
    
    @permalink
    def get_absolute_url(self):
                if self.parent:
                		return ('view_blog_category', None, { 'slug': self.slug, 'parent':self.parent.slug })
                else:
                        return ('view_blog_category', None, { 'slug': self.slug, 'parent':'main' })
