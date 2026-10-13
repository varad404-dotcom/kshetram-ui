from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    # The dashboard is a single-page UI; screens switch with #hash routes
    # (e.g. /#players, /#attendance, /#fees). It runs on sample data in the browser.
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
