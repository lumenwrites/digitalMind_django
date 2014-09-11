import datetime

from django import template

from django.utils.timezone import utc


register = template.Library() #module lvl register variable

@register.filter(name='age') # registering filter
def age(created_at):
    now = datetime.datetime.utcnow().replace(tzinfo=utc)
    age_in_minutes = int((now - created_at).total_seconds())/60

    if age_in_minutes < 60:
        # show precision in minutes
        value = age_in_minutes
        precision = 'minute'
    elif age_in_minutes < 60*24:
        # hours
        value = age_in_minutes//60 #// - true integer devision
        precision = 'hour'
    else:
        #days
        value = age_in_minutes//(60*24)
        precision = 'day'

    age_string = '%d %s%s ago' % (value, precision, ('s' if value > 1 else ''))
    return age_string

@register.filter(name='count_replies') # registering filter
def count_replies(children):
    number_of_replies = len(children.all())
    if number_of_replies == 1:
        result_string = str(number_of_replies) + " reply"
    else:
        result_string = str(number_of_replies) + " replies"
    return result_string
