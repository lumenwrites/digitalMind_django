from django.db import models
from django.db.models import permalink
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.template.defaultfilters import slugify

class State(models.Model):
    state = models.TextField()
    #links = models.TextField()
    user = models.ForeignKey(User)

    def __unicode__(self):
        return '%s' % self.title

class Mindmap(models.Model):
    user = models.ForeignKey(User)
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField()
    data = models.TextField()

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.slug = slugify(self.name)
        super(Mindmap, self).save(*args, **kwargs)
        
    @permalink
    def get_absolute_url(self):
        return ('view_mindmap', None, { 'slug': self.slug })
        
