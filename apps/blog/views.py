# Create your views here.
from apps.blog.models import Post, Category
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse
from django.template import RequestContext
from itertools import chain
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from forum.models import UserProfile
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
import math

@csrf_exempt
class RegisterForm(UserCreationForm):
    email = forms.EmailField(label = "Email")
    #fullname = forms.CharField(label = "First name")

    def __init__(self, *args, **kwargs):
        super(RegisterForm, self).__init__(*args, **kwargs)

        for fieldname in ['username', 'email',]:
            self.fields[fieldname].help_text = None
            
    class Meta:
        model = User

        fields = ("username", "email", )

def save(self, commit=True):
        user = super(RegisterForm, self).save(commit=False)
        first_name, last_name = self.cleaned_data["fullname"].split()
        user.first_name = first_name
        user.last_name = last_name
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user        

def index(request):
    c = {}
    c.update(csrf(request))
    args = {}
    args.update(csrf(request))
    args['form'] = "a"#RegisterForm()

    page = 1
    try: page = int(request.GET.get("page", '1'))
    except ValueError: page = 1
    
    return render_to_response('blog_template.html', {
        'categories': Category.objects.all(),
        'posts': Post.objects.all()[5*(page-1):5*page],
        'form':args['form'],
        'numberOfPages': range(1,math.ceil(len(Post.objects.all())/5)+1,1),
    }, context_instance=RequestContext(request))

def archives(request):
    c = {}
    c.update(csrf(request))
    args = {}
    args.update(csrf(request))
    args['form'] = "a"#RegisterForm()

    page = 1
    try: page = int(request.GET.get("page", '1'))
    except ValueError: page = 1
    
    return render_to_response('archives.html', {
        'categories': Category.objects.all(),
        'posts': Post.objects.all()[50*(page-1):50*page],
        'form':args['form'],
        'numberOfPages': range(1,math.ceil(len(Post.objects.all())/50)+1,1),
    }, context_instance=RequestContext(request))    

def view_post(request, slug):
    template = 'post.html'
    post = get_object_or_404(Post, slug=slug)
    if post.category.slug == 'bitvid':
        template = 'bitvid_post.html'

    return render_to_response(template, {
        'categories': Category.objects.all(),
        'post': post
    }, context_instance=RequestContext(request))

def view_category(request, slug): #, parent):
    category = get_object_or_404(Category, slug=slug)
    subcategories = category.children.all()
    category_posts = Post.objects.filter(category=category)#[:5]	
    posts=list()

    page = 1
    try: page = int(request.GET.get("page", '1'))
    except ValueError: page = 1

    
    for subcategory in subcategories:
    	subcategory_posts = Post.objects.filter(category=subcategory)#[:5]
    	posts = list(chain(subcategory_posts, posts))
    posts = list(chain(posts, category_posts))
#    posts.append(Post.objects.filter(category=subcategories)[:5])


    return render_to_response('blog_template.html', {
    	'categories': Category.objects.all(),
        'category': category,
        'posts': posts[5*(page-1):5*page],
        'numberOfPages': range(1,math.ceil(len(posts)/5)+1,1),        
    }, context_instance=RequestContext(request))
