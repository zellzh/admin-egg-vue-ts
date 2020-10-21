import { Service } from 'egg';

export default class User extends Service {
  public async index() {
    const { ctx } = this;
    return ctx.repo.Manager.find();
  }
}
