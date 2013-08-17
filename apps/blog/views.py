# Create your views here.

from apps.blog.models import Blog, Category
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse
from django.template import RequestContext

def index(request):
    return render_to_response('blog_template.html', {
        'categories': Category.objects.all(),
        'posts': Blog.objects.all()[:5]
    }, context_instance=RequestContext(request))

def view_post(request, slug):   
    return render_to_response('post.html', {
        'categories': Category.objects.all(),
        'post': get_object_or_404(Blog, slug=slug)
    }, context_instance=RequestContext(request))

def view_category(request, slug):
    category = get_object_or_404(Category, slug=slug)
    return render_to_response('categories.html', {
        'category': category,
        'posts': Blog.objects.filter(category=category)[:5]
    }, context_instance=RequestContext(request))
