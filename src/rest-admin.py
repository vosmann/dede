from flask import Flask
app = Flask(__name__)

# save new data
@app.route("/admin/save-project")
def save_project():
    return "add project"

@app.route("/admin/save-news")
def save_news():
    return "add news"

@app.route("/admin/save-about")
def rest():
    return "save about"

@app.route("/admin/save-contact")
def rest():
    return "save contact"

# delete data
@app.route("/admin/delete-project")
def delete_project():
    return "add project"

@app.route("/admin/delete-news")
def delete_news():
    return "add news"

if __name__ == "__main__":
    app.run()
