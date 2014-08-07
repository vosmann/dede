class Element:
    """Represents an element of an entry on a Dede page. More closely defined by its subclasses.
    Most commonly, an element will be a title, a text or an image."""
    def __init__(self, _id):
        self._id = _id
        self.is_shown = True

