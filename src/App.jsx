import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { parse, v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setshowFinished] = useState(true)
  useEffect(() => {
    let localString = localStorage.getItem("todos")
    if (localString) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])


  const handleChange = (e) => {
    setTodo(e.target.value)
  }

  const handleAdd = () => {
    setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }])
    setTodo("")
    SaveToLs()
  }

  const handleEdit = (e, id) => {
    let t = todos.filter(i => i.id === id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
    SaveToLs()
  }

  const handleDelete = (e, id) => {
    const answer = confirm("Are you sure you want to delete todo?");

    if (answer === false) {
      return;
    } else {
      let newTodos = todos.filter(item => item.id !== id);
      setTodos(newTodos);
      SaveToLs()
    }
  };


  const handleCheckbox = (e) => {
    let id = e.target.name
    let index = todos.findIndex(item => {
      return item.id === id
    })
    let newTodos = [...todos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    setTodos(newTodos)
    SaveToLs()
  }


  const SaveToLs = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }


  const toggleFinished = () => {
    setshowFinished(!showFinished)
  }

  const handleDeleteAll = () => {
    let ans = confirm("Do you Really Want To Delete All Tasks?")
    if (ans) {
      setTodos([])
      localStorage.removeItem("todos");
    }
    else {

    }
  }

  useEffect(() => {
    // This function runs when a key is pressed
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        handleAdd();
      }
    };

    // Add the keypress event when component loads
    window.addEventListener("keypress", handleKeyPress);

    // Remove the event when component reloads or unmounts (to avoid duplicates)
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [todo, todos]); // This means: run the effect again only if todo or todos change






  return (
    <>
      <Navbar />
      <div className="addTodo md:container m-auto bg-orange-500 p-3 rounded-xl min-h-[86vh] my-3">

        <div className="addTodoSection flex justify-between items-center">
          <input onChange={handleChange} value={todo} type="text" placeholder='Enter Your Todo' className='border-2 border-white w-[85%] min-[500px]:w-[88%] md:w-[92%] rounded-full pl-4 text-white focus:outline-none md:p-2' />
          <button onClick={handleAdd} disabled={todo.length < 1} className='flex items-center justify-center h-6 w-15 min-[500px]:h-8 min-[500px]:w-18 md:h-10 md:w-22 font-bold text-lg md:text-xl text-orange-500 bg-orange-100 rounded-full cursor-pointer duration-300 transition disabled:bg-orange-700 disabled:text-orange-100'>Save</button>
        </div>

        <div className="TodosSection">
          <div className=''>
            <div className='flex justify-between items-center'>
              <div className='flex items-center'>
                {/* {<input type="checkbox" onChange={toggleFinished} checked={showFinished} className="h-3 w-3 min-[500px]:w-4 min-[500px]:h-4 md:w-5 md:h-5 bg-orange-100 checked:bg-orange-500 accent-white border-2 border-orange-500 rounded focus:outline-none transition duration-200"
                />} */}
                <label htmlFor="show-finished" className="flex items-center gap-2 cursor-pointer select-none">
                  {/* Hidden Native Checkbox */}
                  <input
                    type="checkbox"
                    id="show-finished"
                    onChange={toggleFinished}
                    checked={showFinished}
                    className="sr-only"
                  />

                  {/* Custom Checkbox Box */}
                  <div
                    className={`flex items-center justify-center rounded border-2 transition duration-200
      border-orange-500 bg-orange-100
      h-4 w-4 min-[500px]:w-5 min-[500px]:h-5 md:w-6 md:h-6
      ${showFinished ? "bg-orange-600" : ""}
    `}
                  >
                    {showFinished && (
                      <svg
                        className="w-3.5 h-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>

                <span className='text-white font-bold text-md min-[500px]:text-lg md:text-xl mx-4'>Show Finished</span>
              </div>
              <div onClick={handleDeleteAll} className='m-1 text-white h-8 w-8 min-[500px]:h-10 min-[500px]:w-12 md:h-12 md:w-15 bg-red-500 rounded-lg text-lg min-[500px]:text-xl md:text-3xl flex justify-center items-center cursor-pointer hover:bg-red-600 transition duration-150'><MdDelete /></div>
            </div>
          </div>
          <div className="TodosHeading text-4xl font-bold text-white shadow-md shadow-black/20 p-1">Your Todos</div>
          {todos.length === 0 && <div className='text-xl font-bold text-white my-2'>No Todos To Show</div>}

          <div className='h-130 md:h-99 my-1 overflow-y-auto p-1'>
            {todos.map(item => {
              return (showFinished || !item.isCompleted) &&
                <div key={item.id} className="todo flex justify-between border-2 text-orange-100 items-center p-2 rounded-xl my-2">
                  <div className='flex gap-3 items-center'>
                    {/* <input className="min-[500px]:w-4 h-4 md:w-5 md:h-5  accent-white border-2 rounded focus:outline-none transition duration-200" name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} /> */}
                    {/* <div className={item.isCompleted ? "line-through min-[500px]:font-bold" : "min-[500px]:font-bold"}>{item.todo}</div> */}
                    <label htmlFor={item.id} className="flex items-center gap-3 cursor-pointer select-none">
                      {/* Hidden Native Checkbox for logic */}
                      <input
                        id={item.id}
                        name={item.id}
                        type="checkbox"
                        onChange={handleCheckbox}
                        checked={item.isCompleted}
                        className="sr-only"
                      />

                      {/* Custom Styled Checkbox */}
                      <div className={`w-5 h-5 rounded border-2 border-orange-500 flex items-center justify-center transition duration-200
    ${item.isCompleted ? "bg-orange-600" : "bg-white"}`}>
                        {item.isCompleted && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>

                      {/* Todo Text */}
                      <div className={item.isCompleted ? "line-through font-bold text-white" : "font-bold text-white"}>
                        {item.todo}
                      </div>
                    </label>

                  </div>
                  <div className="buttons flex gap-2">
                    <button onClick={(e) => handleEdit(e, item.id)} className='border-0 h-6 min-[500px]:h-8 md:h-10 bg-orange-100 text-orange-500 font-semibold rounded-lg px-3 md:px-5 hover:bg-orange-500 hover:text-orange-100 hover:border-2 border-orange-100 duration-300 transition cursor-pointer'><FaEdit /></button>
                    <button onClick={(e) => { handleDelete(e, item.id) }} className='border-0 h-6 min-[500px]:h-8 md:h-10 bg-orange-100 text-orange-500 font-semibold rounded-lg px-3 md:px-5 hover:bg-orange-500 hover:text-orange-100 hover:border-2 border-orange-100 duration-300 transition cursor-pointer'><MdDelete /></button>
                  </div>
                </div>


            })}

          </div>


        </div>

      </div>
    </>
  )
}

export default App
