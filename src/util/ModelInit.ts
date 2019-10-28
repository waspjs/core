export type ModelInit<Model extends { _id: string }> = Pick<Model, Exclude<keyof Model, "_id">>;
