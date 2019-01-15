import React, { Component } from 'react';
import './App.css';
import ListElement from '../ListElement/ListElement';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wipItems: [],
      completeItems: []
    }

    this.handlePageRefresh = this.handlePageRefresh.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
  }

  componentWillMount() {
    if(localStorage.getItem('state')) {
      this.setState({
        wipItems: JSON.parse(localStorage.getItem('state')).wipItems,
        completeItems: JSON.parse(localStorage.getItem('state')).completeItems
      });
    } else {
      this.setState({
        wipItems: [],
        completeItems: []
      });
    }
    

    window.addEventListener('beforeunload', this.handlePageRefresh);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.handlePageRefresh);
  }

  handlePageRefresh() {
    localStorage.setItem('state', JSON.stringify({
      wipItems: this.state.wipItems,
      completeItems: this.state.completeItems
    }));
  }

  handleEdit(oldContent, newContent) {
    const editArr = this.state.wipItems.slice();
    const i = editArr.findIndex(element => element.content === oldContent);
    editArr[i] = { content: newContent };

    this.setState({
      wipItems: editArr
    });
  }

  /*---- WIP LIST METHODS ----*/

  /* Handles submission of text input and adds a ListElement component to the WIP list
     in this.state  */
  handleSubmit(e) {
    e.preventDefault();
    const inputContent = e.target.firstChild.value;
    const newItemsArray = this.state.wipItems.slice(0, this.state.wipItems.length);
    newItemsArray.push({content: inputContent});
    localStorage.setItem('state', JSON.stringify({
      wipItems: newItemsArray,
      completeItems: this.state.completeItems
    }))
    this.setState({wipItems: newItemsArray});
    
    e.target.firstChild.value = '';
  }

  /* Handles user clicking the delete button within the WIP list. Removes the task from all lists. */
  handleWipDelete(e, index) {
    const newArr = this.state.wipItems.filter((li, i) => i !== index);
    localStorage.setItem('state', JSON.stringify({
      wipItems: newArr,
      completeItems: this.state.completeItems
    }));
    this.setState({wipItems: newArr});
  }

  /* Handles user clicking the complete task button within the WIP list. Transfers
     ListElement component to the Complete list. */
  handleCompleteTask(e, content) {
    const newWipArr = this.state.wipItems.filter(li => li.content !== content);
    const newCompleteArr = this.state.completeItems.concat([{content: content}]);
    localStorage.setItem('state', JSON.stringify({
      wipItems: newWipArr,
      completeItems: newCompleteArr
    }));

    this.setState({wipItems: newWipArr, completeItems: newCompleteArr});
  }

  /*---- COMPLETED LIST METHODS ----*/

  /* Handles user clicking the uncomplete task button within the Completed list.
     Transfers ListElement component to the WIP list. */
  handleUncompleteTask(e, content) {
    const newCompleteArr = this.state.completeItems.filter(li => li.content !== content);
    const newWipArr = this.state.wipItems.concat([{content: content}]);

    localStorage.setItem('state', JSON.stringify({
      wipItems: newWipArr,
      completeItems: newCompleteArr
    }));

    this.setState({wipItems: newWipArr, completeItems: newCompleteArr});
  }

  /* Handles user clicking on the delete button within the Completed list.
     Removes the task from all lists. */
  handleCompleteDelete(e, index) {
    const newArr = this.state.completeItems.filter((li, i) => i !== index);
    localStorage.setItem('state', JSON.stringify({
      wipItems: this.state.wipItems,
      completeItems: newArr
    }));
    this.setState({completeItems: newArr});
  }

  /*---- DRAG AND DROP METHODS ----*/

  /* Captures content of the target of the Drag action so that it can be
     used in the drop methods */
  handleDragStart(e, content) {
    e.dataTransfer.setData("content", content);
  }

  /* Nullifies default behvior of dragOver event */
  handleDragOver(e) {
    e.preventDefault();
  }

  /* Filters out duplicate drops then transfers ListElement component from
     WIP list to Complete list */
  handleDropToComplete(e) {
    for (let i = 0; i < this.state.completeItems.length; i++) {
      if (e.dataTransfer.getData("content") === this.state.completeItems[i].content) {
        return -1;
      }
    }
    const content = e.dataTransfer.getData("content");
    const newWipArr = this.state.wipItems.filter(li => li.content !== content);
    const newCompleteArr = this.state.completeItems.concat([{content: content}])
    localStorage.setItem('state', JSON.stringify({
      wipItems: newWipArr,
      completeItems: newCompleteArr
    }));
    this.setState({wipItems: newWipArr, completeItems: newCompleteArr});
  }

  /* Filters out duplicate drops then transfers ListElement component from
     Complete list to WIP list */
  handleDropToWip(e) {
    for (let i = 0; i < this.state.wipItems.length; i++) {
      if (e.dataTransfer.getData("content") === this.state.wipItems[i].content) {
        return -1;
      }
    }
    const content = e.dataTransfer.getData("content");
    const newCompleteArr = this.state.completeItems.filter(li => li.content !== content);
    const newWipArr = this.state.wipItems.concat([{content: content}]);

    localStorage.setItem('state', JSON.stringify({
      wipItems: newWipArr,
      completeItems: newCompleteArr
    }));
    this.setState({wipItems: newWipArr, completeItems: newCompleteArr})
  }

  

  render() {
    return (
      <div className="App">
        <h1>To Do</h1>
        <div className="lists">
          <ul className="wip" onDragOver={e => this.handleDragOver(e)} onDrop={e => this.handleDropToWip(e)}>
            <h2>Work In Progress</h2>
            {this.state.wipItems.map((li, index) => 
              <ListElement 
              key={li.content} 
              content={li.content} 
              finished={false}
              handleDelete={(e) => this.handleWipDelete(e, index)} 
              handleComplete={(e) => this.handleCompleteTask(e, li.content)}
              onDragStart={e => this.handleDragStart(e, li.content)} 
              handleEdit={ this.handleEdit }
              />
            )}
            <li className="edit-task">
              <form onSubmit={this.handleSubmit.bind(this)}>
                <input type="text" placeholder="add new task.." />
              </form>
            </li>
          </ul>
          <ul className="completed" onDragOver={e => this.handleDragOver(e)} onDrop={(e) => this.handleDropToComplete(e)}>
              <h2>Completed Tasks</h2>
              {this.state.completeItems.map((li, index) => 
              <ListElement 
              key={li.content} 
              content={li.content} 
              finished={true} 
              handleDelete={(e) => this.handleCompleteDelete(e, index)} 
              handleUncomplete={(e) => this.handleUncompleteTask(e, li.content)}
              onDragStart={e => this.handleDragStart(e, li.content)}
              
              />
              )}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
