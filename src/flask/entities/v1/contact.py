# Switch from being a tuple to being an object.
# Enforce that web addresses always contain the protocol prefix.
# If necessary, hide the addresses by css direction reversing.
class Contact:
    """The portfolio site's owner(s) contact information. Contains tuples with
    e-mail addresses and facebook/linkedin/twitter/instagram/tumblr page links
    as the first element of the tuple and "display text" as the second element
    of the tuple. The latter describes how it will be rendered in the
    front-end."""
    def __init__(self, message, addresses):
        self._id = 0
        self.message = message
        self.addresses = addresses 

