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
from django.views.decorators.csrf import csrf_exempt



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


def visionary(request):
    c = {}
    c.update(csrf(request))
    #message = 'this is demo version. signup to be able to save changes.>>>>>'
    message = 'Signup > '
    signedin = 0
            
    args = {}
    args.update(csrf(request))
    args['form'] = RegisterForm()

    state = 'empty'
    user_profile = request.user.get_profile()
    state = user_profile.savedState
    state = state.replace ("\\", "\\\\")
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
        message="You're now logged in"
        signedin = 1        
    else:
        message="Invalid Username/password."
        signedin = 0

    args = {}
    args.update(csrf(request))
    args['form'] = RegisterForm()

    state = 'empty'
    user_profile = request.user.get_profile()
    state = user_profile.savedState
    state = state.replace ("\\", "\\\\")
    
    return render_to_response('visionary.html',
                              {'message':message,
                              'full_name':request.user.username,
                               'signedin':signedin,
                               'form':args['form'],
                               'state': state,},
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
            message="You're now signed up!"
            signedin = 1
        else:
            message="You're not signed up!"
            signedin = 0

    args = {}
    args.update(csrf(request))
    args['form'] = RegisterForm()
            
    state = 'empty'
    user_profile = request.user.get_profile()
    state = user_profile.savedState
    state = state.replace ("\\", "\\\\")
    
    return render_to_response('visionary.html',
                              {'message':message,
                              'full_name':request.user.username,
                               'signedin':signedin,
                               'form':args['form'],
                               'state': state,},
                              context_instance=RequestContext(request))

@csrf_exempt 
def saveState(request):
    message="Your mindmap is saved!"
    signedin = 1
    state = 'empty'
    if request.method == 'POST':
        state = request.POST['state']

    user_profile = request.user.get_profile()
    savedState = user_profile
    savedState.savedState=state
    savedState.save()
    
    return render_to_response('visionary.html',
                              {'message':message,
                               'signedin':signedin,
                               'state':state,},
                              context_instance=RequestContext(request))

 
def loadState(request):
    message="Your mindmap is saved!"
    signedin = 1
    state = 'empty'
    user_profile = request.user.get_profile()
    state = user_profile.savedState
    state = state.replace ("\\", "\\\\")
    return render_to_response('visionary.html',
                              {'message':message,
                               'signedin':signedin,
                               'state': state,},
                              context_instance=RequestContext(request))

 
