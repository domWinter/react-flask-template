import React from 'react';
//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroup, ListGroupItem, Card, Button, Form} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      input: ""
    };
    this.deleteTodo = this.deleteTodo.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
  }

  changeStatus(id) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    };
    fetch('/update', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

            var todos = this.state.todos;
            todos.forEach(function (todo, index) {
              if (todo.id === id) {
                todos[index].done = ! todos[index].done
              }
            });
            this.setState({
              todos: todos
            });
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

    
  }

  addTodo(e) {
    if (e.key === 'Enter') {  
      
      e.persist();

      var id = 0;
      if (this.state.todos.length !== 0) {
        id = this.state.todos[this.state.todos.length-1]['id']+1;
      }
      const title = e.target.value

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todo: {"id":id, "title":title, "done":false} })
      };
      fetch('/add', requestOptions)
          .then(async response => {
              const data = await response.json();
              if (!response.ok) {
                  const error = (data && data.message) || response.status;
                  return Promise.reject(error);
              }
              if (this.state.todos.length === 0) {
                this.setState({
                  todos: [{"id":0, "title":e.target.value}]
                });
              } else {
                this.setState({
                  todos: [...this.state.todos, {"id":id, "title":title, "done":false}]
                });
              }
          })
          .catch(error => {
              console.error('There was an error!', error);
          });
          e.preventDefault();
      }
  }

  deleteTodo(id){
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    };
    fetch('/delete', requestOptions)
        .then(async response => {
            const data = await response.json();
            if (!response.ok) {
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }

            this.setState(prevState => ({
              todos: prevState.todos.filter(el => el["id"] !== id )
            }));
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    
  }

  componentDidMount() {
    fetch('/get').then(res => res.json()).then(data  => {
      this.setState({todos: data.todos})
    });
  }

  render() {
    const { todos } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <h2>Todos: {todos.length}</h2>
          <div style={{ width: '25rem' }}>
            <Form style={{ marginTop:"15px", marginLeft:"5px", marginRight:"5px" }}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control action="#" onKeyPress={this.addTodo} type="text" placeholder="Enter Todo" />
              </Form.Group>
            </Form>
            <ListGroup>
              {todos.map(todo => 
                <ListGroupItem  key={todo.id} >
                  <span onClick={this.changeStatus.bind(this, todo.id)} style = {{textDecoration: todo.done ? 'line-through' : ''  }} className="float-left">{todo.title}</span>
                  <span className="float-right">
                    <Button onClick={this.deleteTodo.bind(this, todo.id)} variant="primary" size="sm">X</Button>{' '}
                  </span>
                </ListGroupItem>)
              }
            </ListGroup>
          </div>
        </header>
      </div>
    )
  }
}

export default App;
