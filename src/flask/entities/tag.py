# Delete, huh?
class Tag:
    """A tag that can be given to an entry."""
    def __init__(self, _id, name):
        self._id = _id
        self.name = name
        self.is_shown = True

    def __init__(self, raw_dict): 

        self._id = raw_dict[u'_id']

        if u'name' in raw_dict:
            self.name = raw_dict[u'name']
        else:
            self.name  = "No name provided"

        if u'isShown' in raw_dict:
            self.is_shown = raw_dict[u'isShown']
        else:
            self.is_shown = False

        
    def json_dict(self):
        return {
                '_id': self._id,
                'name': self.name,
                'isShown': self.is_shown,
               }

        
