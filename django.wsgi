import os
import sys
import site


sys.path.append('/root/digitalMind/')
sys.path.append('/root/digitalMind/digitalMind')
site.addsitedir('/root/digitalMind/venv/lib/python3.3/site-packages/')

os.environ['PYTHON_EGG_CACHE'] = '/root/digitalMind/.python-egg'
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()
