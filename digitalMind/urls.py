from django.conf.urls import *
from django.conf.urls.i18n import i18n_patterns
from django.conf import settings
from django.contrib import admin


admin.autodiscover()

# Unregister stuff from admin. Not sure where to put it.
# from django.contrib.sites.models import Site
# from cms.stacks.models import Stack
# admin.site.unregister(Site)
# admin.site.unregister(Stack)

urlpatterns = i18n_patterns('',
                            url(r'^admin/', include(admin.site.urls)),
                            url(r'^', include('cms.urls')),
                        )

urlpatterns = patterns('',
                       url(r'^media/(?P<path>.*)$', 'django.views.static.serve',
                           {'document_root': settings.MEDIA_ROOT, 'show_indexes': True}),
                       url(r'', include('django.contrib.staticfiles.urls')),
                       
                       url(r'', include('apps.blog.urls')),

                       url(r'', include('visionary.urls')),
                       
                       url(r'', include('forum.urls')),

                       url(r'^users/', 'forum.views.main_forum'),
                       
                       (r'^accounts/', include('registration.backends.simple.urls')),
                   ) + urlpatterns
