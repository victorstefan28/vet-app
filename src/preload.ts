// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
// preload.js or preload.ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  invoke: (channel: any, ...args: any) => ipcRenderer.invoke(channel, ...args),
  setLoginState: (isLoggedIn: boolean) =>
    ipcRenderer.send("set-login-state", isLoggedIn),
});

contextBridge.exposeInMainWorld("userState", {
  isLoggedIn: false,
});
