import axios from 'axios'
import { toBase64 } from './toBase64';

export const uploadFile = async (file: Object) => {
    // @ts-ignore
    let file_base64: string = await toBase64(file);
    const file_base64_array: string[] = file_base64.split('base64,');
    const send_json = JSON.stringify({
        // @ts-ignore
        name: file.name,
        base64: file_base64_array[1]
    });

    axios
        .post('https://g8uv4l3j8i.execute-api.eu-west-2.amazonaws.com/default/uploadImage', send_json)
        .then(function (res) {
            if (res) {
                console.log(res.data.base);

            }
        })
        .catch(function (err) {
            console.log(err);
        });
};