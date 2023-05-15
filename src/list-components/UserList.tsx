/* eslint-disable indent */
import React, { useState } from "react";
import { Task } from "../interfaces/task";
import { User } from "../interfaces/user";
import { DisplayTask } from "./DisplayTask";
import { Button, Col, Form, Row } from "react-bootstrap";
import { filter_by_alphabetical_order } from "./filterlists";
import { filter_by_difficulty } from "./filterlists";
import { filter_by_time_needed } from "./filterlists";
import { useDrop } from "react-dnd";
import { addTask, delTask, makeTask } from "../TaskFunctions";
import { search } from "./search";

interface UserProps {
    user: User;
    setUser: (newUser: User) => void;
    users: User[];
    tasks: Task[]; //this attribute is not used right now but will be needed to update the numUsers when we add things to userList
    setTasks: (newTasks: Task[]) => void; ////this attribute is not used right now but will be needed to update the numUsers when we add things to userList
    setUsers: (users: User[]) => void;
}

export function UserList({
    user,
    setUser,
    users,
    tasks,
    setTasks,
    setUsers
}: UserProps): JSX.Element {
    const [TaskSearched, setTaskSearched] = useState<string>("");
    const [SearchMode, SetSearchMode] = useState<boolean>(false);
    const [SearchedTasks, setSearchedTasks] = useState<Task[]>([]);

    function copyUL() {
        return user.userList.map((TASK: Task) => ({
            ...TASK,
            steps: [...TASK.steps]
        }));
    }

    function UpdateTaskSearched(event: React.ChangeEvent<HTMLInputElement>) {
        setTaskSearched(event.target.value);
        setSearchedTasks(search(TaskSearched, user.userList));
    }
    function setSearchMode() {
        SetSearchMode(!SearchMode);
    }
    function sort(type_of_sort: string): void {
        if (type_of_sort == "alphabet") {
            setUser({
                name: user.name,
                userList: filter_by_alphabetical_order(copyUL())
            });
        } else if (type_of_sort == "time") {
            setUser({
                name: user.name,
                userList: filter_by_time_needed(copyUL())
            });
        } else if (type_of_sort == "difficulty") {
            setUser({
                name: user.name,
                userList: filter_by_difficulty(copyUL())
            });
        }
    }

    const [{ isOver }, drop] = useDrop({
        accept: "task",
        drop: (item: Task) => addorDelTaskUserList(item.id, true),
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    });

    function addorDelTaskUserList(id: number, addOrDel: boolean) {
        const droppedTask: Task | undefined = tasks.find(
            (task: Task) => task.id === id
        );
        console.log({ ...droppedTask });
        console.log("dropping task");
        if (droppedTask) {
            //updating the Role state and add the new task to the currently displayed user list
            if (addOrDel) {
                setUser({
                    name: user.name,
                    userList: addTask(droppedTask, copyUL())
                });
                setUsers(updateUserTasks(addTask(droppedTask, copyUL())));
            } else {
                setUser({
                    name: user.name,
                    userList: delTask(droppedTask, copyUL())
                });
                setUsers(updateUserTasks(delTask(droppedTask, copyUL())));
            }
            //updating the UserList in the Roles state to keep the correct user list after role changes
            //updating the number of Users of the dropped task in the central item list if the user doesnt have
            // the task already
            const repeats = user.userList.reduce(
                (currentTotal: number, task: Task) =>
                    task.id === droppedTask.id
                        ? currentTotal + 1
                        : currentTotal + 0,
                0
            );
            if (repeats === 0 && addOrDel)
                changeTasks(tasks, droppedTask.id, addOrDel);
            if (repeats === 1 && !addOrDel)
                changeTasks(tasks, droppedTask.id, addOrDel);
        }
    }

    function editUserList(newTasks: Task[]) {
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

    function updateUserTasks(newTasks: Task[]) {
        const newUser = { name: user.name, userList: newTasks };
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
        return newRoles;
    }

    //this function increments the numberOfUsers of the task with the passed in ID
    function changeTasks(tasks: Task[], id: number, incrOrDec: boolean) {
        const copy = tasks.map((T: Task) => ({ ...T, steps: [...T.steps] }));
        const currentNumUsers = tasks.find((T: Task) =>
            T.id === id ? T : null
        );
        let newNumUsers = -1;
        if (currentNumUsers && incrOrDec) {
            newNumUsers = currentNumUsers.numUsers + 1;
        }
        if (currentNumUsers && !incrOrDec) {
            newNumUsers = currentNumUsers.numUsers - 1;
        }
        setTasks(
            copy.map((TASK: Task) =>
                TASK.id === id
                    ? makeTask(
                          id,
                          TASK.name,
                          TASK.description,
                          TASK.status,
                          TASK.image,
                          TASK.steps,
                          TASK.difficulty,
                          newNumUsers,
                          TASK.time,
                          TASK.pendingMode
                      )
                    : { ...TASK, steps: [...TASK.steps] }
            )
        );
    }

    function TrashCan(): JSX.Element {
        const [{ isOver, canDrop }, drop] = useDrop({
            accept: "task",
            drop: (item: Task) => addorDelTaskUserList(item.id, false),
            canDrop: (item: Task) => canDel(item),
            collect: (monitor) => ({
                isOver: !!monitor.isOver(),
                canDrop: !!monitor.canDrop()
            })
        });
        if (isOver && canDrop) {
            return (
                <div ref={drop} className="trashOpen" data-testid="trashCan">
                    <img src={require("../trashCanOpen.jpg")} width="100px" />
                </div>
            );
        } else {
            return (
                <div ref={drop} className="trashClosed" data-testid="trashCan">
                    <img src={require("../trashCanClosed.jpg")} width="100px" />
                </div>
            );
        }
    }

    function canDel(dropTask: Task): boolean {
        const droppedTask: Task | undefined = user.userList.find(
            (task: Task) => task.id === dropTask.id
        );
        return droppedTask ? true : false;
    }

    if (user.name !== "Super" && user.name !== "Admin") {
        return (
            <div className="UserList">
                <Row>
                    <Col>
                        <TrashCan></TrashCan>
                    </Col>
                    <Col>
                        {/*eslint-disable-next-line react/no-unescaped-entities*/}
                        <h2>{user.name}'s Schedule</h2>
                    </Col>
                    <Col>
                        <div className="Usersort-dropdown">
                            <button className="Usersort-dropbtn">
                                {/*eslint-disable-next-line prettier/prettier*/}
                                Sort by ▾
                            </button>
                            <div className="Usersort-options">
                                <Button onClick={() => sort("alphabet")}>
                                    Alphabetical{" "}
                                </Button>
                                <Button onClick={() => sort("difficulty")}>
                                    Difficulty{" "}
                                </Button>
                                <Button onClick={() => sort("time")}>
                                    Time Needed{" "}
                                </Button>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Button onClick={setSearchMode}>Search:</Button>
                    {SearchMode ? (
                        <Form.Group controlId="CheckAnswer">
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={TaskSearched}
                                onChange={UpdateTaskSearched}
                                placeholder="Which task are you looking for?"
                            />
                        </Form.Group>
                    ) : null}
                    {SearchMode
                        ? SearchedTasks.map((TASK: Task, index: number) => (
                              <DisplayTask
                                  key={index}
                                  task={TASK}
                                  tasks={user.userList}
                                  updateTasks={editUserList}
                                  role={user.name}
                              ></DisplayTask>
                          ))
                        : null}
                </Row>

                <div
                    className="userTaskList"
                    ref={drop}
                    style={{
                        backgroundColor: isOver ? "SageGreen" : "white"
                    }}
                >
                    {user.userList.map((TASK: Task, index: number) => (
                        <DisplayTask
                            key={index}
                            task={TASK}
                            tasks={user.userList}
                            updateTasks={editUserList}
                            role={user.name}
                        ></DisplayTask>
                    ))}
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}
