const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const chalk = require('chalk');
const { URL } = require('url');

// Banner dengan warna
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
@@@@@@@%#@@@@@@@@@@@%#%%%%@@@@@@@%%%@@@@@@@@@@@@%%%##%@#%#%#%###%@@@@@%######%@%#%@%%%%%#@@@@@%@@@%@@%@
@@@@@@@@*%%@@@@@@@@@@%%#%#%%#%#%%%%%@@@@@@@@@@@@@@%%%##%**+*#*+#*%@@@@%*+**=**%#**@#+*##*+=****+=+**#*@
@@@@@@@@@%%%%@@@@@@@@@@@@%%%%@@@@@@@@@%%%%@@@@@@@@@%%%%@##*####*#*##*###%%#*%@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@%###%@@@@@@@@@@@@%@*%#%%%%#%%%%%##@@@@@@@@@%%%#%##*#*#*+*+***#%*%@#*%@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@%%%%%%%%%%##%%@@@@@@@@@@@@@@@#%@@@@@@@@@%@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@%%#%%%@@@@@@@@@@@@@@%@%%%%@@@%@@@@@@@@@#@@%%%##%%#%%%#%%%%%#%%%#####%#%%#@@%@@@@@@@@
@@@@@@@@@@@@@@@@@@@%##%@@@@@@@@@@@@@%@#@@@@@@@@@@@@@@@@@@@#@@%%%##%%#%%%#%%%%%#%%%#####%#%%#@@%@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@%%#%#%%#%##@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@%#%#@%#@@#%@@@%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@%%%%%%@@@@#%@%%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@%@@@@@@%%%%%@@@@%%##%@@@@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%@@@@@@%@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
`));

// Fungsi untuk memuat user agents dari file
function loadUserAgents() {
    const userAgents = fs.readFileSync('ua.txt', 'utf-8').trim().split('\n');
    return userAgents;
}

// Fungsi untuk memuat kredensial dari file
function loadCredentials() {
    const credentials = fs.readFileSync('user.txt', 'utf-8').trim().split('\n');
    return {
        username: credentials[0],
        password: credentials[1]
    };
}

// Fungsi untuk mendapatkan informasi target
async function getTargetInfo(target) {
    try {
        const response = await axios.get(`https://ipinfo.io/${target}/json?token=9f24079c888c4a378665605084beda0c`);
        return response.data;
    } catch (error) {
        console.error(chalk.red('Failed to retrieve target information.'), error);
        return null;
    }
}

// Fungsi untuk bypass captcha dengan Puppeteer
async function bypassCaptcha(url) {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        
        // Mengatur user agent dan header
        const userAgents = loadUserAgents();
        const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
        await page.setUserAgent(randomUserAgent);

        await page.goto(url, { waitUntil: 'networkidle2' });

        // Tunggu sampai elemen captcha muncul dan coba untuk menyelesaikannya secara manual
        console.log(chalk.yellow('Manual captcha solving required.'));

        // Tunggu input manual, jika captcha terpecahkan, ambil cookies atau token yang diperlukan
        await page.waitForTimeout(60000); // Tunggu 60 detik untuk captcha diselesaikan

        const cookies = await page.cookies();
        await browser.close();
        return cookies;
    } catch (error) {
        console.error(chalk.red('Failed to bypass captcha.'), error);
        return null;
    }
}

// Fungsi utama untuk memeriksa akses dan menampilkan informasi target
async function main() {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log(chalk.red('Usage: node script.js <target-url>'));
        return;
    }

    const targetUrl = args[0];
    const { username, password } = loadCredentials();

    console.log(chalk.green(`Username: ${username}`));
    console.log(chalk.green(`Password: ${password}`));

    // Menampilkan informasi target
    const targetInfo = await getTargetInfo(new URL(targetUrl).hostname);
    if (targetInfo) {
        console.log(chalk.green('Target Information:'));
        console.log(chalk.green(`IP: ${targetInfo.ip}`));
        console.log(chalk.green(`Hostname: ${targetInfo.hostname}`));
        console.log(chalk.green(`City: ${targetInfo.city}`));
        console.log(chalk.green(`Region: ${targetInfo.region}`));
        console.log(chalk.green(`Country: ${targetInfo.country}`));
        console.log(chalk.green(`Org: ${targetInfo.org}`));
        console.log(chalk.green(`AS: ${targetInfo.as}`));
    }

    // Mengakses target dan menangani captcha
    const cookies = await bypassCaptcha(targetUrl);
    if (cookies) {
        console.log(chalk.green('Successfully bypassed captcha and accessed the target.'));
    } else {
        console.log(chalk.red('Failed to bypass captcha.'));
    }
}

main();
