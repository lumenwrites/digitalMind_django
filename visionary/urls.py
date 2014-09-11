from django.conf.urls import *
from visionary.models import *

urlpatterns = patterns('',
                       (r'^visionary/', 'visionary.views.visionary'),
                       (r'^login/', 'visionary.views.login'),
                       (r'^logout/', 'visionary.views.logout'),
                       (r'^signup/', 'visionary.views.signup'),
                       
                       url(r'^addmap/', 
                           'visionary.views.add_map', 
                           name='add_mindmap'),
                       url(r'^renamemap/(?P<slug>[^\.]+).html', 
                           'visionary.views.rename_map', 
                           name='rename_mindmap'),                           
                       url(r'^deletemap/(?P<slug>[^\.]+).html', 
                           'visionary.views.delete_map', 
                           name='delete_mindmap'),
                       url(r'^savemap/(?P<slug>[^\.]+)', 
                           'visionary.views.save_map', 
                           name='save_mindmap'),                           
                       url(r'^map/(?P<slug>[^\.]+).html', 
                           'visionary.views.view_map', 
                           name='view_mindmap'),
                       url(r'^addsubscription/', 
                           'visionary.views.add_subscription', 
                           name='view_mindmap'),
                       url(r'^removesubscription/', 
                           'visionary.views.remove_subscription', 
                           name='view_mindmap'),
                       
                       (r'^saveState/', 'visionary.views.saveState'),
                       (r'^loadState/', 'visionary.views.loadState'),                           
)
