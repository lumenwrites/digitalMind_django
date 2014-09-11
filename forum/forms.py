from django.forms import ModelForm

from forum.models import Post


class PostForm(ModelForm):
    class Meta:
        model = Post
        exclude = ('slug, author, parent, rating, voters,')

class ReplyForm(ModelForm):
    class Meta:
        model = Post
        exclude = ('title, slug, category, author, parent, rating, voters,')
        
