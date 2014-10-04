# Should probably have a method validating an input dict.
class Page:
    """Represents a page on the Dede web site. This might be a page with projects, a page with news
    stories, a contacts page etc.
    A single page normally contains multiple entries (entry.py)."""

    def __init__(self, raw_dict): 
        self._id = raw_dict[u'_id']               # Must have ID to enable later renamings of pages.

        if u'name' in raw_dict:
            self.name = raw_dict[u'name']             # A name will also identify a page uniquely.
        else:
            self.name  = "No name provided"

        if u'isShown' in raw_dict:
            self.is_shown = raw_dict[u'isShown']
        else:
            self.is_shown = False

        if u'creationDate' in raw_dict:
            self.creation_date = raw_dict[u'creationDate']
        else:
            self.creation_date = ""
        if u'modificationDate' in raw_dict:
            self.modification_date = raw_dict[u'modificationDate']
        else:
            self.modification_date  = ""

        if u'entryIds' in raw_dict:
            ids = raw_dict[u'entryIds']
            # JSON received from front-end is a string and Mongo gives a list. Hence this if.
            if isinstance(ids, basestring):
                self.entry_ids = ids.split(",")
            elif isinstance(ids, list):
                self.entry_ids = ids
            else:
                self.entry_ids = []
        else:
            self.entry_ids = []


    def json_dict(self):
        return {
                '_id': self._id,
                'name': self.name,
                'isShown': self.is_shown,
                'creationDate': self.creation_date,
                'modificationDate': self.modification_date,
                'entryIds': self.entry_ids
                }

