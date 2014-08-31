class Page:
    """Represents a page on the Dede web site. This might be a page with projects, a page with news stories,
    a contacts page etc.
    A single page normally contains multiple entries (entry.py)."""
    def __init__(self, _id, name, date):
        self._id = _id # Must have ID to enable later renamings of pages.
        self.name = name # A name will also identify a page uniquely.
        self.is_shown = True
        self.creation_date = creation_date
        self.modification_date = creation_date
        self.entry_ids = [] # List of names (names will be identifiers of entries)

