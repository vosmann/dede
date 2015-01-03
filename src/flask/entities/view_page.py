class ViewPage:
    """A view page is denormalized, i.e. contains a map of all the page's complete entries.
    It is what is shown to the client. Current implementation does not include paging."""

    def __init__(self, page): 
        self._id = page._id
        self.name = page.name
        self.is_show_full = page.is_show_full
        self.entries = {}
        self.ordered_entry_ids = []

    def json_dict(self):
        return {
                '_id': self._id,
                'name': self.name,
                'isShowFull': self.is_show_full,
                'entries': self.entries,
                'orderedEntryIds': self.ordered_entry_ids 
               }


