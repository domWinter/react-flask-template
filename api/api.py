from flask import Flask, request
from tinydb import TinyDB, Query, where

app = Flask(__name__)
db = TinyDB('todos.json')

@app.route('/get')
def get_todos():
    todos = [todo for todo in db]
    return {'todos': todos}

@app.route('/add', methods=['POST'])
def add_todo():
    data = request.get_json()
    db.insert(data['todo'])
    return {'success' : True}


@app.route('/delete', methods=['POST'])
def delete_todo():
    data = request.get_json()
    db.remove(where('id') == data['id'])
    return {'success' : True}

@app.route('/update', methods=['POST'])
def update_todo():
    data = request.get_json()
    id = data['id']
    Todo = Query()
    todo = db.search(Todo.id == id)[0]
    db.update({'done' : not todo['done'] }, Todo.id == id)
    return {'success' : True}