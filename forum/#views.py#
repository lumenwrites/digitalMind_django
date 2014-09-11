import datetime
from django.utils.timezone import utc

from django.shortcuts import render, get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse

from django.contrib.auth.decorators import login_required

from forum.models import Post, Category
from forum.forms import PostForm, ReplyForm
from django.views.decorators.csrf import csrf_exempt,ensure_csrf_cookie


def score(post, gravity=1.8, timebase=120):
    number_of_replies = len(post.children.all())
    rating = (post.rating + number_of_replies + 1)**0.8
    now = datetime.datetime.utcnow().replace(tzinfo=utc)
    age = int((now - post.created_at).total_seconds())/60

    return rating/(age+timebase)**1.8

def top_posts(top=180, consider=1000, category_slug=None):
    posts = Post.objects.all().filter(parent = None)
    if category_slug:
        category_id = Category.objects.get(slug=category_slug).id
        posts = posts.filter(category=category_id)
    latest_posts = posts.order_by('-created_at')#[:consider]
    #comprehension, posts with rating, sorted
    posts_with_rating = [(score(post), post) for post in latest_posts]
    ranked_posts = sorted(posts_with_rating, reverse = True)
    #strip away the rating and return only posts
    return [post for _, post in ranked_posts][:top]

def rank_by_rating(timespan = None):
    posts = Post.objects.all().filter(parent = None)

    if timespan == "day":
        day = datetime.datetime.utcnow().replace(tzinfo=utc).__getattribute__('day')
        posts = posts.filter(created_at__day = day)        
    elif timespan == "month":
        month = datetime.datetime.utcnow().replace(tzinfo=utc).__getattribute__('month')
        posts = posts.filter(created_at__month = month)        
    elif timespan == "all-time":
        year = datetime.datetime.utcnow().replace(tzinfo=utc).__getattribute__('year')
        posts = posts.filter(created_at__year = year)                
    
    top_posts = posts.order_by('-rating')
    return top_posts


@ensure_csrf_cookie
def main_forum(request):
    #posts = Post.objects.all().filter(parent = None)
    posts = top_posts(top=32)

    if request.user.is_authenticated():
        liked_posts = request.user.liked_posts.filter(id__in=[post.id for post in posts])
    else:
        liked_posts = []
    #add number of replies
    #len(Post.objects.get(slug='cool-topic').children.all())
    #for post in posts:
    #	replies = len(post.children.all())


    categories = Category.objects.all()
    return render(request, 'forum/forum.html',{
        'posts' : posts,
        'liked_posts':liked_posts,
        'categories':categories,
    })

def view_category(request,slug):
    posts = top_posts(top=32, category_slug = slug)

    if request.user.is_authenticated():
        liked_posts = request.user.liked_posts.filter(id__in=[post.id for post in posts])
    else:
        liked_posts = []

    categories = Category.objects.all()
    return render(request, 'forum/forum.html',{
        'posts' : posts,
        'liked_posts':liked_posts,
        'categories':categories,
        'categoryTitle': Category.objects.get(slug=slug).title,
        'currentCategory': Category.objects.get(slug=slug),
    })    

def view_top(request,slug):
    posts = rank_by_rating(timespan = slug)

    if request.user.is_authenticated():
        liked_posts = request.user.liked_posts.filter(id__in=[post.id for post in posts])
    else:
        liked_posts = []

    categories = Category.objects.all()
    return render(request, 'forum/forum.html',{
        'posts' : posts,
        'liked_posts':liked_posts,
        'categories':categories,
        'timespan':slug,
    })    
    

def view_post(request, slug):
    post = get_object_or_404(Post, slug=slug)
    replies = Post.objects.all().filter(parent=post.id)
    return render(request, 'forum/view_post.html',{
        'post' : post,
        'replies' : replies,        
    })

def submit_post(request):
    if request.method == 'POST':
        form = PostForm(request.POST)
        if form.is_valid():
            f = form.save(commit = False)
            if request.user.is_authenticated():
                f.author = request.user
            f.save()

            return HttpResponseRedirect('/forum/post/' + f.slug + '/')
    else:
        form = PostForm()
    return render(request, 'forum/submit_post.html',{'form': form})        


def submit_reply(request, slug):
    parent = Post.objects.get(slug = slug)

    if request.method == 'POST':
        form = ReplyForm(request.POST)
        if form.is_valid():
            reply = form.save(commit = False)
            reply.parent = parent
            #add number of parent children to not clash titles
            reply.title = 'Re('+ str(len(parent.children.all())) + '): ' + parent.title 
            if request.user.is_authenticated():
                reply.author = request.user            
            reply.save()            
        return HttpResponseRedirect('/forum/post/' + parent.slug + '/')

    else:
        form = ReplyForm()
    return render(request, 'forum/submit_reply.html',{'form': form,
                                                     'slug': parent.slug})
@csrf_exempt
def vote_up(request):
    post = get_object_or_404(Post, pk=request.POST.get('post_id'))
    author = post.author.profile.get()
    post.rating += 1
    author.rating +=1
    post.save()
    author.save()
    
    user = request.user
    user.liked_posts.add(post)
    user.save()
    return HttpResponse()
    
@csrf_exempt
def vote_down(request):
    post = get_object_or_404(Post, pk=request.POST.get('post_id'))
    author = post.author.profile.get()    
    post.rating -= 1
    author.rating -=1    
    post.save()
    author.save()
    
    user = request.user
    user.liked_posts.remove(post)
    user.save()
    return HttpResponse()
    
