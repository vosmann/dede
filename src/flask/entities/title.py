class Title(Element):
    """A title is a specific subtype of Element. Used for different kinds of titles found within an entry."""
    def __init__(self, _id, is_hidden, text, level):
        self._id = _id
        self.is_hidden = False
        self.text = text
        self.level = level # level of the title, 1 being most important


