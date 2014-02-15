# Rename to "Story"
class News:
    """Represents a news story on the portfolio site."""
    def __init__(self, _id, title, date, story, image_ids, cover_image_id):
        self._id = _id
        self.title = title
        self.date = date
        self.story = story 
        self.image_ids = image_ids
        self.cover_image_id = cover_image_id
        self.is_hidden = False

