from django.urls import path, include


views = [
    'database',
    'home',
    'auth',
    'terminal',
    'settings',
    'files',
    'editor',
    'other',
    'statistics',
    'users',
    'email'
]


urlpatterns = [path(f'{view}/', include(f'dashboard.views.{view}')) for view in views]
