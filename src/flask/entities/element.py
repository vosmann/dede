class Element:
    """Represents an element of an entry on a Dede page. More closely defined by its subclasses.
    Most commonly, an element will be a title, a text or an image."""
    def __init__(self, _id):
        self._id = _id # Maybe doesn't have to have ID, as it will be stored
                       # inlined in an Entry. But maybe yes, for images that
                       # are reused in e.g. both the "projects" and "news" page.
        self.is_shown = True

