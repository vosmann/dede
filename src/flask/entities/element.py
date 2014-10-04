class Element:
    """Represents an element of an entry on a Dede page. Instead of having different classes,
    this was flattened out into a single Element class that carries all fields that, depending
    on type, might or might not be used. E.g. Only images will use 'captions' and only titles 
    will use 'levels'."""
        
    def __init__(self, raw_dict): 

        if u'type' in raw_dict:
            self.type = raw_dict[u'type']
        else:
            self.type  = "No type provided"

        if u'data' in raw_dict:
            self.data = raw_dict[u'data']
        else:
            self.data = "No data provided"
 
        if u'label' in raw_dict:
            self.label = raw_dict[u'label']
        else:
            self.label = None
 
        if u'level' in raw_dict:
            self.level = raw_dict[u'level']
        else:
            self.level = None
 
        if u'caption' in raw_dict:
            self.caption = raw_dict[u'caption']
        else:
            self.caption = None
 

    def json_dict(self):
        dictionary = {
                        'type': self.type,
                        'data': self.data,
                     }

        if self.label is not None:
            dictionary['label'] = self.label

        if self.level is not None:
            dictionary['level'] = self.level

        if self.caption is not None:
            dictionary['caption'] = self.caption

        return dictionary

