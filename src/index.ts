import mongoose, { Mongoose } from 'mongoose';

export interface MongoProduction {
  username: string,
  password: string,
  cluster: string,
  dbname: string,
}

export interface MongoLocal {
  hostname: string | "localhost",
  port: number | 27017,
  dbname: string
}

export type DataBaseEnv = MongoProduction | MongoLocal | string

export type Callback = (data?: any) => void | undefined

export type ConnectOptions = Omit<mongoose.ConnectOptions, "dbName" | "user" | "pass">

export interface SettingMono {
  database: DataBaseEnv,
  connectOptions?: ConnectOptions
}

const connectDefault: ConnectOptions = {
  autoCreate: true,
  autoIndex: false, // Don't build indexes
  connectTimeoutMS: 30000, // Give up initial connection after 10 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
}

/**
 * @class MonoMongo
 * @classdesc Class to handle connection to a MongoDB database.
 */
export class MonoMongo {
  constructor() { }

  /**
   * Executes a connection to the database.
   * @param {Object} params - Connection parameters.
   * @param {DataBaseEnv} params.database - Database environment.
   * @param {ConnectOptions} [params.connectOptions] - Mongoose connection options.
   * @returns {Promise<Mongoose>}
   * @example
   * // in production
   * const database = { username: 'user', password: 'pass', cluster: 'cluster0', dbname: 'mydatabase' };
   * // in local
   * const database = { hostname: "localhost", port: 27017, dbname: "db" };
   * const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };
   * await MonoMongo.exect({ database, connectOptions }).then(() => console.log('Connected to DB'));
   */
  static async exect({ database, connectOptions }: SettingMono): Promise<Mongoose> {
    return await MonoMongo.connect(
      MonoMongo.getDBPath(database),
      connectOptions || connectDefault
    );
  }

  /**
   * Gets the database path based on the provided environment.
   * @param {DataBaseEnv} database - Database environment.
   * @returns {string} Database path.
   * @example
   * const dbEnv = { username: 'user', password: 'pass', cluster: 'cluster0', dbname: 'mydatabase' };
   * const dbPath = MonoMongo.getDBPath(dbEnv);
   * console.log(dbPath); // mongodb+srv://user:pass@cluster0/mydatabase?retryWrites=true&w=majority
   */
  static getDBPath(database: DataBaseEnv): string {
    if (typeof database === "string") return database;

    if ('cluster' in database) {
      const { username, password, cluster, dbname } = database;
      const user = encodeURIComponent(username);
      const pass = encodeURIComponent(password);
      return `mongodb+srv://${user}:${pass}@${cluster}/${dbname}?retryWrites=true&w=majority`;
    }
    const { hostname, port, dbname } = database;
    return `mongodb://${hostname}:${port || 27017}/${dbname}`;
  }

  /**
   * Connects to the database using Mongoose.
   * @param {string} dbpath - Database path.
   * @param {ConnectOptions} option - Mongoose connection options.
   * @returns {Promise<Mongoose>}
   * @example
   * const dbPath = 'mongodb://localhost:27017/mydatabase';
   * const connectOptions = { useNewUrlParser: true, useUnifiedTopology: true };
   * await MonoMongo.connect(dbPath, connectOptions, () => console.log('Connected to DB'));
   */
  static connect(dbpath: string, option: ConnectOptions): Promise<Mongoose> {
    const connection = mongoose.createConnection(dbpath, option);
    return (new MonoConnect(dbpath, connection)).connect(option);
  }
}

/**
 * @class MonoConnect
 * @classdesc Class to handle Mongoose connection and connection events.
 */
export class MonoConnect {
  private url: string;

  /**
   * Constructor for the MonoConnect class.
   * @param {string} url - Database URL.
   * @param {mongoose.Connection} connection - Mongoose connection.
   */
  constructor(url: string, connection: mongoose.Connection) {
    this.url = url;
    this.setupConnectionEvents(connection);
  }

  /**
   * Sets up Mongoose connection events.
   * @private
   */
  private setupConnectionEvents(connection: mongoose.Connection): void {
    // CONNECTION EVENTS
    connection.on("connected", () => {
      console.info("Mongoose default connection open to " + this.url);
    });

    // If the connection throws an error
    connection.on("error", (err) => {
      console.error("Mongoose default connection error: " + err);
      throw err;
    });

    // When the connection is disconnected
    connection.on("disconnected", () => {
      console.info("Mongoose default connection disconnected");
    });

    // When the connection is open
    connection.on("open", () => {
      console.log("Mongoose default connection is open");
    });

    // If the Node process ends, close the Mongoose connection
    process.on("SIGINT", () => {
      connection.close(true);
      console.log("Mongoose default connection disconnected through app termination");
      process.exit(0);
    });
  }

  /**
   * Connects to the database using Mongoose.
   * @param {ConnectOptions} Options - Mongoose connection options.
   * @returns {Promise<Mongoose>}
   * @example
   * const url = 'mongodb://localhost:27017/mydatabase';
   * const connection = mongoose.createConnection(url, { useNewUrlParser: true, useUnifiedTopology: true });
   * const mongoConnect = new MonoConnect(url, connection);
   * await mongoConnect.connect({ useNewUrlParser: true, useUnifiedTopology: true });
   */
  async connect(Options: ConnectOptions): Promise<Mongoose> {
    return mongoose
      .connect(this.url, Options);
  }
}



