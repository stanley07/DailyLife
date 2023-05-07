import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
import { TODO_LIST_ABI, TODO_LIST_ADDRESS } from './config'

class App extends Component {

  componentDidMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const network = await web3.eth.net.getNetworkType()
    console.log("network:", network)
    const accounts = await web3.eth.getAccounts()
    console.log("account", accounts[0])
    this.setState({ account: accounts[0] })
    const todoList = new web3.eth.Contract(TODO_LIST_ABI, TODO_LIST_ADDRESS)
    this.setState({ todoList })
    console.log("todoList", todoList)
    const taskCount = await todoList.methods.taskCount().call()
    this.setState({ taskCount })
    for (var i = 1; i <= taskCount; i++) {
      const task = await todoList.methods.tasks(i).call();
      this.setState({
        tasks: [...this.state.tasks, task]
      })
    } 
  }
    async createTask(event) {
      event.preventDefault();
      const content = event.target.newTask.value;
      if(!content) {
        alert('Please enter a task');
        return;
      }
      
      
      event.target.reset();
      const todoList = this.state.todoList
      await todoList.methods.createTask(content).send({ from: this.state.account })
      const taskCount = await todoList.methods.taskCount().call()
      const newTask = await todoList.methods.tasks(taskCount).call()
      this.setState({
        tasks: [...this.state.tasks, newTask]
      })
      return newTask
    }
    
     


  

  constructor(props) {
    super(props);
    this.state = { 
      account: '',
      taskCount: 0,
      tasks: [],
      todoList: null,
    }
    this.createTask = this.createTask.bind(this);
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.dappuniversity.com/free-download" target="_blank">Dapp University | Todo List</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small><a className="nav-link" href="#"><span id="account"></span></a></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              <div id="loader" className="text-center">
                <p className="text-center">Loading...</p>
              </div>
              <div id="content">
                <form onSubmit={this.createTask}>
                  <input id="newTask" type="text" className="form-control" placeholder="Add task..." required />
                  <input type="submit" hidden="" />
                </form>
                <ul id="taskList" className="list-unstyled">
                  { this.state.tasks.map((task, key) => {
                    return(
                      <div className="taskTemplate checkbox" key={key}>
                        <label>
                          <input type="checkbox" />
                          <span className="content">{task.content}</span>
                        </label>
                      </div>
                    )
                  })}
                </ul>
                <ul id="completedTaskList" className="list-unstyled">
                </ul>
              </div>
            </main>
          </div>
        </div>
        
      </div>
    )
  }
}

export default App;
