// Wrapper IPC — acceso tipado a los métodos del main process.
// window.electronAPI se inyecta por preload.js via contextBridge.

const api = typeof window !== 'undefined' ? (window.electronAPI ?? {}) : {}

export const ping = () => api.ping?.()

export default api
