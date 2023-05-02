/* eslint-disable indent */
import React from "react";
//import { Button } from "react-bootstrap";
import { DisplayTask } from "./DisplayTask";
import { Task } from "../interfaces/task";
import "./adminList.css";
import { Button } from "react-bootstrap";
import { filter_by_alphabetical_order } from "./filterlists";
import { filter_by_difficulty } from "./filterlists";
import { filter_by_time_needed } from "./filterlists";
import { User } from "../interfaces/user";
import { UserList } from "./UserList";

interface AdminItemProps {
    tasks: Task[];
    users: User[];
    setUsers: (newUsers: User[]) => void;
    user: User;
    setTasks: (newTasks: Task[]) => void;
    setUser: (newUser: User) => void;
    //setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export function AdminList({
    setUsers,
    users,
    user,
    tasks,
    setTasks,
    setUser
}: AdminItemProps) {
    function setAdminlist(tasks: Task[]) {
        const adminlist = tasks.map((task: Task): any => {
            return task.numUsers <= 2
                ? { ...task, steps: [...task.steps] }
                : {};
        });
        adminlist === null ? null : editAdminlist(adminlist);
    }
    function editAdminlist(newTasks: Task[]) {
        const newUser = { name: user.name, userList: newTasks };
        setUser({ name: user.name, userList: newTasks });
        const newRoles = users.map((role: User) =>
            role.name === newUser.name
                ? newUser
                : {
                      name: role.name,
                      userList: role.userList.map((T: Task) => ({
                          ...T,
                          steps: [...T.steps]
                      }))
                  }
        );
        setUsers(newRoles);
    }
    function sort(type_of_sort: string): void {
        if (type_of_sort == "alphabet") {
            setUser({
                name: user.name,
                userList: filter_by_alphabetical_order(user.userList)
            });
        } else if (type_of_sort == "time") {
            setUser({
                name: user.name,
                userList: filter_by_time_needed(user.userList)
            });
        } else if (type_of_sort == "difficulty") {
            setUser({
                name: user.name,
                userList: filter_by_difficulty(user.userList)
            });
        }
    }
    if (user.name === "Admin") {
        return (
            <div className="AdminList">
                {setAdminlist(tasks)}
                <div className="Admin">
                    <span> Admin List </span>
                    {user.userList.map((TASK: Task, index: number) => (
                        <DisplayTask
                            key={index}
                            task={TASK}
                            tasks={tasks}
                            updateTasks={setTasks}
                            role={user.name}
                        ></DisplayTask>
                    ))}
                </div>

                <Button onClick={() => sort("alphabet")}>
                    Sort by Alphabetical Order{" "}
                </Button>
                <Button onClick={() => sort("difficulty")}>
                    Sort By Difficulty{" "}
                </Button>
                <Button onClick={() => sort("time")}>
                    Sort By Time Needed{" "}
                </Button>
            </div>
        );
    } else {
        return null;
    }
}
