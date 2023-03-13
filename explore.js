const PATH_TO_DB = "./database/db.json"

const main = async () => {
    const {collect} = await import('collect.js')
    const data = await loadData(PATH_TO_DB);
    
    const dataColl = collect(data)
        .countBy('orderSource')

    console.log(dataColl)
}


const loadData = async (filepath) => {
    const { createRequire } = await import("module");
    const require = createRequire(import.meta.url);
    const data = require(filepath);
    return data;
}

main()