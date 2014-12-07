from element import Element

class ViewEntry:
    """A view entry is a variant of Entry shown to the client."""

    def __init__(self, entry): 
        self._id = entry._id
        self.name = entry.name
        self.tags = entry.tags
        self.is_archived = entry.is_archived
        self.creation_date = entry.creation_date
        self.modification_date = entry.modification_date
        self.elements = entry.elements
        
    def json_dict(self):

        elements_json = []
        for element in self.elements:
            elements_json.append(element.json_dict())

        return {
                '_id': self._id,
                'name': self.name,
                'tags': self.tags,
                'isArchived': self.is_archived,
                'creationDate': self.creation_date,
                'modificationDate': self.modification_date,
                'elements': elements_json
               }


