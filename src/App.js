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
        body: JSON.stringify({ todo: {"id":id,"title":title} })
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
                  todos: [...this.state.todos, {"id":id,"title":title}]
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
          <Card style={{ width: '25rem' }}>
            <Card.Header>Todolist [{todos.length}]</Card.Header>
            <Form style={{ marginTop:"15px", marginLeft:"5px", marginRight:"5px" }}>
              <Form.Group controlId="formBasicEmail">
                <Form.Control action="#" onKeyPress={this.addTodo} type="text" placeholder="Enter Todo" />
              </Form.Group>
            </Form>
            <ListGroup>
              {todos.map(todo => 
                <ListGroupItem key={todo.id}>
                  <span className="float-left">{todo.title}</span>
                  <span className="float-right">
                    <Button onClick={this.deleteTodo.bind(this, todo.id)} variant="primary" size="sm">X</Button>{' '}
                  </span>
                </ListGroupItem>)
              }
            </ListGroup>
          </Card>
        </header>
      </div>
    )
  }
}

export default App;
