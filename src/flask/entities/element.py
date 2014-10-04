class Element:
    """Represents an element of an entry on a Dede page. Instead of having different classes,
    this was flattened out into a single Element class that carries all fields that, depending
    on type, might or might not be used. E.g. Only images will use 'captions' and only titles 
    will use 'levels'."""
    def __init__(self, _id):
        self.type = ""
        self.data = ""
        self.label = ""
        self.level = ""
        self.caption = ""
        
        
