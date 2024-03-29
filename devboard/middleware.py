from termcolor import colored
from datetime import datetime
from devboard.configuration.settings import SETTINGS
from django.http import JsonResponse
from django.urls import resolve
from django.shortcuts import render
from .models import RequestLog
from .utils import get_client_ip
import requests
from django.contrib.sessions.models import Session

colors_by_method = {
    'POST': 'white',
    'GET': 'magenta',
    'PATCH': 'green',
    'PUT': 'blue',
    'DELETE': 'red'
}


def log_request(request, response):
    method = (request.POST.get('method') or request.method).upper()
    path = request.get_full_path()
    user = request.user
    username = user.username if request.user.is_authenticated else None
    print(colored(f"{method} - {response.status_code} - {path} - {username} - {datetime.now()}", colors_by_method.get(method)))


class devboardMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if not SETTINGS.get('server.config.enable_server'):
            try:
                resolver_match = resolve(request.path_info)
                view_func = resolver_match.func
                app_name = view_func.__module__.split('.')[0]
                if app_name != 'devboard':
                    return render(request, 'server_disabled.html', status=401)
            except:
                return render(request, 'server_disabled.html', status=401)

        response = self.get_response(request)
        if SETTINGS.get('server.config.save_requests'):

            resolver_match = resolve(request.path_info)
            view_func = resolver_match.func
            app_name = view_func.__module__.split('.')[0]
            if app_name != 'devboard' or SETTINGS.get('devboard.save_devboard_requests'):
                method = (request.POST.get('method') or request.method).upper()
                url = request.get_full_path()
                args = {}
                country_code = None
                the_same_device = RequestLog.objects.filter(ip_v4=get_client_ip(request)).first()
                if the_same_device is not None:
                    country_code = the_same_device.country
                else:
                    res = requests.get(f'https://ipapi.co/{get_client_ip(request)}/json/').json()
                    country_code = res.get("country_code")

                session = Session.objects.filter(session_key=request.session.session_key).first()

                log = RequestLog(
                    ip_v4=get_client_ip(request),
                    method=method,
                    path=url.split('?')[0],
                    status_code=response.status_code,
                    device=request.META.get('HTTP_USER_AGENT'),
                    user=request.user if request.user.is_authenticated else None,
                    session=session,
                    args=args,
                    country=country_code,
                    
                )
                log.save()

        log_request(request, response)
        return response
