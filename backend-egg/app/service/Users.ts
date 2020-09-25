import { Service } from 'egg';

/**
 * Test Service
 */
export default class Users extends Service {
  public async index() {
    const { ctx } = this;
    return ctx.repo.User.find();
  }
}
