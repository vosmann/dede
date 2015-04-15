from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask.ext.login import UserMixin

# Is it okay to always use is_authenticated() inherited from UserMixin? It always returns True.
class User(UserMixin):
    """Represents an editing user (editor). Created while introducing Flask-Login."""

    def __init__(self, id, password_hash):
        """The ID is the username."""
        self.id = id
        self.password_hash = password_hash

    def login(self, username, password):
        ok = self.is_user_ok(username) and self.is_pass_ok(password)
        if ok:
            self.is_auth = True
        return ok

    def is_user_ok(self, user_id):
        user_ok = user_id == self.get_id()
        if user_ok:
            print "username ok"
        else:
            print "username not ok"
        return user_ok

    def is_pass_ok(self, password):
        pass_ok = check_password_hash(self.password_hash, password)
        if pass_ok:
            print "password ok"
        else:
            print "password not ok"
        return pass_ok

