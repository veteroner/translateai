// Bu dosya, tarayıcıda desteklenmeyen Node.js modülleri için boş bir yer tutucudur
// Bu, webpack derleme hatalarını önlemek için kullanılır

// Boş fonksiyonlar ve nesneler içerir
module.exports = {
  readFile: () => Promise.resolve(''),
  readFileSync: () => '',
  writeFile: () => Promise.resolve(),
  writeFileSync: () => {},
  promises: {
    readFile: () => Promise.resolve(''),
    writeFile: () => Promise.resolve()
  },
  createReadStream: () => ({
    on: () => {},
    pipe: () => {}
  }),
  createWriteStream: () => ({
    on: () => {},
    write: () => {},
    end: () => {}
  }),
  // HTTP/HTTPS için boş fonksiyonlar
  request: () => ({
    on: () => {},
    write: () => {},
    end: () => {}
  }),
  get: () => {},
  // Diğer ortak Node.js fonksiyonları
  statSync: () => ({
    isFile: () => true,
    isDirectory: () => false,
    size: 0
  }),
  stat: () => Promise.resolve({
    isFile: () => true,
    isDirectory: () => false,
    size: 0
  }),
  constants: {},
  // Diğer HTTPS/HTTP özellikleri
  Agent: class {},
  createServer: () => ({
    listen: () => {}
  })
}; 