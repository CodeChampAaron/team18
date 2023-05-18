import { Button, Form } from "react-bootstrap";
import { SearchUserByTask, search } from "./search";
import { Task } from "../interfaces/task";
import { User } from "../interfaces/user";
import React, { useState } from "react";
interface UserProps {
    user: User;
    users: User[];
}
export function SearchInSuper(UserProperties: UserProps): JSX.Element {
    const [SearchMode, SetSearchMode] = useState<boolean>(false);
    const [tasktosearch, SetTaskToSearch] = useState<string>("");
    const [placeholder] = useState<string>("Enter User"); //holds the current placeholder text to ask for input
    const [UsersWithTask, SetUsersWithTask] = useState<User[]>([]);
    function setSearchMode() {
        SetSearchMode(!SearchMode);
    }
    function updatetasktoSearch(event: React.ChangeEvent<HTMLInputElement>) {
        SetTaskToSearch(event.target.value);
        SetUsersWithTask(SearchUserByTask(tasktosearch, UserProperties.users));
    }
    return (
        <div>
            <Button
                onClick={setSearchMode}
                style={{
                    backgroundColor: "rgb(247, 197, 140)"
                }}
                className="search-button"
            >
                Search For Users With Task Name:
            </Button>
            {SearchMode ? (
                <Form.Group controlId="ChecKForUser">
                    <Form.Label style={{ fontWeight: "bold" }}>
                        Which user would you like to edit?
                    </Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={tasktosearch}
                        onChange={updatetasktoSearch}
                        placeholder={placeholder}
                    />
                </Form.Group>
            ) : null}
        </div>
    );
}
