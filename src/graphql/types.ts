export type Maybe<T> = T | undefined;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
  Date: any,
  /** The `Upload` scalar type represents a file upload. */
  Upload: File,
};


export type AuthToken = {
   __typename?: 'AuthToken',
  token: Scalars['String'],
  type?: Maybe<AuthTokenType>,
  user: User,
};

export enum AuthTokenType {
  System = 'system',
  User = 'user'
}

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE'
}


export type Mutation = {
   __typename?: 'Mutation',
  createSystemToken: AuthToken,
  createUserToken: AuthToken,
  addPermissionsToRole: Scalars['Boolean'],
  createRole: Role,
  addRoleToUser: Scalars['Boolean'],
  createUser: User,
};


export type MutationCreateUserTokenArgs = {
  id?: Maybe<Scalars['String']>,
  email?: Maybe<Scalars['String']>,
  password?: Maybe<Scalars['String']>
};


export type MutationAddPermissionsToRoleArgs = {
  roleId: Scalars['String'],
  permissions: Array<Scalars['String']>
};


export type MutationCreateRoleArgs = {
  name: Scalars['String']
};


export type MutationAddRoleToUserArgs = {
  userId?: Maybe<Scalars['String']>,
  roleId: Scalars['String']
};


export type MutationCreateUserArgs = {
  email: Scalars['String'],
  password: Scalars['String']
};

export type Query = {
   __typename?: 'Query',
  roles: Array<Role>,
  user?: Maybe<User>,
  users: Array<User>,
};


export type QueryUserArgs = {
  id?: Maybe<Scalars['String']>
};


export type QueryUsersArgs = {
  limit: Scalars['Int'],
  offset: Scalars['Int']
};

export type Role = {
   __typename?: 'Role',
  _id: Scalars['String'],
  name: Scalars['String'],
  permissions: Array<Scalars['String']>,
};


export type User = {
   __typename?: 'User',
  _id: Scalars['String'],
  createdAt: Scalars['Date'],
  email: Scalars['String'],
  permissions: Array<Scalars['String']>,
  roles: Array<Role>,
};

