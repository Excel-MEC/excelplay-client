export function ApiRoot() {
  return window.location.origin;
}
export function ApiRootHostname() {
  return window.location.host;
}

export function ApiRootHostname_nodir() {
  return window.location.host+'/';
}
