import React from 'react';
import './App.css';
import { TodoItem } from '../TodoItem/TodoItem';
import { DragDropContext, Droppable} from 'react-beautiful-dnd';
import iconSun from '../app-images/icon-sun.svg';
import iconMoon from '../app-images/icon-moon.svg';
import startTodos from '../app-images/favpng_vector-building-animation-illustration.png';

function App() {

  //LOCAL STORAGE
  const useLocalStorage= () => {
    let actualTodoList;
    if(localStorage.getItem('TodoListLocalStorage') === null){
      localStorage.setItem('TodoListLocalStorage',"[]");
      actualTodoList = [];
    } else {
      actualTodoList = JSON.parse(localStorage.getItem('TodoListLocalStorage'));
    }
    const setActualTodoList = (value) => {
      actualTodoList = value;
      localStorage.setItem('TodoListLocalStorage',JSON.stringify(actualTodoList));
    }
    const actualCounter = () => {
      const counter = actualTodoList.filter((todo) => !todo.completed).length;
      return counter
    }
    return [actualTodoList,setActualTodoList,actualCounter];
  }



  //STATES
  let [todoList,setTodoList,actualCounter] = useLocalStorage();
  let [activeTodoList,setActiveTodoList] = React.useState(todoList);
  let [completedTodoList,setCompletedTodoList] = React.useState(todoList);
  let [todoListRedered,setTodoListRedered] = React.useState(todoList);
  let [completedCounter,setCompletedCounter] = React.useState(actualCounter);
  let [filterSelected,setFilterSelected] = React.useState("all");
  let [inputTodo,setInputTodo] = React.useState("");
  let [appTheme,setAppTheme] = React.useState(iconSun);


  //FUNCTIONS
  const changeTodoStatus = (todoText) => {
    const todoIndex = todoList.findIndex(todo => todo.text === todoText);
    const newTodoList = [...todoList];
    newTodoList[todoIndex].completed = !newTodoList[todoIndex].completed;
    setTodoList(newTodoList);
    const notCompletedTodo = newTodoList.filter((todo) => (
      !todo.completed
    ))
    setCompletedCounter(notCompletedTodo.length);
    const completedTodo = newTodoList.filter((todo) => (
      todo.completed
    ))
    if(filterSelected === "all"){
      setTodoListRedered(newTodoList);  
    } else if(filterSelected === "active") {
      setTodoListRedered(notCompletedTodo);  
    } else {
      setTodoListRedered(completedTodo);  
    }
  }
  const deleteTodo = (todoText) =>{
    const todoIndex = todoList.findIndex(todo => todo.text === todoText);
    const newTodoList = [...todoList];
    if(!newTodoList[todoIndex].completed){
      newTodoList[todoIndex].completed = true;
    }
    newTodoList.splice(todoIndex,1);
    setTodoList(newTodoList);
    const notCompletedTodo = newTodoList.filter((todo) => (
      !todo.completed
    ))
    setCompletedCounter(notCompletedTodo.length);
    const completedTodo = newTodoList.filter((todo) => (
      todo.completed
    ))
    if(filterSelected === "all"){
      setTodoListRedered(newTodoList);  
    } else if(filterSelected === "active") {
      setTodoListRedered(notCompletedTodo);  
    } else {
      setTodoListRedered(completedTodo);  
    }
  }
  const clearCompleted = () => {
    const newTodoList = todoList.filter(todo => !todo.completed);
    setTodoList(newTodoList);
    setCompletedCounter(newTodoList.length);
    if(filterSelected === "completed"){
      setTodoListRedered([]);
    } else {
      setTodoListRedered(newTodoList);
    }
  }
  const selectFilterAll = () => {
    setFilterSelected("all");
    setTodoListRedered(todoList);
  }
  const selectFilterActive = () => {
    setFilterSelected("active");
    const completedTodo = todoList.filter((todo) => (
      !todo.completed
    ))
    setActiveTodoList(completedTodo);
    setTodoListRedered(completedTodo); 
  }
  const selectFilterCompleted = () => {
    setFilterSelected("completed");
    const completedTodo = todoList.filter((todo) => (
      todo.completed
    ))
    setCompletedTodoList(completedTodo);
    setTodoListRedered(completedTodo); 
  }
  const setNewInputValue = (e) => {
    setInputTodo(e.target.value);
  }
  const addNewTodo = () => {
    const newTodoList = [...todoList];
    if(inputTodo.length > 0){
      const inputVerification = newTodoList.some((todo) => (
        todo.text === inputTodo
      ))
      if(!inputVerification){
        newTodoList.unshift({text: inputTodo,completed:false});
        setTodoList(newTodoList);
        setInputTodo("");
        const notCompletedTodo = newTodoList.filter((todo) => (
          !todo.completed
        ))
        setCompletedCounter(notCompletedTodo.length);
        setFilterSelected("all");
        setTodoListRedered(newTodoList);
      } else{
        console.log("ya se agrego")
      }
    }
  }
  const changeTheme = () => {
    if(appTheme === iconSun) {
      setAppTheme(iconMoon);
    } else{
      setAppTheme(iconSun);
    }
  }
  const reorder = (todoList,startIndex,endIndex) => {
    const newTodoList = [...todoList];
    const [removed] = newTodoList.splice(startIndex, 1);
    newTodoList.splice(endIndex, 0, removed);
    return newTodoList;
  }


  return (
    <DragDropContext onDragEnd={(result) => {
      const {source,destination} = result;
      if(filterSelected === "all"){
        const newTodoList = reorder(todoList,source.index, destination.index);
        setTodoList(newTodoList);
        setTodoListRedered(newTodoList);
      }
    }}>
      <div className={`App ${appTheme === iconMoon && 'AppLight'}`}>
        {/* HEADER */}
        <header className={`headerContainer ${appTheme === iconMoon && 'headerBackgroundMoon'}`}>
          <div className='logo-container'>
            <p>TODO</p>
            <img src={appTheme} alt='Theme' onClick={changeTheme}/>
          </div>
          <div className={`inputContainer ${appTheme === iconMoon && 'inputContainerLight'}`}>
            <div className='checkboxContainer'>
              <button type='button' onClick={addNewTodo} className={`${appTheme === iconMoon && 'checkboxButtonLight'}`}/>
            </div>
            <div className='textAreaContainer'>
              <textarea value={inputTodo} placeholder='Create a new todo...' onChange={setNewInputValue} className={`${appTheme === iconMoon && 'textAreaLigth'}`}/>
            </div>
          </div>
        </header>
        {/* MAIN */}
        <main className={`mainContainer ${appTheme === iconMoon && 'mainContainerLight'}`}>
          {todoList.length === 0 && 
          <div className='startTodosContainer'>
            <img src={startTodos} alt='start todo'/>
            <p className={`${appTheme === iconMoon && 'startTodoTextLight'}`}>¡Time to work!<br/>Start adding your tasks to do</p>
          </div>}

          {todoList.length > 0 && 
          <section className={`todosContainer ${appTheme === iconMoon && 'todosContainerLight'}`}>
                <Droppable droppableId='todoItemId'>
                  {(droppableProvided) => (
                  <ul 
                    className='todosList' 
                    {...droppableProvided.droppableProps} 
                    ref={droppableProvided.innerRef}
                  >
                    {todoListRedered.map((todo,index) => (
                          <TodoItem
                            index={index}
                            key={todoListRedered[index].text} 
                            text={todoListRedered[index].text} 
                            completed={todoListRedered[index].completed} 
                            todoCompleted={changeTodoStatus} 
                            deleteTodo={deleteTodo} 
                            appTheme={appTheme}
                          />
                    ))}
                    {droppableProvided.placeholder}
                  </ul>
                  )}
                </Droppable>
              <div className={`todosCounter ${appTheme === iconMoon && 'todoCounterLight'}`}>
                  <p className={`${appTheme === iconMoon && 'todosCounterPLight'}`}>{completedCounter} items left</p>
                  <div className='filterInCounterContainer'>
                    <p className={`filterOption ${appTheme === iconMoon && 'filterOptionLight'} ${filterSelected === "all" && 'filterOptionSelected'}`} onClick={selectFilterAll}>All</p>
                    <p className={`filterOption ${appTheme === iconMoon && 'filterOptionLight'} ${filterSelected === "active" && 'filterOptionSelected'}`} onClick={selectFilterActive}>Active</p>
                    <p className={`filterOption ${appTheme === iconMoon && 'filterOptionLight'} ${filterSelected === "completed" && 'filterOptionSelected'}`} onClick={selectFilterCompleted}>Completed</p>
                  </div>
                  <p onClick={clearCompleted} className={`clearCompleted ${appTheme === iconMoon && 'todosCounterPLight'}`}>Clear completed</p>
              </div>
          </section>}

          {todoList.length > 0 && 
          <div className={`filterContainer ${appTheme === iconMoon && 'filterContainerLight'}`}>
            <p className={`filterOption ${appTheme === iconMoon && 'filterOptionLight'} ${filterSelected === "all" && 'filterOptionSelected'}`} onClick={selectFilterAll}>All</p>
            <p className={`filterOption ${appTheme === iconMoon && 'filterOptionLight'} ${filterSelected === "active" && 'filterOptionSelected'}`} onClick={selectFilterActive}>Active</p>
            <p className={`filterOption ${appTheme === iconMoon && 'filterOptionLight'} ${filterSelected === "completed" && 'filterOptionSelected'}`} onClick={selectFilterCompleted}>Completed</p>
          </div>}       

          {todoList.length > 0 && 
          <div className='dragDropContainer'>
              <div className={`${appTheme === iconMoon && 'dragDropContainerLight'}`}>
                <p className={`${appTheme === iconMoon && 'dragDropTextLight'}`}>Drag and drop to reorder list</p>
              </div>
          </div>}

        </main>
      </div>
    </DragDropContext>
  );
}

export default App;
