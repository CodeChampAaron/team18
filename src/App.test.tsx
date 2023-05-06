import App from "./App";
import React from "react";
import { render, screen } from "@testing-library/react";
import { TASKS } from "./TASKS";
import { CentralItemList } from "./list-components/CentralItemList";
import { Task } from "./interfaces/task";
import { UserList } from "./list-components/UserList";
import { User } from "./interfaces/user";
import { AdminList } from "./list-components/adminlist";
import { DeleteTask } from "./list-components/deleteTask-component";
import { AddTask } from "./list-components/addTask";
import { EditTask } from "./editing-components/EditTask";

const testTask = {
    id: 1,
    name: "test1",
    description: "description a",
    status: false,
    image: "picture",
    steps: ["a", "b", "c", "GutenTag", "469476"],
    difficulty: 3,
    numUsers: 2,
    time: "1345"
};

const role1 = "Super";
const role2 = "Admin";
const role3 = "User1";

const User1: User = { name: "user1", userList: TASKS };
const User2: User = { name: "Super", userList: TASKS };
const User3: User = { name: "Admin", userList: TASKS };
const users = [User1, User2, User3];

function setTasks(newTasks: Task[]) {
    newTasks;
}
function setUser(newUser: User) {
    newUser;
}
function setUsers(newUsers: User[]) {
    newUsers;
}

//test that components are displayed
//super: central list, add/delete task, add/delete user, edit task
//admin: admin list, central item list, edit task
//user: central item list, user list, edit task

describe("Tesing Central Item List in App", () => {
    beforeEach(() => {
        render(
            <CentralItemList
                tasks={TASKS}
                role={role3}
                setTasks={setTasks}
            ></CentralItemList>
        );
    });
});

describe("Tesing User List in App", () => {
    beforeEach(() => {
        render(
            <UserList
                users={users}
                setUsers={setUsers}
                tasks={TASKS}
                setTasks={setTasks}
                user={User3}
                setUser={setUser}
            ></UserList>
        );
    });
});

describe("Tesing Admin List in App", () => {
    beforeEach(() => {
        render(
            <AdminList
                users={users}
                setUsers={setUsers}
                tasks={TASKS}
                user={User2}
                setTasks={setTasks}
            ></AdminList>
        );
    });
});
describe("Testing Delete task in App", () => {
    beforeEach(() =>
        render(
            <DeleteTask
                tasks={TASKS}
                setTasks={function (): void {
                    throw new Error("function not implemented");
                }}
            />
        )
    );
});

describe("Add tasks tests", () => {
    beforeEach(() =>
        render(
            <AddTask
                tasks={TASKS}
                setTasks={
                    function (/*newTasks: Tasks[]*/): void {
                        throw new Error("Function not implemented.");
                    }
                }
            />
        )
    );
});

describe("Testing EditTask", () => {
    beforeEach(() => {
        render(
            <EditTask tasks={TASKS} updateTasks={setTasks} task={testTask} />
        );
    });
});
