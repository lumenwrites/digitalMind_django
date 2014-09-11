# -*- coding: utf-8 -*-
import datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Post'
        db.create_table('forum_post', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(blank=True, max_length=200)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=50, unique=True)),
            ('author', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'], default=27, related_name='created_posts')),
            ('category', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, to=orm['forum.Category'], default=1, null=True)),
            ('parent', self.gf('django.db.models.fields.related.ForeignKey')(blank=True, to=orm['forum.Post'], related_name='children', null=True)),
            ('rating', self.gf('django.db.models.fields.IntegerField')(default=0)),
            ('created_at', self.gf('django.db.models.fields.DateTimeField')(blank=True, auto_now_add=True)),
            ('changed_at', self.gf('django.db.models.fields.DateTimeField')(blank=True, auto_now=True)),
            ('content', self.gf('django.db.models.fields.TextField')(blank=True, null=True)),
        ))
        db.send_create_signal('forum', ['Post'])

        # Adding M2M table for field voters on 'Post'
        m2m_table_name = db.shorten_name('forum_post_voters')
        db.create_table(m2m_table_name, (
            ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True)),
            ('post', models.ForeignKey(orm['forum.post'], null=False)),
            ('user', models.ForeignKey(orm['auth.user'], null=False))
        ))
        db.create_unique(m2m_table_name, ['post_id', 'user_id'])

        # Adding model 'Category'
        db.create_table('forum_category', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('title', self.gf('django.db.models.fields.CharField')(max_length=200)),
            ('slug', self.gf('django.db.models.fields.SlugField')(max_length=50)),
        ))
        db.send_create_signal('forum', ['Category'])

        # Adding model 'UserProfile'
        db.create_table('forum_userprofile', (
            ('id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'], related_name='profile', unique=True)),
            ('rating', self.gf('django.db.models.fields.IntegerField')(default=1)),
            ('avatar', self.gf('django.db.models.fields.files.ImageField')(blank=True, max_length=100, null=True)),
            ('posts', self.gf('django.db.models.fields.IntegerField')(default=0)),
        ))
        db.send_create_signal('forum', ['UserProfile'])


    def backwards(self, orm):
        # Deleting model 'Post'
        db.delete_table('forum_post')

        # Removing M2M table for field voters on 'Post'
        db.delete_table(db.shorten_name('forum_post_voters'))

        # Deleting model 'Category'
        db.delete_table('forum_category')

        # Deleting model 'UserProfile'
        db.delete_table('forum_userprofile')


    models = {
        'auth.group': {
            'Meta': {'object_name': 'Group'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '80', 'unique': 'True'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'to': "orm['auth.Permission']", 'symmetrical': 'False'})
        },
        'auth.permission': {
            'Meta': {'ordering': "('content_type__app_label', 'content_type__model', 'codename')", 'unique_together': "(('content_type', 'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['contenttypes.ContentType']"}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'blank': 'True', 'max_length': '75'}),
            'first_name': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '30'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'to': "orm['auth.Group']", 'symmetrical': 'False'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '30'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'to': "orm['auth.Permission']", 'symmetrical': 'False'}),
            'username': ('django.db.models.fields.CharField', [], {'max_length': '30', 'unique': 'True'})
        },
        'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'db_table': "'django_content_type'", 'object_name': 'ContentType'},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        'forum.category': {
            'Meta': {'object_name': 'Category'},
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50'}),
            'title': ('django.db.models.fields.CharField', [], {'max_length': '200'})
        },
        'forum.post': {
            'Meta': {'object_name': 'Post'},
            'author': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']", 'default': '27', 'related_name': "'created_posts'"}),
            'category': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'to': "orm['forum.Category']", 'default': '1', 'null': 'True'}),
            'changed_at': ('django.db.models.fields.DateTimeField', [], {'blank': 'True', 'auto_now': 'True'}),
            'content': ('django.db.models.fields.TextField', [], {'blank': 'True', 'null': 'True'}),
            'created_at': ('django.db.models.fields.DateTimeField', [], {'blank': 'True', 'auto_now_add': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'parent': ('django.db.models.fields.related.ForeignKey', [], {'blank': 'True', 'to': "orm['forum.Post']", 'related_name': "'children'", 'null': 'True'}),
            'rating': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'slug': ('django.db.models.fields.SlugField', [], {'max_length': '50', 'unique': 'True'}),
            'title': ('django.db.models.fields.CharField', [], {'blank': 'True', 'max_length': '200'}),
            'voters': ('django.db.models.fields.related.ManyToManyField', [], {'blank': 'True', 'to': "orm['auth.User']", 'symmetrical': 'False', 'related_name': "'liked_posts'", 'null': 'True'})
        },
        'forum.userprofile': {
            'Meta': {'object_name': 'UserProfile'},
            'avatar': ('django.db.models.fields.files.ImageField', [], {'blank': 'True', 'max_length': '100', 'null': 'True'}),
            'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'posts': ('django.db.models.fields.IntegerField', [], {'default': '0'}),
            'rating': ('django.db.models.fields.IntegerField', [], {'default': '1'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': "orm['auth.User']", 'related_name': "'profile'", 'unique': 'True'})
        }
    }

    complete_apps = ['forum']