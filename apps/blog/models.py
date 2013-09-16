from django.db import models
from django.db.models import permalink
from django.core.urlresolvers import reverse

# Create your models here.

class Post(models.Model):
    title = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    body = models.TextField()
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