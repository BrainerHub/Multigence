from django import forms
from django.contrib import admin
from django.forms.utils import flatatt
from django.utils.html import format_html

from multigence_server.core.models import *
# The default TextArea widget does not use utf-8 encoding for postgres JSONField
# We create a custom widget here
# TODO this is a hack, is there a better way?
from multigence_server.registration.models import Token, Invitation


class JsonFieldWidget(forms.Textarea):
    def render(self, name, value, attrs=None):
        if value is None:
            value = ''
        text = value.encode('UTF-8').decode('unicode_escape')
        final_attrs = self.build_attrs(attrs, name=name)
        return format_html('<textarea{}>\r\n{}</textarea>',
                           flatatt(final_attrs),
                           text)

# Department
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    readonly_fields = ('uuid',)


# Company
class DepartmentInline(admin.TabularInline):
    model = Department
    fk_name = "company"
    readonly_fields = ('uuid',)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    inlines = [
        DepartmentInline,
    ]
    readonly_fields = ('uuid',)


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    readonly_fields = ('uuid',)


# Question
class QuestionOptionInline(admin.TabularInline):
    model = QuestionOption
    readonly_fields = ('uuid',)
    formfield_overrides = {
        models.JSONField: {'widget': JsonFieldWidget},
    }

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [
        QuestionOptionInline,
    ]
    formfield_overrides = {
        models.JSONField: {'widget': JsonFieldWidget},
    }


@admin.register(Sphere)
class SphereAdmin(admin.ModelAdmin):
    readonly_fields = ('uuid',)
    ordering = ('index',)


class QuestionaryQuestionInline(admin.TabularInline):
    model = QuestionaryQuestion

@admin.register(Questionary)
class QuestionaryAdmin(admin.ModelAdmin):
    inlines = [
        QuestionaryQuestionInline,
    ]
    readonly_fields = ('uuid',)

# Questionary result
@admin.register(QuestionaryResult)
class QuestionaryResultAdmin(admin.ModelAdmin):
    pass

# Generic Token
@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    pass

# Invitations
@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    pass

