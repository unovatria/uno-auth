
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
export const DEFAULT_LOGIN_REDIRECT = "/settings";

/**
 * Kullanırıcıların giriş yaparken kullanacağı adres
 * @type {string}
 */
export const DEFAULT_LOGIN_ADRESS = "/auth/login";

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
  "/auth/login",
  "/auth/register",
];