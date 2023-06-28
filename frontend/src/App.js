// import logo from './logo.svg';
import './App.css';
import React,{Component} from 'react';
import Modal from './components/Modal'
import axios from 'axios';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal:false,
      viewCompleted : false,
      // taskList : tasks,
      activeItem:{
        title:"",
        description:"",
        completed:false
      },
      todoList: [],
    };
  }

  componentDidMount(){
    this.refreshList();
  }
  refreshList =() =>{
    axios
    .get("http://localhost:8000/api/tasks/")
    .then(res => this.setState({
      todoList:res.data
    }))
    .catch(err => console.log(err))
  };
  // Create toggle property
  toggle = () =>{
    this.setState({modal: !this.state.modal});
  }

  handleSubmit = item => {
    this.toggle();
    // alert('Saved!' + JSON.stringify(item));
    if(item.id){
      axios
      .put(`http://localhost:8000/api/tasks/${item.id}/`,item)
      .then(res => this.refreshList());
      return;
    }
    axios
    .post("http://localhost:8000/api/tasks/",item)
    .then(res => this.refreshList())
  }


  handleDelete = item => {
    // this.toggle();
    // if(item.id){
      axios
      .delete(`http://localhost:8000/api/tasks/${item.id}/`,item)
      .then(res => this.refreshList())
    // }
  }

  createItem = () =>{
    const item = { title:"",modal:!this.state.modal};
    this.setState({activeItem:item,modal:!this.state.modal});
  }

  editItem = item => {
    this.setState({activeItem:item,modal:!this.state.modal});
  }



  displayCompleted = status =>{
    if(status){
      return this.setState({viewCompleted:true})
    }
    else{
      return this.setState({viewCompleted:false})
    }
  }

  renderTabList = () =>{
    return (
      <div className='my-5 tab-list'>
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "active" : ""}
>Completed
          </span>
          <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "" :"active"}
>InCompleted
          </span>
      </div>
    )
  }

  renderItems = () => {
    const { viewCompleted} = this.state;
    const newItem = this.state.todoList.filter(
      item => item.completed == viewCompleted
    );
    return newItem.map(item =>(
      <li key={item.id} className='list-group-item d-flex justify-content-between align-items-center '>
        <span className={`todo-title mr-2 ${this.state.viewCompleted ? "completed-todo" : ""}`}>
          {item.title}
        </span>
        <span>
          <button onClick={() => this.editItem(item)} className='btn btn-info mr-2 mx-3'>Edit</button>
          <button onClick={() => this.handleDelete(item)} className='btn btn-danger mr-2'>Delete</button>

        </span>
      </li>
    ))
  };

  

  render(){
    return (
      <main className='content p-3 mb-2 bg-info'>
        <h1 className='text-white text-uppercase text-center my-4'>
          Task Manager
        </h1>
        <div className='row'>
          <div className='col-md-6 col-sma-10 mx-auto p-0'>
            <div className='card p-3'>
              <div>
                <button onClick={this.createItem} className='btn btn-warning'>Add Task</button>
              </div>
              {this.renderTabList()}
              <ul className='list-group list-group-flush'>
                {this.renderItems()}
              </ul>
            </div>
          </div>
        </div>
        {/* <footer className='my-5 mb-2 bg-info text-white text-center'></footer> */}
        {this.state.modal ? (
          <Modal activeItem={this.state.activeItem} toggle={this.toggle}
          onSave={this.handleSubmit} />
        ):null}
      </main>
    )
  }



}

export default App;
