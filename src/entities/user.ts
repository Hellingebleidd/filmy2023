import { Group } from './group';

export class User {
  static clone(user: User): User {
    return new User(
      user.name,
      user.email,
      user.id,
      user.lastLogin,
      user.password,
      user.active,
      user.groups?.map(g=>Group.clone(g))
    );
  }

  constructor(
    public name: string,
    public email: string,
    public id?: number,
    public lastLogin?: Date,
    public password: string = '',
    public active: boolean | undefined = true,
    public groups: Group[] | undefined= []
  ) {}

  toString(): string {
    return `name: ${this.name}, email:${this.email}, id: ${this.id}, last login: ${this.lastLogin}`;
  }
}
