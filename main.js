const translate = require('@vitalets/google-translate-api');
const fs = require('fs');

const fromLanguage = "en";
const toLanguage = "fr";

const filePath = process.argv[2];
console.log("----------------------------------")
console.log("[File path]: ", filePath);


const getTranslate = (text) =>
    new Promise((resolve, reject) => {
        translate(text, {from: fromLanguage, to: toLanguage}).then(res => {
            resolve(res.text);
            console.log(`  [TRANS] "${text}" --> "${res.text}"`)
        }).catch(reject)
    })


const handleTranslateJson = async (jsonData) => {
    if (!jsonData) return;

    for (let key in jsonData) {
        if (typeof jsonData[key] === "string")
            jsonData[key] = await getTranslate(jsonData[key]);
        else if (typeof jsonData[key] === "object") {
            await handleTranslateJson(jsonData[key]);
        }
    }
}

const main = async () => {
    const jsonFile = fs.readFileSync(filePath);
    const jsonData = JSON.parse(jsonFile);
    await handleTranslateJson(jsonData);

    console.log({jsonData});
    fs.writeFileSync("result.json", JSON.stringify(jsonData, null, 2));
}

main();
