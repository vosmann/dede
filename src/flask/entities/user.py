from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from flask.ext.login import UserMixin

class User(UserMixin):
    """Represents an editing user (editor). Created while introducing Flask-Login."""

    def __init__(self): 

        self.is_auth = False

        # Just keep it here; first version will not enable password change.
        # As generated with werkzeug.security.generate_password_hash in password.py.
        self.password_hash = 'pbkdf2:sha512:1000$cYzivvY1WG5X8VXc$01107d434eca9a14060ed398812fc47c72169d2b263872e08271b1ff3ec51bf03104c8f2f7e2e3b360e3268d5b76ec55b7c2ec2c08df3998ae01e2daef66bc85'

    @property
    def is_authenticated(self):
        return self.is_auth
             
    def get_id(self):
        return "editor"

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

    def login(self, username, password):
        ok = self.is_user_ok(username) and self.is_pass_ok(password)
        if ok:
            self.is_auth = True
        return ok

