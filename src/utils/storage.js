import { EncryptStorage } from "encrypt-storage";

// ในใช้งานจริง ควรเก็บ 'SECRET_KEY' ไว้ในไฟล์ .env
const secretKey = import.meta.env.VITE_ENCRYPT_KEY;

export const encryptStorage = new EncryptStorage(secretKey, {
  prefix: "@admin", // ช่วยแยกชื่อ key ให้เป็นระเบียบ เช่น @admin:accessToken
  storageType: "localStorage", // สามารถเลือกเป็น sessionStorage ได้ด้วย
});
