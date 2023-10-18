import bcrypt from 'bcrypt';

// Interfaz para las funciones de cifrado
interface EncryptFunctions {
  encryptPassword: (password: string) => Promise<string>;
  matchPassword: (password: string, encryptedPassword: string) => Promise<boolean>;
}

const encrypt: EncryptFunctions = {
  async encryptPassword(password) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (err) {
      console.error(err);
      throw err; // Puedes relanzar el error para que se maneje en otro lugar si es necesario
    }
  },

  async matchPassword(password, encryptedPassword) {
    try {
      return await bcrypt.compare(password, encryptedPassword);
    } catch (err) {
      console.error(err);
      throw err; // Puedes relanzar el error para que se maneje en otro lugar si es necesario
    }
  },
};

export default encrypt;
