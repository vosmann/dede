class Image(Element):
    """Represents an image found within an entry."""
    def __init__(self, _id, is_hidden, content, caption):
        self._id = _id
        self.is_hidden = is_hidden
        self.content = content # the image itself
        self.caption = caption

