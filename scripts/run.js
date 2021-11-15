const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
        ["Blossom", "Bubbles", "Buttercup"],
        ["Qmawp8NjDZoo8Gv4KwDH7KVT2fZNeXdat5PNbSyPXGbtYF", "QmWxpHEHuSkqWC7tc6uiEXZeEeZ7DZAhwiUyzjU1vAjtyZ", "QmWN9oqGYgtjm9zwMwCrwb6bN18MeqQy7JeHWBswAvSv7M"],
        [200, 300, 100],
        [50, 25, 100],
        "Mojojojo",
        "QmbxS4NK8x34J2zMCpRAHiqQgNNt5g5vXrsm7RGBptBqtT",
        10000,
        50       
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);

    let txn;
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();
    
    console.log("Done!");
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();