from django.db import models
from django.db.models import permalink
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User
from django.db.models.signals import post_save

class State(models.Model):
    state = models.TextField()
    user = models.ForeignKey(User)

    def __unicode__(self):
        return '%s' % self.title
