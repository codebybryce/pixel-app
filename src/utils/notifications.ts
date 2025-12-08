// Lightweight notification shims — replace toast implementation.
// These are intentionally minimal (console output) so the app no longer
// depends on `react-toastify`. Replace or extend with a UI-based system later.
export function notifySuccess(message: string | unknown) {
  // keep console output for developer visibility
  // eslint-disable-next-line no-console
  console.info('[success]', message);
}

export function notifyError(message: string | unknown) {
  // eslint-disable-next-line no-console
  console.error('[error]', message);
}

export function notifyInfo(message: string | unknown) {
  // eslint-disable-next-line no-console
  console.info('[info]', message);
}

export default {
  notifySuccess,
  notifyError,
  notifyInfo,
};
