export class User {

    static clone(user: User): User {
        return new User(user.name, user.email, user.id, user.lastLogin, user.password);
    }

    constructor(
        public name: string,
        public email: string,
        public id?: number,
        public lastLogin?: Date,
        public password: string = ''
    ){}

    toString():string {
        return `name: ${this.name}, email:${this.email}, id: ${this.id}, last login: ${this.lastLogin}`;
    }
}