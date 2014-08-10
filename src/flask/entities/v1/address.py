class Address:
    """Addresses can be e-mail or web."""
    def __init__(self, message, addresses):
        self._id = 0
        self.message = message
        self.addresses = addresses 
