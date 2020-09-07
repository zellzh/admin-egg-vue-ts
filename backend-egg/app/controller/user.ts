import { Controller } from 'egg';

export default class UserController extends Controller {
  public async register() {
    const { ctx } = this;
    
    console.log(ctx.request.body);
    
    ctx.body = '验证成功'
  }
}
