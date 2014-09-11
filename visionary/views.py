from django.http import HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.http import HttpResponseRedirect
from django.contrib import auth
from django.core.context_processors import csrf
from django.contrib.auth.forms import UserCreationForm
from django import forms
from django.contrib.auth.models import User
from visionary.models import State
from visionary.models import Mindmap
from forum.models import UserProfile
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.template.defaultfilters import slugify

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


def visionary_old(request):
    c = {}
    c.update(csrf(request))
    #message = 'this is demo version. signup to be able to save changes.>>>>>'
    message = ''
    signedin = 0
    if request.user.is_authenticated():
        message = ''
            
    args = {}
    args.update(csrf(request))
    args['form'] = RegisterForm()

    state = 'empty'
    #s, created=State.objects.get_or_create(user=request.user)
    #state = s.state
    #state = state.replace ("\\", "\\\\")
    
    return render_to_response('visionary.html',
                              {'message':message,
                               'full_name':request.user.username,
                               'signedin':signedin,
                               'form':args['form'],
                               'state': state,},
                              context_instance=RequestContext(request))


def login(request):
    username = request.POST.get('username', '') #'' -default value
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password) #if it finds user it returns user, if not - return none.
    
    if user is not None:
        auth.login(request, user)
        return HttpResponseRedirect("/visionary/")
    else:
        message="Invalid Username/password."
        signedin = 0

        args = {}
        args.update(csrf(request))
        args['form'] = RegisterForm()

    
        return render_to_response('visionary.html',
                              {'message':message,
                              'full_name':request.user.username,
                               'signedin':signedin,
                               'form':args['form'],
                           },
                              context_instance=RequestContext(request))


def logout(request):
    auth.logout(request)
    message="You're now logged out."
    signedin = 0

    args = {}
    args.update(csrf(request))
    args['form'] = RegisterForm()

    
    return render_to_response('visionary.html',
                              {'message':message,
                              'full_name':request.user.username,
                               'signedin':signedin,
                               'form':args['form']},
                              context_instance=RequestContext(request))

    
    
def signup(request):
    message="You're not signed up!"
    signedin=0
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            new_user = auth.authenticate(username=request.POST['username'],
                                    password=request.POST['password1'])
            auth.login(request, new_user)                        
            return HttpResponseRedirect("/visionary/")
        else:
            message="You're not signed up!"
            return HttpResponseRedirect("/visionary/")





@csrf_exempt
@login_required
def saveState(request):
    message=''
    signedin=1
    state = 'empty state test'
    #links = 'empty links test'
    if request.method == 'POST':
        state = request.POST['mindmapDataSaved']
        #links = request.POST['linksSaved']
        

    s, created=State.objects.get_or_create(user=request.user)
    s.state = state
    #s.links = links
    s.save()

    return render_to_response('visionary.html',
                              {'message':message,
                               'signedin':signedin,
                               'state':state,},
                              context_instance=RequestContext(request))

 
def loadState(request):
    message="Your mindmap is saved!"
    signedin = 1
    state = 'empty'
    #links = 'empty'
    
    #state = State.objects.get(user=request.user.id).state
    s, created=State.objects.get_or_create(user=request.user)
    state = s.state
    #links = s.links
    state = state.replace ("\\", "\\\\")
    #links = links.replace ("\\", "\\\\")
    return render_to_response('visionary.html',
                              {'message':message,
                               'signedin':signedin,
                               'state': state,
                               #'links': links,
                           },
                              context_instance=RequestContext(request))












def visionary(request):
    c = {}
    c.update(csrf(request))
            
    args = {}
    args.update(csrf(request))
    args['form'] = RegisterForm()
    if request.user.is_authenticated():
        maps = Mindmap.objects.filter(user=request.user)
        numberOfUserMaps = len(maps)
        profile = UserProfile.objects.get(user=request.user)
        subscription = profile.subscription        
    else:
        maps = ''
        subscription = 'none'
        numberOfUserMaps = 0

    return render_to_response('visionary.html',
                              {'form':args['form'],
                               'maps':maps,
                               'numberOfUserMaps':numberOfUserMaps,
                               'subscription':subscription,
                           },context_instance=RequestContext(request))
    
    

 
def add_map(request):
    maps = Mindmap.objects.filter(user=request.user)
    allMaps = Mindmap.objects.all()
    id = len(allMaps)+1;
    Mindmap.objects.create(name = "mindmap"+str(id), user=request.user)
    return HttpResponseRedirect("/map/"+"mindmap"+str(id)+".html")
    #return HttpResponseRedirect("/visionary/")

        
def rename_map(request):
    return render_to_response('visionary.html',{
                              },context_instance=RequestContext(request))
        

def delete_map(request, slug):
    thisMap = Mindmap.objects.get(slug = slug, user=request.user)
    thisMap.delete()
    return HttpResponseRedirect("/visionary/")
    #return HttpResponse("Map to delete: "+d.name)

@csrf_exempt
@login_required
def save_map(request,slug):
    thisMap = Mindmap.objects.get(slug = slug, user=request.user)
    
    p = request.POST
    if p["mindmapDataSaved"]:
        thisMap.data = p["mindmapDataSaved"]
        thisMap.save()

    return HttpResponseRedirect("/visionary/")


def view_map(request, slug):
    c = {}
    c.update(csrf(request))
            
    args = {}
    args.update(csrf(request))
    args['form'] = RegisterForm()

    if request.user.is_authenticated():
        maps = Mindmap.objects.filter(user=request.user)
        doLoadNodes = ""
        numberOfUserMaps = len(maps);
        profile = UserProfile.objects.get(user=request.user)
        subscription = profile.subscription        
    else:
        maps = ''
        doLoadNodes = "true"
        numberOfUserMaps = 0
        subscription = "none"

    thisMap = Mindmap.objects.get(slug = slug)#, user=request.user #Checking
    #only for map name, not for user. Available for everyone. Later add user
    #check for premium private maps?
    data = thisMap.data
    data = data.replace ("\\", "\\\\")
    data = data.replace ("\'", "\\\'")

    return render_to_response('visionary.html',{'form':args['form'],
                                                'data':data,
                                                'maps':maps,
                                                'thisMap':thisMap,
                                                'doLoadNodes':doLoadNodes,
                                                'mapCreator' : thisMap.user,
                                                'numberOfUserMaps':numberOfUserMaps,
                                                'subscription':subscription,
                                            },context_instance=RequestContext(request))
        
def view_map_temp(request):
    #state = State.objects.get(user=request.user.id).state
    s, created=State.objects.get_or_create(user=request.user)
    state = s.state
    state = state.replace ("\\", "\\\\")
    #links = links.replace ("\\", "\\\\")
    return render_to_response('visionary.html',
                              {'message':message,
                               'signedin':signedin,
                               'state': state,
                               #'links': links,
                           },
                              context_instance=RequestContext(request))

 
def add_subscription(request):
    profile = UserProfile.objects.get(user=request.user)
    profile.subscription = "premium"
    profile.save()
    return HttpResponseRedirect("/visionary/")

def remove_subscription(request):
    profile = UserProfile.objects.get(user=request.user)
    profile.subscription = "none"    
    profile.save()    
    return HttpResponseRedirect("/visionary/")
    
