from django.conf.urls import *
from forum.models import *

urlpatterns = patterns('',
    # vote
    url(
        r'^forum/vote-up/', 
        'forum.views.vote_up'),
    url(
        r'^forum/vote-down/', 
        'forum.views.vote_down'),                       
                       
    # submit reply
    url(
        r'^forum/reply/(?P<slug>[^\.]+)/', 
        'forum.views.submit_reply', 
        name='view_forum_post'),                       

    # submit new post
    (r"^forum/submit/", "forum.views.submit_post"),

    url(
        r'^forum/post/(?P<slug>[^\.]+)/$', 
        'forum.views.view_post', 
        name='view_forum_post'),

    #top
    url(
        r'^forum/top/(?P<slug>[^\.]+)/$', 
        'forum.views.view_top', 
        name='view_forum_top'),                       

    #category
    url(
        r'^forum/(?P<slug>[^\.]+)/$', 
        'forum.views.view_category', 
        name='view_forum_category'),                       

    (r"^forum/post/", "forum.views.view_post"),                           
    (r"^forum/", "forum.views.main_forum"),
)
