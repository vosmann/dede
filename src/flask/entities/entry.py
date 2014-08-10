class Entry:
    """Represents an entry within a Dede page. On a projects page, an entry will be a single project. On a news
    stories page an entry will be a single news story. An "about us" page will most likely contain just one entry."""
    def __init__(self, _id, name):
        self._id = _id
        self.name = name
        self.tags = []
        self.is_shown = True
        self.is_archived = False # Use this?
        self.creation_date = creation_date
        self.modification_date = creation_date
        self.modification_date = creation_date
        self.elements = [] # names or _ids of titles, texts, images.

        # Keep a "has_news" field or simply handle this with links within the text of the entry?
        # self.has_news = has_news

