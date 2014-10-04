from element import Element


class Entry:
    """Represents an entry within a Dede page. On a projects page, an entry will be a single project. On a news
    stories page an entry will be a single news story. An "about us" page will most likely contain just one entry.
    Could be done without this class, but it gives a bit more explicitness in the sense of defining domain entities."""

    def __init__(self, raw_dict): 

        self._id = raw_dict[u'_id']

        if u'name' in raw_dict:
            self.name = raw_dict[u'name']
        else:
            self.name  = "No name provided"

        if u'tags' in raw_dict:
            tags = raw_dict[u'tags']
            if isinstance(tags, basestring):
                # JSON received from front-end.
                self.tags = tags.split(",")
            elif isinstance(tags, list):
                # List received from Mongo.
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

        if u'elements' in raw_dict:
            raw_elements = raw_dict[u'elements']
            # A list is received from both front-end and Mongo.
            if isinstance(raw_elements, list):
                self.elements = []
                for raw_el in raw_elements:
                    self.elements.append(Element(raw_el))
            else:
                self.elements = []
        else:
            self.elements = []


    def json_dict(self):

        elements_json = []
        for element in self.elements:
            elements_json.append(element.json_dict())

        return {
                '_id': self._id,
                'name': self.name,
                'tags': self.tags,
                'isShown': self.is_shown,
                'isArchived': self.is_archived,
                'creationDate': self.creation_date,
                'modificationDate': self.modification_date,
                'elements': elements_json
               }

