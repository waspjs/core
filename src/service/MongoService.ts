import { getModelForClass, ReturnModelType } from "@typegoose/typegoose";
import * as mongoose from "mongoose";
import Container, { Service } from "typedi";
import { User } from "../model/User";
import { ConfigService } from "./ConfigService";

interface CollectionMetadata {
  key: string;
  name: string;
  model: new(...args: any[]) => any;
}

@Service()
export class MongoService {
  @MongoService.collection(User, "users")
  public users!: ReturnModelType<typeof User>;

  protected connection!: mongoose.Connection;

  private config = Container.get(ConfigService);

  public async init() {
    this.connection = await mongoose.createConnection(this.config.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(c => c); // workaround so that linter recognizes this as a promise :(
    const collections: CollectionMetadata[] = Reflect.getMetadata("collections", this);
    for (const { model, key, name } of collections) {
      (this as any)[key] = getModelForClass(model, {
        existingConnection: this.connection,
        schemaOptions: { collection: name }
      });
    }
  }

  public async close() {
    return this.connection.close();
  }

  public static collection<Model extends new(...args: any[]) => any>(model: Model, name: string) {
    return (target: MongoService, key: string) => {
      const collections: CollectionMetadata[] = Reflect.getMetadata("collections", target) || [];
      Reflect.defineMetadata("collections", collections.concat([{ key, name, model }]), target);
    };
  }
}
