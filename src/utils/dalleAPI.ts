import OpenAI from "openai";

const dalleApiKey: string | undefined = process.env.NEXT_PUBLIC_DALLE_API_KEY;

const dalleAPI = new OpenAI({ apiKey: dalleApiKey, dangerouslyAllowBrowser: true });

export const generateImage = async (prompt:string) => {
    const response = await dalleAPI.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
    });
    const image_url = response.data[0].url;
    return image_url;
}