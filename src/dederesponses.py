from flask import Response

class ProjectsResponse(Response):
    def __init__(self, projects):
        self.response = projects
