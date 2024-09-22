// шаблон для валидации email
export const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// час життя - милисекунды * секунды * хвилини
export const accessTokenLifetime = 1000 * 60 * 15;
export const refreshTokenLifetime = 1000 * 60 * 60 * 24;
