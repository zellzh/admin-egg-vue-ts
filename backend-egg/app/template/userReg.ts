export default {
  // 用户名正则
  username: /^[A-Za-z0-9_]{6,}$/,
  // 邮箱正则
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.(com|cn|com.cn|edu|org)$/,
  // 手机正则
  phone: /^1[3-9]\d{9}$/,
  // 密码正则, 必须包含字母和数字
  password: /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&()]{6,}$/,
};
