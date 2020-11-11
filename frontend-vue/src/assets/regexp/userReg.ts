export default {
  username: /^[A-Za-z0-9_]{6,}$/,
  password: /(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&()]{6,}$/,
  phone: /^1[3-9]\d{9}$/,
  // email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/
  email: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+\.(com|cn|com.cn|edu|org)$/
}
