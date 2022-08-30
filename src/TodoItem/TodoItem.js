import React from "react";
import { Draggable } from 'react-beautiful-dnd';
import './TodoItem.css';
import iconCross from '../app-images/icon-cross.svg';
import iconMoon from '../app-images/icon-moon.svg';

function TodoItem(props) {
    let checkedTodo = () => {
        if(props.completed){
            if(props.appTheme === iconMoon){
                return "checkedLight";
            } else {
                return "checkedDark";
            }
        }
        return "";
    }

    return(
        <Draggable draggableId={props.text} index={props.index}>
            {(draggableProvided) => (
                <li 
                    className={`todoItemContainer ${props.appTheme === iconMoon && 'todoItemContainerLight'}`}
                    {...draggableProvided.draggableProps}
                    {...draggableProvided.dragHandleProps}
                    ref={draggableProvided.innerRef}
                >
                    <div className='itemCheckboxContainer'>
                        <input className={`checkbox ${props.completed && 'checkboxSelected'} ${props.appTheme === iconMoon && 'checkboxLight'}`} type="checkbox" onClick={() => {props.todoCompleted(props.text);}}/>
                    </div>
                    <div className='todoTextContainer'>
                        <p className={`todoText ${checkedTodo()} ${props.appTheme === iconMoon && 'todoTextLight'}`}>{props.text}</p>
                    </div>
                    <div className="crossContainer">
                        <img src={iconCross} alt='Cross' onClick={() => props.deleteTodo(props.text)}/>
                    </div>
                </li>
            )}
        </Draggable>
    );
}

export { TodoItem };