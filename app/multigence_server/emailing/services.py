import logging
import os

import mandrill
import pystache
import time
import codecs
from django.conf import settings

logger = logging.getLogger(__name__)

test_mode = not settings.MAIL_API_KEY
if not test_mode:
    mandrill_client = mandrill.Mandrill(settings.MAIL_API_KEY)


def send_registration_email(email, first_name, last_name, company, additional_info):
    template = settings.REGISTRATION_TEMPLATE
    content = pystache.render(template, {'email': email, 'first_name': first_name, 'last_name': last_name, 'company': company, 'additional_info': additional_info})
    recipient = settings.REGISTRATION_NOTIFICATION_EMAIL
    send_text(settings.ADMIN_EMAIL, settings.MULTIGENCE_SENDER_NAME, recipient, settings.REGISTRATION_SUBJECT, content)

def send_invitation_email(invitation, uri):
    path = os.path.join(settings.BASE_DIR, 'templates', 'invitations.html')
    with codecs.open(path, 'r', 'utf-8') as template_file:
        template = template_file.read()
        content = pystache.render(template, {
            'link': uri,
            #'logo_url': settings.INVITATION_MULTIGENCE_LOGO_URL,
            'name': invitation.first_name + " " + invitation.last_name,
            'company_name': invitation.department.company.name.title(),
            'date': time.strftime("%d.%m.%Y")
        })
        send_html(settings.NO_REPLY_EMAIL, settings.MULTIGENCE_SENDER_NAME, invitation.email, settings.INVITATION_SUBJECT, content)


def send_password_reset_email(email, uri):
    template = settings.PASSWORD_RESET_TEMPLATE
    content = pystache.render(template, {'link': uri})
    send_text(settings.NO_REPLY_EMAIL, settings.MULTIGENCE_SENDER_NAME, email, settings.PASSWORD_RESET_SUBJECT, content)


def send_text(sender, sender_name, recipient, subject, text):
    try:
        # see: https://mandrillapp.com/api/docs/messages.python.html#method-send
        message = {
               'auto_html': None,
               'auto_text': None,
               'bcc_address': None,
               'from_email': sender,
               'from_name': sender_name,
               # 'headers': {'Reply-To': 'message.reply@example.com'},
               # 'html': '<p>Example HTML content</p>',
               'important': False,
               'inline_css': None,
               # 'metadata': {'website': 'www.example.com'},
               # 'preserve_recipients': None,
               # 'recipient_metadata': [{'rcpt': 'recipient.email@example.com', 'values': {'user_id': 123456}}],
               # 'return_path_domain': None,
               # 'signing_domain': None,
               # 'subaccount': 'customer-123',
               'subject': subject,
               'text': text,
               'to': [{'email': recipient}],
               # 'track_clicks': None,
               # 'track_opens': None,
               # 'tracking_domain': None,
               # 'url_strip_qs': None,
               # 'view_content_link': None
        }
        logger.info("Sending email to: %s . Subject: %s" % (recipient, subject))
        if test_mode:
            logger.warn("Mail TEST MODE only - no sending of emails")
            logger.warn("Message: %s" % message)
        else:
            if settings.INTERCEPT_EMAIL_MODE:
                message['to'] = [{'email': settings.INTERCEPT_EMAIL}]
            result = mandrill_client.messages.send(message=message, send_async=False)
    except mandrill.Error as e:
        # Mandrill errors are thrown as exceptions
        logger.error('A mandrill error occurred: %s - %s' % (e.__class__, e))


def send_html(sender, sender_name, recipient, subject, html):
    try:
        # see: https://mandrillapp.com/api/docs/messages.python.html#method-send
        message = {
               'auto_html': None,
               'auto_text': None,
               'bcc_address': None,
               'from_email': sender,
               'from_name': sender_name,
                # 'headers': {'Reply-To': 'message.reply@example.com'},
               'html': html,
               'important': False,
               'inline_css': None,
               # 'metadata': {'website': 'www.example.com'},
               # 'preserve_recipients': None,
               # 'recipient_metadata': [{'rcpt': 'recipient.email@example.com', 'values': {'user_id': 123456}}],
               # 'return_path_domain': None,
               # 'signing_domain': None,
               # 'subaccount': 'customer-123',
               'subject': subject,
               # 'text': text,
               'to': [{'email': recipient}],
               # 'track_clicks': None,
               # 'track_opens': None,
               # 'tracking_domain': None,
               # 'url_strip_qs': None,
               # 'view_content_link': None
        }
        logger.info("Sending email to: %s . Subject: %s" % (recipient, subject))
        if test_mode:
            logger.warn("Mail TEST MODE only - no sending of emails")
            logger.warn("Message: %s" % message)
        else:
            if settings.INTERCEPT_EMAIL_MODE:
                message['to'] = [{'email': settings.INTERCEPT_EMAIL}]
            result = mandrill_client.messages.send(message=message, send_async=False)
    except mandrill.Error as e:
        # Mandrill errors are thrown as exceptions
        logger.error('A mandrill error occurred: %s - %s' % (e.__class__, e))
