const fs = require('fs');
const path = require('path');
const cloudscraper = require('cloudscraper');
const request = require('request');
const chalk = require('chalk');
const readline = require('readline');

// Memuat konfigurasi
const userAgentFilePath = path.join(__dirname, 'ua.txt');
const proxyFilePath = path.join(__dirname, 'proxy.txt');

const userAgents = fs.readFileSync(userAgentFilePath, 'utf8').split('\n').filter(Boolean);
const proxies = fs.readFileSync(proxyFilePath, 'utf8').split('\n').filter(Boolean);

// Setup readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Fungsi untuk mendapatkan informasi IP tanpa API Key
function getIPInfo(target, callback) {
    const ipinfoUrl = `https://ipinfo.io/${target}/json`;

    request.get({
        url: ipinfoUrl,
        timeout: 10000 // Timeout untuk permintaan
    }, (error, response, body) => {
        if (error) {
            console.error("Error fetching IP info:", error);
            callback(error, null);
            return;
        }

        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (e) {
            console.error("Error parsing IP info response:", e);
            callback(e, null);
        }
    });
}

// Fungsi untuk melakukan bypass
function bypass(target, proxy, userAgent, callback) {
    cloudscraper.get({
        url: target,
        proxy: `http://${proxy}`,
        headers: {
            'User-Agent': userAgent,
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US;q=0.9'
        },
        timeout: 10000 // Timeout untuk permintaan
    }, (err, res, body) => {
        if (err || res.statusCode !== 200) {
            console.warn("Failed to bypass, retrying...");
            // Menambahkan retry jika gagal
            return setTimeout(() => bypass(target, proxy, userAgent, callback), 5000);
        }

        // Logging and calling the callback with the result
        console.log("Bypassed successfully:", res.statusCode);
        callback(null, body);
    });
}

// Fungsi utama
function main() {
    rl.question('Enter target URL: ', (targetUrl) => {
        rl.question('Enter port: ', (port) => {
            rl.question('Enter duration: ', (duration) => {
                rl.question('Enter proxy file path: ', (proxyFile) => {
                    if (!fs.existsSync(proxyFile)) {
                        console.error('Proxy file not found.');
                        rl.close();
                        process.exit(1);
                    }
                    rl.question('Enter captcha mode (normal/captcha): ', (captchaMode) => {
                        rl.question('Enter username: ', (username) => {
                            rl.question('Enter password: ', (password) => {
                                if (proxies.length < 1) {
                                    console.error("Proxy file is empty.");
                                    rl.close();
                                    process.exit(1);
                                }
                                const proxy = proxies[Math.floor(Math.random() * proxies.length)];
                                const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

                                console.log(chalk.green('Starting script...'));
                                showBanner();

                                bypass(targetUrl, proxy, userAgent, (err, result) => {
                                    if (err) {
                                        console.error('Error during bypass:', err);
                                        rl.close();
                                        return;
                                    }

                                    console.log('Bypass Result:', result);

                                    getIPInfo(targetUrl, (err, ipInfo) => {
                                        if (err) {
                                            console.error('Error fetching IP info:', err);
                                            rl.close();
                                            return;
                                        }

                                        console.log('IP Info:');
                                        console.log(`IP: ${ipInfo.ip}`);
                                        console.log(`Hostname: ${ipInfo.hostname}`);
                                        console.log(`City: ${ipInfo.city}`);
                                        console.log(`Region: ${ipInfo.region}`);
                                        console.log(`Country: ${ipInfo.country}`);
                                        console.log(`Location: ${ipInfo.loc}`); // Latitude and Longitude
                                        console.log(`Organization: ${ipInfo.org}`);
                                        console.log(`ASN: ${ipInfo.asn}`);
                                        rl.close();
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

// Menampilkan banner
function showBanner() {
    console.log(chalk.green(`
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@#%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@%#%%@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@%%@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@%#%%%%%@@@@@@@@@@@%%%%###%%#%#%%%%%%%%%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@%@%@@@@@%%%%%%%#%%%@@@@@@@@@@%%%#@%%%##%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@#####%%@@@@@@@@@@@@@@@@@#%@@@@#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@%###%@@@@@@@@@@@@@@@@@@@@@%@%%%#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@%%##%@@@@@@@@@@@@@@@@@@@@@@@@@%%%#@@@@@@%@@@@@@@@@@@@@@%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@%%#%%%###@@@@@@@@@@@@@@@@@@@@@@@@@@@%##@@%**#####**#@%#*@%*#%####@*#*#%%**#****###@@@@@@@@
@@@@@@@@@@@%#%@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%@@%%%%%%%%%%@@%%%%%#%%%%@@@@%@@@@@%%@@%@@@@@@@@@@@
@@@@@@@@#%%#%@@@@@%#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%%@@+%%***#*##+*#@##%##@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@%@#%%%%%@@@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@#%#@@*%@@@@@@@@#%@@@@@@@@@@@@@%@%@@@@@@@@@@@@@@@@#%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@%@%%@#@@@@@@@@@%%@@@@@@@@@@@@%%%%@@%@@@@@@@@@@@@@#%@@##****%@@@@@@@@##%%#@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@##@%@@@@@@@@@%%@@@@@@@@@@@@%%%%%@@%@@@@@@@@@%@@#%@@##*#*#%@@@@@@@%%#*##@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@%%%@@@@@@@@@@%%@@##%@%%#%%@@@@@%@@%@@@@@@@@@%@%%@@@**+*#@*%*++#%@#++#*+*#@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@%%@@@@@@@@@@@%%%%%%@@%%%%@@@@@@@@@@@@@@@@@%%%#%@@@%#%#%@%%###%%@%##%###%@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@##@@@@@@@@@@@#%@%@@@@@#%#@@@@@@@@@@@@@@@%@%%#%@@@@**++#%@@@@@@@@@***#+%@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@#%@@@@@@@@@@%#%%@@@@@@@@@@@@@@@@@@@@%%%###%%%%#%**===+++*%@@@@@@+***=%@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@%#@@@@@@@@@@@%#%%%%@@@@@@@%%%@@@@@@@@@@@@%%%##%@#%#%#%###%@@@@@%######%@%#%@%%%%%#@@@@@%@@@%@@%@
@@@@@@@@*%%@@@@@@@@@@%%#%#%%#%#%%%%%@@@@@@@@@@@@@@%%%##%**+*#*+#*%@@@@%*+**=**%#**@#+*##*+=+*+=+*#*@
@@@@@@@@@%%%%@@@@@@@@@@@@%%%%@@@@@@@@@%%%%@@@@@@@@@%%%%@##*####*#*##*###%%#*%@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@%#%@%@@@@@%@*%#%%%%#%%%%%##@@@@@@@@@%@%@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@%%%%%@@@%@@@@@@@@@@@%@%@%@%@%@%@@@@%@@#@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@#%#%@@@@@@@@@@@@@@@%@@@%@@@@@@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@%%%%%%@@@@@%@@@%@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`));
}

// Menjalankan fungsi utama
main();
