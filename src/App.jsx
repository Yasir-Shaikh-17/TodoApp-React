import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { parse, v4 as uuidv4 } from "uuid";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { supabase } from "./services/supabase.service";
import { SupabaseClient } from "@supabase/supabase-js";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showFinished, setshowFinished] = useState(true);
  const [editingId, setEditingId] = useState();

  // ============= INITIAL FETCH FROM DATABASE =============
  const fetchTodos = async () => {
    let response = await supabase.from("Todo").select("*");
    let todo = response.data;
    setTodos(todo ?? []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // ============= HANDLE CHANGE =============
  const handleChange = (e) => {
    setTodo(e.target.value);
  };

  // ============= HANDLE ADD =============
  const handleAdd = async () => {
    await supabase.from("Todo").insert({ todo: todo });
    setTodo("");
    fetchTodos();
  };

  // ============= HANDLE EDIT =============
  const handleEdit = async (e, id) => {
    const { data } = await supabase.from("Todo").select().eq("id", id).single();
    setTodo(data.todo);
    setEditingId(id);
    setTodos((prev) => prev.filter((item) => item.id !== id));
  };

  const updateTodo = async () => {
    const { data } = await supabase
      .from("Todo")
      .update({ todo: todo })
      .eq("id", editingId)
      .select()
      .single();
    setTodos((prev) =>
      prev.map((item) => (item.id === editingId ? data : item)),
    );

    setTodo("");
    setEditingId(undefined);
    fetchTodos();
  };

  useEffect(() => {
    console.log(editingId);
  }, [editingId]);

  // ============= HANDLE DELETE =============
  const handleDelete = async (e, id) => {
    const { data } = await supabase
      .from("Todo")
      .delete()
      .eq("id", id)
      .select()
      .single();
    console.log(data);
    setTodos((prev) => prev.map((item) => (item.id === id ? data : item)));
    fetchTodos();
  };

  // ============= HANDLE CHECKBOX =============
  const handleCheckbox = async (id, isCompleted) => {
    const { data } = await supabase
      .from("Todo")
      .update({ isCompleted: !isCompleted })
      .eq("id", id)
      .select()
      .single();

    setTodos((prev) => prev.map((item) => (item.id === id ? data : item)));
  };

  // ============= TOGGLE FINISHED =============
  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };

  // ============= HANDLE DELETE ALL =============
  const handleDeleteAll = async() => {
    let ans = confirm("Do you Really Want To Delete All Tasks?");

    if (ans) {
      await supabase.from("Todo").delete().not("id", "is", null);
      setTodos([])
    }

  };

  useEffect(() => {
    // This function runs when a key is pressed
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        if (editingId != null) {
          updateTodo();
        } else {
          handleAdd();
        }
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
    // START
    <>
      <Navbar />
      <div className="addTodo md:container m-auto bg-orange-500 p-3 rounded-xl h-[86vh] my-3">
        <div className="addTodoSection flex justify-between items-center h-[10%]">
          <input
            onChange={handleChange}
            value={todo}
            type="text"
            placeholder="Enter Your Todo"
            className="border-2 border-white w-[85%] min-[500px]:w-[88%] md:w-[92%] rounded-full pl-4 text-white focus:outline-none md:p-2"
          />
          <button
            onClick={editingId ? updateTodo : handleAdd}
            disabled={todo.length < 1}
            className="flex items-center justify-center h-6 w-15 min-[500px]:h-8 min-[500px]:w-18 md:h-10 md:w-22 font-bold text-lg md:text-xl text-orange-500 bg-orange-100 rounded-full cursor-pointer duration-300 transition disabled:bg-orange-700 disabled:text-orange-100"
          >
            {editingId ? "update" : "save"}
          </button>
        </div>

        <div className="TodosSection h-[90%]">
          <div className="h-[15%] relative z-10">
            <div className="flex justify-between items-center h-[50%]">
              <div className="flex items-center">
                <label
                  htmlFor="show-finished"
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
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
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </label>

                <span className="text-white font-bold text-md min-[500px]:text-lg md:text-xl mx-4">
                  Show Finished
                </span>
              </div>
              <div
                onClick={handleDeleteAll}
                className="m-1 text-white h-8 w-8 min-[500px]:h-10 min-[500px]:w-12 md:h-12 md:w-15 bg-red-500 rounded-lg text-lg min-[500px]:text-xl md:text-3xl flex justify-center items-center cursor-pointer hover:bg-red-600 transition duration-150"
              >
                <MdDelete />
              </div>
            </div>
            <div className="TodosHeading text-4xl font-bold text-white shadow-md shadow-black/20 p-1">
              Your Todos
            </div>
          </div>
          {todos.length === 0 && (
            <div className="text-xl font-bold text-white my-2 h-[85%] overflow-y-auto">
              No Todos To Show
            </div>
          )}

          <div className="p-1 h-[84%] overflow-y-auto relative z-0">
            {todos.map((item) => {
              return (
                (showFinished || !item.isCompleted) && (
                  <div
                    key={item.id}
                    className="todo flex justify-between border-2 text-orange-100 items-center p-2 rounded-xl my-2"
                  >
                    <div className="flex gap-3 items-center">
                      {/* <input className="min-[500px]:w-4 h-4 md:w-5 md:h-5  accent-white border-2 rounded focus:outline-none transition duration-200" name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} /> */}
                      {/* <div className={item.isCompleted ? "line-through min-[500px]:font-bold" : "min-[500px]:font-bold"}>{item.todo}</div> */}
                      <label
                        htmlFor={item.id}
                        className="flex items-center gap-3 cursor-pointer select-none"
                      >
                        {/* Hidden Native Checkbox for logic */}
                        <input
                          id={item.id}
                          name={item.id}
                          type="checkbox"
                          onChange={() => {
                            handleCheckbox(item.id, item.isCompleted);
                          }}
                          checked={item.isCompleted}
                          className="sr-only"
                        />

                        {/* Custom Styled Checkbox */}
                        <div
                          className={`w-5 h-5 rounded border-2 border-orange-500 flex items-center justify-center transition duration-200 ${item.isCompleted ? "bg-orange-600" : "bg-white"}`}
                        >
                          {item.isCompleted && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={3}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Todo Text */}
                        <div
                          className={
                            item.isCompleted
                              ? "line-through font-bold text-white"
                              : "font-bold text-white"
                          }
                        >
                          {item.todo}
                        </div>
                      </label>
                    </div>
                    <div className="buttons flex gap-2">
                      <button
                        onClick={(e) => handleEdit(e, item.id)}
                        className="border-0 h-6 min-[500px]:h-8 md:h-10 bg-orange-100 text-orange-500 font-semibold rounded-lg px-3 md:px-5 hover:bg-orange-500 hover:text-orange-100 hover:border-2 border-orange-100 duration-300 transition cursor-pointer"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          handleDelete(e, item.id);
                        }}
                        className="border-0 h-6 min-[500px]:h-8 md:h-10 bg-orange-100 text-orange-500 font-semibold rounded-lg px-3 md:px-5 hover:bg-orange-500 hover:text-orange-100 hover:border-2 border-orange-100 duration-300 transition cursor-pointer"
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
