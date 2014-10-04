class Entry:
    """Represents an entry within a Dede page. On a projects page, an entry will be a single project. On a news
    stories page an entry will be a single news story. An "about us" page will most likely contain just one entry."""
    def __init__(self, _id, name):
        self._id = _id
        self.name = name
        self.tags = []
        self.is_shown = True
        self.is_archived = False
        self.creation_date = creation_date
        self.modification_date = creation_date
        self.elements = [] # names or _ids of titles, texts, images.
        # Keep a "has_news" field or simply handle this with links within the text of the entry?
        # self.has_news = has_news






        #         {u'_id': 1, u'name': u'Red shelf', u'tags': [u'art', u'interior design'], u'isShown': False, u'modificationDate': u'30-08-2014', u'elements': [{u'isShown': True, u'data': u'Red red red', u'type': u'title', u'level': 1}, {u'isShown': True, u'data': u'A playful red shelf-toy. Vi\u0161e teksta ovdje vi\u0161e. Vi\u0161e teksta ovdje vi\u0161e. Vi\u0161e teksta ovdje vi\u0161e. Vi\u0161e teksta ovdje vi\u0161e. Vi\u0161e teksta ovdje vi\u0161e. Vi\u0161e teksta ovdje vi\u0161e. Vi\u0161e teksta ovdje vi\u0161e. Vi\u0161e teksta ovdje vi\u0161e. Vi\u0161e teksta ovdje vi\u0161e. SDF', u'type': u'text'}, {u'isShown': True, u'data': u'red_shelf.jpg', u'type': u'image'}], u'isArchived': True, u'creationDate': u'30-08-2014'}

    def __init__(self, raw_dict): 

        self._id = raw_dict[u'_id']

        if u'name' in raw_dict:
            self.name = raw_dict[u'name']
        else:
            self.name  = "No name provided"

        if u'tags' in raw_dict:
            tags = raw_dict[u'entryIds']
            # JSON received from front-end is a string and Mongo gives a list.
            if isinstance(tags, basestring):
                self.tags = tags.split(",")
            elif isinstance(tags, list):
                self.tags = tags
            else:
                self.tags = []
        else:
            self.tags = []

        if u'isShown' in raw_dict:
            self.is_shown = raw_dict[u'isShown']
        else:
            self.is_shown = False

        if u'isArchived' in raw_dict:
            self.is_archived = raw_dict[u'isArchived']
        else:
            self.is_archived = False

        if u'creationDate' in raw_dict:
            self.creation_date = raw_dict[u'creationDate']
        else:
            self.creation_date = ""
        if u'modificationDate' in raw_dict:
            self.modification_date = raw_dict[u'modificationDate']
        else:
            self.modification_date  = ""



        
    def json_dict(self):
        return {
                '_id': self._id,
                'name': self.name,
                'isShown': self.is_shown,
               }

 

