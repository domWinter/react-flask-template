from flask import Flask

app = Flask(__name__)

@app.route('/todos')
def get_current_time():
    return {'todos': [{"id" : 1, "title": "Todo1"}, {"id" : 2, "title": "Todo2"}, {"id" : 3, "title": "Todo3"},{"id" : 4, "title": "Todo4"}]}
