## API Endpoints

### GET /api

Retrieves a list of tasks with filtering, sorting, and pagination options.

#### Query Parameters:

- **search** (string, optional): A phrase to search within task fields.
- **sortField** (string, optional): The field to sort by. Allowed values: `title`, `description`, `createdAt`, `isCompleted`, `priority`. Defaults to `createdAt`.
- **sortOrder** (string, optional): The sorting direction. Values: `asc` or `desc`. Defaults to `asc`.
- **page** (number, optional): The page number. Defaults to `1`.
- **limit** (number, optional): The number of items per page. Defaults to `10`.

#### Example Request:

```
GET /api?search=example&sortField=title&sortOrder=asc&page=1&limit=10
```

#### Response:

- **200 OK** – Returns an array of tasks filtered according to the parameters.
- **500 Internal Server Error** – An error occurred while retrieving tasks.

---

### POST /api

Creates a new task.

#### Body (JSON):

Expects an object representing the task. The structure should match the TaskDTO model. Example fields:

- `title` (string, required)
- `description` (string, required)
- `createdAt` (ISO date format or timestamp)
- `isCompleted` (boolean)
- `priority` (number)

#### Example Request:

```json
POST /api
Content-Type: application/json

{
    "title": "New Task",
    "description": "Task description",
    "createdAt": "2025-04-10T12:00:00.000Z",
    "isCompleted": false,
    "priority": 2
}
```

#### Response:

- **201 Created** – Returns the created task.
- **400 Bad Request** – An error occurred while creating the task.

---

### PUT /api

Updates an existing task.

#### Query Parameters:

- **id** (string, required): The identifier of the task to be updated.

#### Body (JSON):

Expects an object representing the task to update (structure should match TaskDTO).

#### Example Request:

```json
PUT /api?id=12345
Content-Type: application/json

{
    "title": "Updated Title",
    "description": "Updated Description",
    "createdAt": "2025-04-10T12:00:00.000Z",
    "isCompleted": true,
    "priority": 1
}
```

#### Response:

- **200 OK** – Returns the updated task.
- **404 Not Found** – Task with the specified `id` was not found.
- **400 Bad Request** – An error occurred while updating the task.

---

### DELETE /api

Deletes an existing task.

#### Query Parameters:

- **id** (string, required): The identifier of the task to delete.

#### Example Request:

```
DELETE /api?id=12345
```

#### Response:

- **204 No Content** – The task was successfully deleted.
- **404 Not Found** – Task with the specified `id` was not found.
- **500 Internal Server Error** – An error occurred while deleting the task.
