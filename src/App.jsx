import Navbar from "./Components/Navbar";
import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import './App.css';
uuidv4();

function App() {
  let retrievedVal = JSON.parse(localStorage.getItem("allTodos"));
  let currDone = JSON.parse(localStorage.getItem("Done"));
  let showfin = JSON.parse(localStorage.getItem("showFinished"));
  if (!retrievedVal) retrievedVal = [];
  if (!currDone) currDone = 0;
  if (!showfin) showfin = false;
  const [todo, setTodo] = useState("");
  const [allTodos, setAllTodos] = useState(retrievedVal);
  const [showfinished, setShowFinished] = useState(showfin);
  const inputRef = useRef();
  const [allDone, setAllDone] = useState(currDone);

  useEffect(() => {
    localStorage.setItem("allTodos", JSON.stringify(allTodos));
    console.log(allTodos);
  }, [allTodos]);
  useEffect(() => {
    localStorage.setItem("Done", JSON.stringify(allDone));
  }, [allDone]);

  useEffect(()=>{
    localStorage.setItem("showFinished", JSON.stringify(showfinished));
  }, [showfinished]);

  const handleEdit = (event) => {
    const id = event.target.id;
    let currTodo = allTodos.filter((curr) => curr.id == id);
    setTodo(currTodo[0].todo);
    if (currTodo[0].isCompleted == true) setAllDone(allDone - 1);
    setAllTodos((prev) => {
      return prev.filter((curr) => {
        return curr.id != id;
      });
    });
    inputRef.current.focus();
  };

  const handleDelete = (event) => {
    const id = event.target.id;
    setAllTodos((prev) => {
      return prev.filter((curr) => {
        if (curr.id == id && curr.isCompleted == true) setAllDone(allDone - 1);
        return curr.id != id;
      });
    });
  };
  const handleAdd = () => {
    if (todo.length == 0) return;
    setAllTodos((prev) => {
      // return [...prev, {todo, isChangabe: false}];
      return [...prev, { id: uuidv4(), todo, isCompleted: false }];
    });
    setTodo("");
  };
  const handleChange = (event) => {
    const newValue = event.target.value;
    setTodo(newValue);
  };
  const handleCheckBox = (event) => {
    const id = event.target.id;
    // setAllTodos(prev=>{
    //   prev.forEach(curr => {
    //       if(id == curr.id) curr.isCompleted = !curr.isCompleted;
    //   });
    //   return prev;
    // })
    const index = allTodos.findIndex((curr) => {
      return curr.id === id;
    });
    let newTodos = [...allTodos];
    newTodos[index].isCompleted = !newTodos[index].isCompleted;
    if (newTodos[index].isCompleted == true) setAllDone(allDone + 1);
    else setAllDone(allDone - 1);
    setAllTodos(newTodos);
  };

  const handleShowFinished = () => {
    setShowFinished(!showfinished);
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto my-5 md:w-[35%] rounded-xl p-5 bg-violet-50 min-h-[80vh]">
        <h1 className="font-bold text-center text-lg">
          iTask - manage all your todos at one place
        </h1>
        <div className="addTodo my-5">
          <h2 className="text-lg font-bold">Add a Todo</h2>
          <div className=" flex justify-center items-center">
            <input
              value={todo}
              onChange={handleChange}
              type="text"
              className="w-full  rounded-lg py-1 px-3 border-2 border-black"
              ref={inputRef}
            />
            <button
              onClick={handleAdd}
              className="h-full border-2 border-violet-800 hover:border-violet-950 flex-[20%] mx-3 my-auto w-full bg-violet-800 hover:bg-violet-950 p-2 text-sm py-1 text-white rounded-md"
            >
              Add
            </button>
          </div>
        </div>
        <input
          onChange={handleShowFinished}
          type="checkbox"
          checked={showfinished}
        />{" "}
        Show finished
        <h1 className="text-xl font-bold">Your Todos</h1>
        {allTodos.length == 0 && <div className="m-5">Enter your todos</div>}
        {allTodos.length != 0 && allTodos.length == allDone && (
          <div className="m-5">
            Congratulations! You have completed all your tasks 🎊
          </div>
        )}
        {console.log(allDone)}
        {allTodos.map((currTodo) => {
          if (currTodo.isCompleted == true && showfinished == false) return;
          return (
            <div key={currTodo.id} className="todos">
              <div className="todo my-3 flex gap-3.5 justify-between">
                <input
                  className="flex-none"
                  onChange={handleCheckBox}
                  type="checkbox"
                  checked={currTodo.isCompleted}
                  name=""
                  id={currTodo.id}
                />
                {/* <div style={{textDecorationLine: currTodo.isCompleted?"line-through":""}}> */}
                <div
                  className={
                    currTodo.isCompleted
                      ? "line-through flex-1 text-left"
                      : "flex-1 text-left"
                  }
                >
                  {currTodo.todo}
                </div>
                <div className="buttons flex items-center align-middle h-full">
                  <button
                    onClick={handleEdit}
                    className="bg-violet-800 hover:bg-violet-950 p-2 text-sm py-1 text-white rounded-md mx-1"
                    id={currTodo.id}
                  >
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    id={currTodo.id}
                    className="bg-violet-800 hover:bg-violet-950 p-2 text-sm py-1 text-white rounded-md mx-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
