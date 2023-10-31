import { decryptApiKey, encryptApiKey } from "../apiKeyFunctions";

describe("apiKeyFunctions", () => {
  const key = "12312312311231231231123123123123";
  const value = "this is a long value that will be encrypted and stored in the database";
  const encrypted =
    "9488a0b120de55177b39b5071a4580195e22bce76cf39f0b77a85c320becf55f6ddc3af8dd18b54393fafc00fa8ff71fc9556e44ebd453538e6de0e039b3ae4b5cca799b541b880e521de17f24f6d5ed";

  describe("encryptApiKey", () => {
    it("encrypts a key properly", () => {
      expect(encryptApiKey(value, key)).toEqual(encrypted);
    });

    it("throws an error if the key is not defined", () => {
      expect(() => encryptApiKey(value, undefined)).toThrow();
    });
  });

  describe("decryptApiKey", () => {
    it("decrypts a key properly", () => {
      expect(decryptApiKey(encrypted, key)).toEqual(value);
    });

    it("throws an error if the key is not defined", () => {
      expect(() => decryptApiKey(encrypted, undefined)).toThrow();
    });
  });
});
