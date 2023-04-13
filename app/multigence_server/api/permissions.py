from rest_framework import permissions

from multigence_server.core.models import User


class IsAuthenticatedManagerOrAdminIfCreate(permissions.BasePermission):
    def has_permission(self, request, view):
        if view.action == 'create':
            user = request.user
            return user.is_authenticated and (user.role == User.MANAGER or user.role == User.ADMIN)
        return True

class IsAuthenticatedAndAdminIfList(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if view.action == 'list':
            return user.is_authenticated and user.role == User.ADMIN
        else:
            return user.is_authenticated
