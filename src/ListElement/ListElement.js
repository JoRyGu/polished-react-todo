import React, { Component } from 'react';

class ListElement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            edit: false,
            content: this.props.content,
            finished: this.props.finished
        }
    }

    /* Handles user clicking the edit button. Causes re-render to display
       a text input in place of the final task contents. */
    handleEdit() {
        if (this.state.edit === false) {
            this.setState({edit: true});
        } else {
            this.setState({edit: true});
        }
    }

    /* Handles submission of text input on a ListElement with this.state.edit set
       to true. */
    handleSubmit(e) {
        e.preventDefault();
        this.props.handleEdit(this.props.content, e.target.firstChild.value);
        const inputContent = e.target.firstChild.value;
        this.setState({edit: false, content: inputContent});
    }

    render() {
        if (this.state.edit === false) {
            if (this.state.finished === false) {
                return (
                    <li className="saved-task" draggable onDragStart={this.props.onDragStart} >
                        {this.state.content}
                        <div className="buttons">
                            <span><button className="buttons" id="finish" onClick={this.props.handleComplete}><ion-icon name="checkmark"></ion-icon></button></span>
                            <span><button className="buttons" id="edit" onClick={this.handleEdit.bind(this)}><ion-icon name="build"></ion-icon></button></span>
                            <span><button className="buttons" id="delete" onClick={this.props.handleDelete}><ion-icon name="trash"></ion-icon></button></span>
                        </div>
                    </li>
                )
            } else {
                return (
                    <li className="saved-task finished" draggable onDragStart={this.props.onDragStart}>
                        {this.state.content}
                        <div className="buttons">
                            <span><button className="buttons" id="finish" onClick={this.props.handleUncomplete}><ion-icon name="undo"></ion-icon></button></span>
                            <span><button className="buttons" id="delete" onClick={this.props.handleDelete}><ion-icon name="trash"></ion-icon></button></span>
                        </div>
                    </li>
                );
            }
        } else {
            return (
                <li className="edit-task">
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <input type="text" placeholder={this.state.content} autoFocus/>
                    </form>
                </li>
            );
        }
    }
}

export default ListElement;