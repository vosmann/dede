class Contact:
    """The portfolio site's owner(s) contact information. Contains tuples with
    e-mail addresses and facebook/linkedin/twitter/instagram/tumblr page links
    as the first element of the tuple and "display text" as the second element
    of the tuple. The latter describes how it will be rendered in the
    front-end."""
    def __init__(self, addresses):
        self._id = 0
        self.addresses = addresses
