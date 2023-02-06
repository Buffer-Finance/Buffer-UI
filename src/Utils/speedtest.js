import NetworkSpeed from 'network-speed'; // ES6
const testNetworkSpeed = new NetworkSpeed();


async function getNetworkDownloadSpeed() {
    const baseUrl = 'https://eu.httpbin.org/stream-bytes/500000';
    const fileSizeInBytes = 500000;
    try {
        return await testNetworkSpeed?.checkDownloadSpeed(baseUrl, fileSizeInBytes);
    } catch (e) {
        return '';
    }
}


export async function getConnectionSpeed() {
    try {
        const speed = await getNetworkDownloadSpeed();
        console.log(`speed: `, speed);
        return speed?.kbps;
    }
    catch (err) {
        return ''
    }
}