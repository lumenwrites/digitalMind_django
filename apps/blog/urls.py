from django.conf.urls import *
from apps.blog.models import *

urlpatterns = patterns('',
                       url(
                           r'^post/(?P<slug>[^\.]+)/$', 
                           'apps.blog.views.view_post', 
                           name='view_blog_post'),
                       url(
                           r'^post/(?P<slug>[^\.]+)', 
                           'apps.blog.views.view_post', 
                           name='view_blog_post'),                           
                       url(
                           r'^articles/(?P<slug>[^\.]+)/$', 
                           'apps.blog.views.view_category', 
                           name='view_blog_category'),
                       url(
                           r'^articles/(?P<slug>[^\.]+)', 
                           'apps.blog.views.view_category', 
                           name='view_blog_category'),                           
                       (r'^articles/', 'apps.blog.views.index'),
                       (r'^archives/', 'apps.blog.views.archives'),
)
