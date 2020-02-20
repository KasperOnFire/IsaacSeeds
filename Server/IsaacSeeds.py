from flask import Flask, escape, request, render_template

app = Flask(__name__)


@app.route("/")
def index():
    name = request.args.get("name", "World")
    return f"hello, {escape(name)}!"


@app.route("/seed")
def seed():
    seed1 = {"seed": "ABCD 1234", "character":"Eden", "gameversion": "Afterbirth Plus", }
    return render_template("seed.html", title="SeedTest", seed=seed1)


if __name__ == "__main__":
    app.run()
