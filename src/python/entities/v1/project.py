class Project:
    """Represents one project in the portfolio."""
    def __init__(self, _id, name, date, tag, desc, image_ids, cover_image_id, cover_alt_image_id, has_news):
        self._id = _id
        self.name = name
        self.date = date
        self.tag = tag # can be interpreted as a category; should change to support multiple "tags"
        self.desc = desc
        self.image_ids = image_ids
        self.cover_image_id = cover_image_id
        self.cover_alt_image_id = cover_alt_image_id 
        self.has_news = has_news
        self.is_archived = False
        self.is_hidden = False

