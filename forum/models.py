from django.db import models
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.template.defaultfilters import slugify
from django.db.models import permalink
from django.db.models.signals import post_save

        
class Post(models.Model):
    title = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(unique = True) # remove unique? Update reply titles.

    author = models.ForeignKey(User, related_name='created_posts', default=54)
    category = models.ForeignKey('forum.Category', blank=True, null=True, default=1)
    parent = models.ForeignKey('self', blank=True, null=True, related_name = 'children')
    #children_num = models.IntegerField(default=1)    

    rating = models.IntegerField(default=0)
    voters = models.ManyToManyField(User, related_name='liked_posts', blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    changed_at = models.DateTimeField(auto_now=True)
        
    content = models.TextField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.title)
        super(Post, self).save(*args, **kwargs)

    @permalink
    def get_absolute_url(self):
        return ('view_forum_post', None, { 'slug': self.slug })        

    def __str__(self):
        return self.title

class Category(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField()    

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.title)
        super(Category, self).save(*args, **kwargs)

    def get_absolute_url(self):
        return reverse('posts:post_detail', args=(self.id,))

    @permalink
    def get_absolute_url(self):
        return ('view_forum_category', None, { 'slug': self.slug })        

        
    def __str__(self):
        return self.title

class UserProfile(models.Model):
    user = models.ForeignKey(User, unique=True, related_name = 'profile')

    rating = models.IntegerField(default=1)
    avatar = models.ImageField("Profile Pic", upload_to="images/", blank=True, null=True)

    posts = models.IntegerField(default=0)

    #subscription = models.CharField(default="none", max_length=100)
    #created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.user)

def create_user_profile(sender, **kwargs):
    """When creating a new user, make a profile for him."""
    u = kwargs["instance"]
    if not UserProfile.objects.filter(user=u):
        UserProfile(user=u).save()

post_save.connect(create_user_profile, sender=User)
