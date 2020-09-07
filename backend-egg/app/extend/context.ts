// 自定义 ctx 方法
module.exports = {
  // 添加统一的返回结果方法
  sendResult(data: object = null, code: number = 200, message: string) {
		var fmt = this.query.fmt ? this.query.fmt : "rest";
		if(fmt == "rest") {
			this.body = {
				"data" : data,
				"meta" : {
					"msg" 		: message,
					"status" 	: code
				}
			}
	  };
  }

  
}