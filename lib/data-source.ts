export const DATA_SOURCE =
  process.env.DATA_SOURCE ??
  (process.env.NODE_ENV === 'production' ? 'db' : 'local')

export const isDbEnabled = () => DATA_SOURCE === 'db'
