import { Service } from 'egg';

export default class Users extends Service {
  public async index() {
    const { ctx } = this;
    return ctx.repo.User.find();
  }
}
