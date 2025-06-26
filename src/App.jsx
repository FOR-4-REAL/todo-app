import { Component } from 'react'
import './App.css'

export default class App extends Component {
  state = {
    todoData: [
      {
        id: '1',
        title: '공부하기',
        completed: true,
      },
      {
        id: '2',
        title: '청소하기',
        completed: false,
      }
    ],
    value: '',
  }

  btnStyle = {
    color: '#fff',
    border: 'none',
    padding: '5px 9px',
    borderRadius: '50%',
    cursor: 'pointer',
    float: 'right',
  }

  getStyle = (completed) => {
    return {
      padding: '10px',
      borderBottom: '1px #ccc dotted',
      textDecoration: completed ? 'line-through' : 'none',
    }
  }

  handleClick = (id) => {
    console.log('id', id);
    let newTodoData = this.state.todoData.filter((data) => data.id !== id)
    console.log('newTodoData', newTodoData)

    this.setState({ todoData: newTodoData })
  }

  handleChange = (e) => {
    console.log(e, e.target.value);
    // this.state.value = e.target.value;
    this.setState({ value: e.target.value })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    console.log(e);

    let newTodo = {
      id: Date.now(),
      title: this.state.value,
      completed: false,
    }

    console.log('newTodo', newTodo)

    this.setState({ 
      todoData: [...this.state.todoData, newTodo],
      value: '',
    })
  }

  handleCompleteChange = (id) => {
    this.state.todoData.map((data) => {
      if(data.id === id) {
        data.completed = !data.completed;
        this.setState({todoData: this.state.todoData})
      }
    })
  }

  render () {
    return (
      <div className='container'>
        <div className='todoBlock'>
          <div className='title'>
            <h1>할 일 목록</h1>
          </div>

          {
            this.state.todoData.map((data) => (
              <div key={data.id} style={this.getStyle(data.completed)}>
                <input 
                  type='checkbox' 
                  onChange={() => this.handleCompleteChange(data.id)}
                  defaultChecked={data.completed} 
                />
                {data.title}
                {/* <button style={this.btnStyle} onClick={this.handleClick}>X</button> */}
                <button style={this.btnStyle} onClick={() => this.handleClick(data.id)}>X</button>
              </div>
            ))
          }

          <form style={{ display: 'flex' }} onSubmit={(e) => this.handleSubmit(e)}>
            <input 
              type='text' 
              name='value'
              style={{ flex: '10', padding: '5px' }}
              placeholder='할 일을 입력하세요.'
              value={this.state.value}
              onChange={(e) => this.handleChange(e)}
            />

            <input 
              type='submit' 
              value='입력'
              className='btn'
              style={{ flex: '1' }}
            />
          </form>
        </div>
      </div>
    )
  }
}