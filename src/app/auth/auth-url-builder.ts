export class AuthUrlBuilder {
  static root() {
    return '/auth';
  }
  static login() {
    return '/auth/login';
  }
  static forgotPassword() {
    return '/auth/esqueceuSenha';
  }
  static redefinitionPassword() {
    return '/auth/redefinicaoSenha/:uid/:token';
  }
}
