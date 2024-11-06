import React, { useEffect, useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Todo from './Todo';
import { db } from './firebase/firebase';
import { query, collection, onSnapshot, addDoc } from 'firebase/firestore';

const style = {
  bg: `h-screen w-screen p-4 bg-gradient-to-r from-[#2F80ED] to-[#1CB5E0]`,
  container: `bg-slate-100 max-w-[500px] w-full m-auto rounded-md shadow-xl p-4`,
  heading: `text-3xl font-bold text-center text-gray-800 p-2`,
  form: `flex justify-between`,
  input: `border p-2 w-full text-xl`,
  button: `border p-4 ml-2 bg-purple-500 text-slate-100`,
  count: `text-center p-2`,
};

function App() {
  const [todos, setTodos] = useState([]);
  const [todoText, setTodoText] = useState(''); // State for the input field

  useEffect(() => {
    const q = query(collection(db, 'TodoList'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let todosArr = [];
      querySnapshot.forEach((doc) => {
        todosArr.push({ ...doc.data(), id: doc.id });
      });
      setTodos(todosArr);
      console.log('todoarr', todosArr);
    });

    return () => unsubscribe();  // Clean up the subscription
  }, []);

  // Handle adding a new todo
  const addTodo = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (todoText.trim()) {
      try {
        await addDoc(collection(db, 'TodoList'), {
          text: todoText,
          completed: false,
        });
        setTodoText(''); // Clear the input field after adding the todo
      } catch (error) {
        console.error('Error adding todo: ', error);
      }
    }
  };

  return (
    <div className={style.bg}>
      <div className={style.container}>
        <h3 className={style.heading}>Todo App</h3>
        <form className={style.form} onSubmit={addTodo}>
          <input
            className={style.input}
            type='text'
            placeholder='Add Todo'
            value={todoText}
            onChange={(e) => setTodoText(e.target.value)} // Update state on input change
          />
          <button className={style.button} type='submit'>
            <AiOutlinePlus size={30} />
          </button>
        </form>
        <ul>
          {todos.map((todo, index) => (
            <Todo key={index} todo={todo} />
          ))}
        </ul>
        <p className={style.count}> You have {todos.length} todos </p>
      </div>
    </div>
  );
}

export default App;
