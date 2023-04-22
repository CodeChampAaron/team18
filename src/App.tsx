import React, { ChangeEvent, createContext, useState } from "react";
import "./App.css";
import { CentralItemList } from "./list-components/CentralItemList";
import { Task } from "./interfaces/task";
//import { ChangeRole } from "./list-components/selectuser";
import { User } from "./interfaces/user";
//import { Button, Form } from "react-bootstrap";
import { UserList } from "./list-components/UserList";
import { ChangeRole } from "./list-components/ChangeRole";
import { ModifyUsers } from "./list-components/ModifyUsers";
import { AdminList } from "./list-components/adminlist";
import { TASKS } from "./TASKS";
import { EditTask } from "./editing-components/EditTask";

// const TASK: Task[] =
//     //this is a completely random test task array to get something
//     //displayed, needs to be deleted once we have an actual task list
//     [
//         {
//             name: "test",
//             description: "this is the description",
//             status: false,
//             image: "picture",
//             steps: ["a", "b", "c"],
//             difficulty: 3,
//             numUsers: 2,
//             time: 1345
//         },
//         {
//             name: "test2",
//             description: "this is the description",
//             status: false,
//             image: "picture",
//             steps: ["a", "b", "c"],
//             difficulty: 3,
//             numUsers: 1,
//             time: 1345
//         }
//     ];

function App(): JSX.Element {
    const [role, setRole] = useState<User>({ name: "User1", userList: TASKS }); //I set this intial user to make the user list display something
    const [roles, setRoles] = useState<User[]>([
        { name: "Please Select: ", userList: [] }, //Please select is necessary because the first item in drop down list is not selectable
        { name: "Super", userList: [] },
        { name: "Admin", userList: [] },
        { name: "User1", userList: TASKS }
    ]); // these are original users these can be changed
    const [tasks, setTasks] = useState<Task[]>(TASKS);

    function updateRole(event: React.ChangeEvent<HTMLSelectElement>) {
        const NewRole = roles.find(
            (role: User) => role.name === event.target.value
        );
        if (NewRole) {
            setRole(NewRole);
        }
    }

    // function updateTasks(tasks: Task[]) {
    //     setTasks(tasks);
    // }

    return (
        <div className="App">
            <header className="App-header">
                <hgroup>
                    <h1>TimeWise</h1>
                    <i>Never waste another second</i>
                </hgroup>

                {/*Role Selection, DropDown Menu: */}
                <div className="dropdown">
                    <span>Role select</span>
                    <div className="dropdown-content">
                        <div>
                            <ChangeRole
                                Role={role}
                                roles={roles}
                                setRole={updateRole}
                            ></ChangeRole>
                        </div>
                    </div>
                </div>
            </header>
            <div className="welcome">
                Welcome {role.name}, lets reclaim the day!
            </div>
            <div>
                Team Members: Cornelia Meiss, Kaitlyn Sullivan,Aaron Oster,
                William Sharp, Sydni Wright
            </div>

            {/*Adding and Deleting Users: */}
            <div>
                <div>
                    {role.name === "Super" ? (
                        <ModifyUsers
                            Role={role}
                            roles={roles}
                            setRoles={setRoles}
                        ></ModifyUsers>
                    ) : null}
                </div>
            </div>

            {/* <div>
                <EditTask
                    tasks={tasks}
                    updateTasks={setTasks}
                    task={tasks[0]}
                ></EditTask>
            </div> */}

            {/* Displaying the Lists: */}
            <div>
                <UserList
                    user={role}
                    tasks={tasks}
                    setTasks={setTasks}
                ></UserList>
            </div>
            <div className="central">
                <CentralItemList
                    tasks={tasks}
                    role={role.name}
                    setTasks={setTasks}
                ></CentralItemList>
                <div>
                    <AdminList
                        tasks={tasks}
                        role={role.name}
                        setTasks={setTasks}
                    ></AdminList>
                </div>
            </div>
        </div>
    );
}

export default App;
