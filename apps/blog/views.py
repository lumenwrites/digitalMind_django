# Create your views here.

from apps.blog.models import Post, Category
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse
from django.template import RequestContext
from itertools import chain

def index(request):
    return render_to_response('blog_template.html', {
        'categories': Category.objects.all(),
        'posts': Post.objects.all()[:5]
    }, context_instance=RequestContext(request))

def view_post(request, slug):   
    return render_to_response('post.html', {
        'categories': Category.objects.all(),
        'post': get_object_or_404(Post, slug=slug)
    }, context_instance=RequestContext(request))

def view_category(request, slug, parent):
    category = get_object_or_404(Category, slug=slug)
    subcategories = category.children.all()
    category_posts = Post.objects.filter(category=category)[:5]	
    posts=list()
    for subcategory in subcategories:
    	subcategory_posts = Post.objects.filter(category=subcategory)[:5]
    	posts = list(chain(subcategory_posts, posts))
    posts = list(chain(posts, category_posts))
#    posts.append(Post.objects.filter(category=subcategories)[:5])
	    
    return render_to_response('blog_template.html', {
    	'categories': Category.objects.all(),
        'category': category,
        'posts': posts
    }, context_instance=RequestContext(request))
