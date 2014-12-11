class User:
    """Represents an editing user (editor). Created while introducing Flask-Login."""

    def __init__(self): 

        self.is_authenticated = False
        self.is_active = True
        self.is_anonymous = False

        self.password_hash = '' # just keep it here; pass change later.

    def get_id(self):
        return "editor"
