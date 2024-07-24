/**
 * The `downloadFile` function is an asynchronous function that downloads a file from a given URL and
 * returns it as a Blob.
 * @param {string} url - The `url` parameter is a string that represents the URL of the file you want
 * to download.
 * @returns The function `downloadFile` returns a Promise that resolves to a Blob object.
 */
export const downloadFile = async (url: string): Promise<Blob> => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return blob;
    } catch (error) {
        console.error('Error downloading file:', error);
        throw new Error('Failed to download the file.');
    }
};