# MonoMongo Library

MonoMongo es una biblioteca para gestionar conexiones con bases de datos MongoDB utilizando Mongoose, facilitando el manejo de entornos locales y de producción.

---

## Instalación

Instala la biblioteca utilizando npm o yarn:

```bash
npm install mongoose
```

O si prefieres usar yarn:

```bash
yarn add mongoose
```

---

## Uso

### Importación

```typescript
import { MonoMongo } from "./path-to-mono-mongo";
```

### Conexión a la base de datos

#### Producción

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

---

## Métodos principales

### `MonoMongo.exect()`

Ejecuta una conexión con la base de datos.

**Parámetros:**

- `database`: Entorno de base de datos, que puede ser un objeto de producción o local.
- `connectOptions` (opcional): Opciones de conexión compatibles con Mongoose.

**Ejemplo:**

```typescript
await MonoMongo.exect({ database, connectOptions });
```

---

### `MonoMongo.getDBPath()`

Obtiene la URL de conexión a la base de datos en función del entorno proporcionado.

**Parámetros:**

- `database`: Entorno de base de datos.

**Ejemplo:**

```typescript
const dbPath = MonoMongo.getDBPath(database);
console.log(dbPath);
```

---

### `MonoMongo.connect()`

Conecta a la base de datos utilizando Mongoose.

**Parámetros:**

- `dbpath`: Ruta de conexión a la base de datos.
- `option`: Opciones de conexión de Mongoose.

**Ejemplo:**

```typescript
await MonoMongo.connect(dbPath, connectOptions);
```

---

## Manejo de eventos de conexión

La clase `MonoConnect` permite configurar eventos de conexión como:

- Conexión exitosa
- Error de conexión
- Desconexión
- Terminación del proceso

**Ejemplo:**

```typescript
const connection = mongoose.createConnection(dbPath, connectOptions);
const monoConnect = new MonoConnect(dbPath, connection);
await monoConnect.connect(connectOptions);
```

---

## Contribuciones

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request con tus mejoras.

---

## Licencia

Este proyecto está bajo la licencia MIT.
