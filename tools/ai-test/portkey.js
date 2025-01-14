import { Portkey } from 'portkey-ai';

const portkey = new Portkey({
    baseURL: "http://192.168.31.7:8787/v1",
    provider: "openai",
    customHost: "http://192.168.31.8:1234/v1",
});

async function main() {
    try {
        const response = await portkey.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'mixtral-8x22b',
        });
        console.log(JSON.stringify(response, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Error details:', error.response.data);
        }
    }
}

main();
