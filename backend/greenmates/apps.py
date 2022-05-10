from django.apps import AppConfig


class GreenmatesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'greenmates'

    def ready(self):
        from scheduler import updater
        updater.start()