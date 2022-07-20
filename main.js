const todoInputElem = document.querySelector('.todo-input');
const todoListElem = document.querySelector('.todo-list');
const completeAllBtnElem = document.querySelector('.complete-all-btn');
const leftItemsElem = document.querySelector('.left-items')
const showAllBtnElem = document.querySelector('.show-all-btn');
const showActiveBtnElem = document.querySelector('.show-active-btn');
const showCompletedBtnElem = document.querySelector('.show-completed-btn');
const clearCompletedBtnElem = document.querySelector('.clear-completed-btn');


let id=-1;
const setId = (newId) => {id = newId};

let isAllCompleted = false; // 전체 todos 체크 여부
const setIsAllCompleted = (bool) => { isAllCompleted = bool};

let currentShowType = 'all'; // all  | active | complete
const setCurrentShowType = (newShowType) => currentShowType = newShowType

let todos = []; // 현재 todos 리스트
const setTodos = (newTodos) => {
    todos = newTodos;
}

const getAllTodos = () => { // 현재 todos 리스트 return
    return todos;
}
const getCompletedTodos = () => { // 완료한 todos 리스트 return
    return todos.filter(todo => todo.isCompleted === true );
}
const getActiveTodos = () => { // 해야할 todos 리스트 return
    return todos.filter(todo => todo.isCompleted === false);
}

const setLeftItems = () => { // 남은 개수 text 변경
    const leftTodos = getActiveTodos()
    leftItemsElem.innerHTML = `${leftTodos.length} items left`
}

const completeAll = () => { // 모두 완료로 설정
    completeAllBtnElem.classList.add('checked');
    const newTodos = getAllTodos().map(todo => ({...todo, isCompleted: true }) )
    setTodos(newTodos)

    const objString = JSON.stringify(newTodos);
    window.localStorage.setItem('todos', objString);
}

const incompleteAll = () => { // 모두 미완료로 설정
    completeAllBtnElem.classList.remove('checked');
    const newTodos =  getAllTodos().map(todo => ({...todo, isCompleted: false }) );
    setTodos(newTodos)

    const objString = JSON.stringify(newTodos);
    window.localStorage.setItem('todos', objString);
}

const checkIsAllCompleted = () => { // 전체 todos의 check 여부 (isCompleted)
    if(getAllTodos().length === getCompletedTodos().length ){
        setIsAllCompleted(true);
        completeAllBtnElem.classList.add('checked');
    }else {
        setIsAllCompleted(false);
        completeAllBtnElem.classList.remove('checked');
    }
}

const onClickCompleteAll = () => { // 모두 완료/미완료 설정 버튼 함수
    if(!getAllTodos().length) return; // todos배열의 길이가 0이면 return;

    if(isAllCompleted) incompleteAll(); // isAllCompleted가 true이면 todos를 전체 미완료 처리 
    else completeAll(); // isAllCompleted가 false이면 todos를 전체 완료 처리 

    setIsAllCompleted(!isAllCompleted); // isAllCompleted 토글
    paintTodos(); // 새로운 todos를 렌더링
    setLeftItems()
}

const appendTodos = (text) => { // 현재 Todo list에 append
    const newId = id + 1; // 기존에 i++ 로 작성했던 부분을 setId()를 통해 id값을 갱신하였다.
    setId(newId)

    const newTodos = getAllTodos().concat({id: newId, isCompleted: false, content: text })
    // const newTodos = [...getAllTodos(), {id: newId, isCompleted: false, content: text }]
    setTodos(newTodos)
    const objString = JSON.stringify(newTodos);
    window.localStorage.setItem('todos', objString);
    setLeftItems()
    checkIsAllCompleted();
    paintTodos();
}

const deleteTodo = (todoId) => { // 현재 Todo list에서 delete
    const newTodos = getAllTodos().filter(todo => todo.id !== todoId );
    setTodos(newTodos);
    const objString = JSON.stringify(newTodos);
    window.localStorage.setItem('todos', objString);
    setLeftItems()
    paintTodos()
}

const completeTodo = (todoId) => { // todo의 완료 설정
    const newTodos = getAllTodos().map(todo => todo.id === todoId ? {...todo,  isCompleted: !todo.isCompleted} : todo )
    setTodos(newTodos);
    const objString = JSON.stringify(newTodos);
    window.localStorage.setItem('todos', objString);
    paintTodos();
    setLeftItems()
    checkIsAllCompleted();
}

const updateTodo = (text, todoId) => { // todo의 내용 변경
    const currentTodos = getAllTodos();
    const newTodos = currentTodos.map(todo => todo.id === todoId ? ({...todo, content: text}) : todo);
    setTodos(newTodos);
    const objString = JSON.stringify(newTodos);
    window.localStorage.setItem('todos', objString);
    paintTodos();
}

const onDbclickTodo = (e, todoId) => { // 더블 클릭시 실행 함수
    const todoElem = e.target;
    const inputText = e.target.innerText;
    const todoItemElem = todoElem.parentNode;
    const inputElem = document.createElement('input');
    inputElem.value = inputText;
    inputElem.classList.add('edit-input');
    inputElem.addEventListener('keypress', (e)=>{
        if(e.key === 'Enter') {
            updateTodo(e.target.value, todoId);
            document.body.removeEventListener('click', onClickBody );
        }
    })

    const onClickBody = (e) => {
        if(e.target !== inputElem)  {
            todoItemElem.removeChild(inputElem);
            document.body.removeEventListener('click', onClickBody );
        }
    }
    
    document.body.addEventListener('click', onClickBody)
    todoItemElem.appendChild(inputElem);
}

const clearCompletedTodos = () => { // clear completed 클릭시 실행. 미완료 todo만 남기고 삭제
    const newTodos = getActiveTodos()
    setTodos(newTodos)
    const objString = JSON.stringify(newTodos);
    window.localStorage.setItem('todos', objString);
    paintTodos();
}

const paintTodo = (todo) => { // paintTodos 안의 함수
    const todoItemElem = document.createElement('li');
    todoItemElem.classList.add('todo-item');

    todoItemElem.setAttribute('data-id', todo.id );

    const checkboxElem = document.createElement('div');
    checkboxElem.classList.add('checkbox');
    checkboxElem.addEventListener('click', () => completeTodo(todo.id))

    const todoElem = document.createElement('div');
    todoElem.classList.add('todo');
    todoElem.addEventListener('dblclick', (event) => onDbclickTodo(event, todo.id))
    todoElem.innerText = todo.content;

    const delBtnElem = document.createElement('button');
    delBtnElem.classList.add('delBtn');
    delBtnElem.addEventListener('click', () =>  deleteTodo(todo.id))
    delBtnElem.innerHTML = 'X';

    if(todo.isCompleted) {
        todoItemElem.classList.add('checked');
        checkboxElem.innerText = '✔';
    }

    todoItemElem.appendChild(checkboxElem);
    todoItemElem.appendChild(todoElem);
    todoItemElem.appendChild(delBtnElem);

    todoListElem.appendChild(todoItemElem);
}

const paintTodos = () => { // html 부분의 todolist UI 설정
    todoListElem.innerHTML = null;

    switch (currentShowType) {
        case 'all':
            const allTodos = getAllTodos();
            allTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'active': 
            const activeTodos = getActiveTodos();
            activeTodos.forEach(todo => { paintTodo(todo);});
            break;
        case 'completed': 
            const completedTodos = getCompletedTodos();
            completedTodos.forEach(todo => { paintTodo(todo);});
            break;
        default:
            break;
    }
}

const onClickShowTodosType = (e) => { // showtype 설정
    const currentBtnElem = e.target;
    const newShowType = currentBtnElem.dataset.type;

    if ( currentShowType === newShowType ) return;

    const preBtnElem = document.querySelector(`.show-${currentShowType}-btn`);
    preBtnElem.classList.remove('selected');

    currentBtnElem.classList.add('selected')
    setCurrentShowType(newShowType)
    paintTodos();
}

const init = () => { // init 함수
    todoInputElem.addEventListener('keypress', (e) =>{
        if( e.key === 'Enter' ){
            appendTodos(e.target.value); 
            todoInputElem.value ='';
        }
    })
    completeAllBtnElem.addEventListener('click',  onClickCompleteAll);
    showAllBtnElem.addEventListener('click', onClickShowTodosType);
    showActiveBtnElem.addEventListener('click',onClickShowTodosType);
    showCompletedBtnElem.addEventListener('click',onClickShowTodosType);
    clearCompletedBtnElem.addEventListener('click', clearCompletedTodos);
    setLeftItems()
}

const initID = () => { // 페이지 로드 시 localStorage id 초기화
    const todosString = window.localStorage.getItem('todos');
    const todosObj = JSON.parse(todosString);
    
    todosObj.forEach((currentID, index) => { 
        todosObj[index].id = index;
    });

    setTodos(todosObj);
    const objString = JSON.stringify(todosObj);
    window.localStorage.setItem('todos', objString);
    setId(todosObj.length-1);
}

window.onload=function(){ // 페이지 로드 시 첫 실행 함수
    const todosString = window.localStorage.getItem('todos');
    const todosObj = JSON.parse(todosString);
    
    if(!todosObj){
        init()
    }else{
        setTodos(todosObj);
        init()
        initID();
        paintTodos();
    }
}

