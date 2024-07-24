/**
 * The `toBase64` function converts a `Blob` file to a base64 encoded string.
 * @param {Blob} file - The `file` parameter is of type `Blob`, which represents a file-like object of
 * immutable, raw data. It can be an image, audio, video, or any other type of file.
 */
export const toBase64 = (file: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
});