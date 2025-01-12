
/**
 * Authentication konumlarında kullanılacak olan ön ek (prefix)
 * Bu ön ek ile başlayan konumlar auth için kullanılacak
 * @type {string}
 */
export const AuthApiPrefix = "/api/auth";

/**
 * Giriş yapan kullanıcının yönlendirileceği adres:
 * @type {string}
 */
export const DEFAULT_AFTERLOGIN_REDIRECT = "/settings";

/**
 * Kullanıcıların giriş yaparken kullanacağı adres
 * @type {string}
 */
export const DEFAULT_LOGIN_ADRESS = "/auth/login";

/**
 * Kullanıcıların kayıt olurken kullanacağı adres
 * @type {string}
 */
export const DEFAULT_REGISTER_ADRESS = "/auth/register";

/**
 * Kullanıcıların hata ile karşılaştığında göreceği adres
 * @type {string}
 */
export const DEFAULT_ERROR_ADRESS = "/auth/error";

/**
 * Kullanıcıların çıkış yaptığında gideceği
 * @type {string}
 */
export const DEFAULT_LOGOUT_ADRESS = "/auth/logout";

/**
 * Public olarak ulaşılabilecek konumların liste kümesi
 * Bu konumlar auth istenmeden ulaşılabilir
 * @type {string[]}
 */
export const PublicRoutes = [
  "/"       // landing page (direkt olarak domain)
];

/**
 * Authentication için kullanılacak olan konumlar (routes)
 * Bu konumlar zaten giriş yapmış olan kullanıcıları "/settings" konumumuna yönlendiricektir.
 * @type {string[]}
 */
export const AuthRoutes = [
  DEFAULT_LOGIN_ADRESS,
  DEFAULT_REGISTER_ADRESS,
  DEFAULT_ERROR_ADRESS,
];