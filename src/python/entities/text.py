class Text(Element):
    """Represents a piece of text found within an entry."""
    def __init__(self, _id, is_hidden, text):
        self._id = _id
        self.is_hidden = False
        self.text = text

