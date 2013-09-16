from django.conf.urls.defaults import *
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.conf import settings

admin.autodiscover()
from django.contrib.sites.models import Site
#admin.site.unregister(Site)
#from cms.stacks.models import Stack
#admin.site.unregister(Stack)

urlpatterns = i18n_patterns('',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^', include('cms.urls')),
)

if settings.DEBUG:
    urlpatterns = patterns('',
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
    url(r'', include('django.contrib.staticfiles.urls')),


#url(r'^profile/$', 'userprofile.views.user_profile'),


url(
    r'^post/(?P<slug>[^\.]+).html', 
    'apps.blog.views.view_post', 
    name='view_blog_post'),
url(
    r'^categories/(?P<parent>[-\w]+)/(?P<slug>[^\.]+).html', 
    'apps.blog.views.view_category', 
    name='view_blog_category'),
(r'^blog/', 'apps.blog.views.index'),

(r'^visionary/', 'visionary.views.visionary'),
(r'^login/', 'visionary.views.login'),
(r'^logout/', 'visionary.views.logout'),
(r'^signup/', 'visionary.views.signup'),

#(r'^saveState/', 'visionary.views.saveState'),
                           
(r'^saveState/', 'visionary.views.saveState'),
(r'^loadState/', 'visionary.views.loadState'),                           



                           

#url(
#    r'^ormind/post/(?P<slug>[^\.]+).html', 
#    'ormind.views.view_post', 
#    name='view_blog_post'),
#url(
#    r'^ormind/categories/(?P<slug>[^\.]+).html', 
#    'ormind.views.view_category', 
#    name='view_blog_category'),
#(r'^ormind/', 'ormind.views.ormind'),
#(r'^ckeditor/', include('ckeditor.urls')),

(r"^main/", "forum.views.main"),                           
(r"^forum/(\d+)/$", "forum.views.forum"),
(r"^thread/(\d+)/$", "forum.views.thread"),
#url(r'', include('forum.urls')),
(r"^post/(new_thread|reply)/(\d+)/$", "forum.views.post"),
(r"^reply/(\d+)/$", "forum.views.reply"),
(r"^profile/(\d+)/$", "forum.views.profile"),
(r"^new_thread/(\d+)/$", "forum.views.new_thread"),

(r"^users/", "forum.views.main"),                                                      
(r'^accounts/', include('registration.backends.simple.urls')),
                           
) + urlpatterns
