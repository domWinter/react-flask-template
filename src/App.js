import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroup, ListGroupItem, Card, Button} from 'react-bootstrap';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
    };
    this.delete = this.delete.bind(this);
  }


  delete(id){
    console.log(id)
    this.setState(prevState => ({
        todos: prevState.todos.filter(el => el["id"] != id )
    }));
  }

  componentDidMount() {
    fetch('/todos').then(res => res.json()).then(data  => {
      this.setState({todos: data.todos})
    });
  }

  render() {
    const { todos } = this.state;
    return (
      <div className="App">
        <header className="App-header">
          <Card style={{ width: '25rem' }}>
            <Card.Header>Todolist</Card.Header>
            <ListGroup variant="flush">
              {todos.map(todo => 
                <ListGroupItem key={todo.id}>
                  <span className="float-left">{todo.title}</span>
                  <span className="float-right">
                    <Button onClick={this.delete.bind(this, todo.id)} variant="primary" size="sm">X</Button>{' '}
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
