class ViewPage:
    """A view page is denormalized, i.e. contains the page's entries in their entirity.
    It is what is shown to the client. Current implementation does not include paging."""

    def __init__(self, page): 
        self._id = page._id
        self.name = page.name
        self.entries = []

