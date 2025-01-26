# MonoMongo Library

MonoMongo is a library for managing connections to MongoDB databases using Mongoose, simplifying the handling of local and production environments.

## Installation

Install the library using npm or yarn:

```bash
npm install mongoose
```

Or if you prefer yarn:

```bash
yarn add mongoose
```

## Usage

### Import

```typescript
import { MonoMongo } from "./path-to-mono-mongo";
```

### Connecting to the Database

#### Production

```typescript
const database = {
  username: "user",
  password: "pass",
  cluster: "cluster0",
  dbname: "mydatabase",
};

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

await MonoMongo.exect({ database, connectOptions })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Connection failed:", err));
```

#### Local

```typescript
const database = {
  hostname: "localhost",
  port: 27017,
  dbname: "mydatabase",
};

await MonoMongo.exect({ database })
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.error("Connection failed:", err));
```

## Main Methods

### `MonoMongo.exect()`

Executes a connection to the database.

**Parameters:**

- `database`: Database environment, which can be a production or local object.
- `connectOptions` (optional): Connection options compatible with Mongoose.

**Example:**

```typescript
await MonoMongo.exect({ database, connectOptions });
```

### `MonoMongo.getDBPath()`

Gets the database connection URL based on the provided environment.

**Parameters:**

- `database`: Database environment.

**Example:**

```typescript
const dbPath = MonoMongo.getDBPath(database);
console.log(dbPath);
```

### `MonoMongo.connect()`

Connects to the database using Mongoose.

**Parameters:**

- `dbpath`: Database connection path.
- `option`: Mongoose connection options.

**Example:**

```typescript
await MonoMongo.connect(dbPath, connectOptions);
```

## Connection Event Handling

The `MonoConnect` class allows configuring connection events such as:

- Successful connection
- Connection error
- Disconnection
- Process termination

**Example:**

```typescript
const connection = mongoose.createConnection(dbPath, connectOptions);
const monoConnect = new MonoConnect(dbPath, connection);
await monoConnect.connect(connectOptions);
```

## Contributions

Contributions are welcome! Please open an issue or submit a pull request with your improvements.

## License

This project is licensed under the MIT License.
