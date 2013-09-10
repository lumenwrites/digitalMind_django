from ormind.models import OrmindBlog, OrmindCategory
from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.contrib import auth
from django.core.context_processors import csrf


def ormind(request):
    message=''
    
    return render_to_response('ormind/blog.html',
                              {'message':message,
                               'categories': OrmindCategory.objects.all(),
                               'posts': OrmindBlog.objects.all()[:5],},
                              context_instance=RequestContext(request))

def view_post(request, slug):   
    return render_to_response('ormind/post.html', {
        'categories': OrmindCategory.objects.all(),
        'post': get_object_or_404(OrmindBlog, slug=slug)
    }, context_instance=RequestContext(request))

def view_category(request, slug):
    category = get_object_or_404(OrmindCategory, slug=slug)
    return render_to_response('ormind/categories.html', {
        'category': category,
        'categories': OrmindCategory.objects.all(),        
        'posts': OrmindBlog.objects.filter(category=category)[:5]
    }, context_instance=RequestContext(request))
    

