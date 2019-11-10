import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import Container, { Service } from "typedi";
import { Role } from "../../model/Role";
import { User } from "../../model/User";
import { ConfigService } from "../ConfigService";

interface CollectionMetadata {
  key: string;
  name: string;
  model: new(...args: any[]) => any;
}

@Service()
export class MongoService {
  @MongoService.collection(Role, "roles")
  roles!: ReturnModelType<typeof Role>;

  @MongoService.collection(User, "users")
  users!: ReturnModelType<typeof User>;

  protected connection!: mongoose.Connection;

  private config = Container.get(ConfigService);

  async init() {
    this.connection = await mongoose.createConnection(this.config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(c => c); // Workaround so that linter recognizes this as a promise :(
    const collections: CollectionMetadata[] = Reflect.getMetadata("collections", this);
    for (const { model, key, name } of collections) {
      (this as any)[key] = getModelForClass(model, {
        existingConnection: this.connection,
        schemaOptions: { collection: name }
      });
    }
  }

  async close() {
    return this.connection.close();
  }

  static collection<Model extends new(...args: any[]) => any>(model: Model, name: string) {
    return (target: MongoService, key: string) => {
      const collections: CollectionMetadata[] = Reflect.getMetadata("collections", target) || [];
      Reflect.defineMetadata("collections", collections.concat([{ key, name, model }]), target);
    };
  }
}
