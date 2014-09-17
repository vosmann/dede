class Page:
    """Represents a page on the Dede web site. This might be a page with projects, a page with news
    stories, a contacts page etc.
    A single page normally contains multiple entries (entry.py)."""

    def __init__(self, raw_dict): 
        self._id = raw_dict[u'_id']               # Must have ID to enable later renamings of pages.
        self.name = raw_dict[u'name']             # A name will also identify a page uniquely.
        self.is_shown = raw_dict[u'isShown']
        self.creation_date = raw_dict[u'creationDate']
        self.modification_date = raw_dict[u'modificationDate']
        self.entry_ids = raw_dict[u'entryIds'].split(",")   # List of identifiers of entries.

    def json_dict(self):
        return {
                '_id': self._id,
                'name': self.name,
                'isShown': self.is_shown,
                'creationDate': self.creation_date,
                'modificationDate': self.modification_date,
                'entryIds': self.entry_ids
                }


