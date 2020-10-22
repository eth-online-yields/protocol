const { gql, GraphQLClient } = require('graphql-request');
const { ethers } = require("ethers");

const ResolverArtifact = require('../artifacts/Resolver.json');

const UNI = 'uniswap';
const SUSHI = 'sushiswap';
const MOON = 'mooniswap';

const endpoints = {
    [UNI]: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
    [MOON]: 'https://api.thegraph.com/subgraphs/name/krboktv/try-second-graph',
    [SUSHI]: 'https://api.thegraph.com/subgraphs/name/matthewlilley/sushiswap'
};


const clients = {
    [UNI]: new GraphQLClient(endpoints[UNI], { headers: {} }),
    [SUSHI]: new GraphQLClient(endpoints[SUSHI], { headers: {} })
}

const pairs = {
    [UNI]: '0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc',
    [SUSHI]: '0x382c4a5147fd4090f7be3a9ff398f95638f5d39e'
}

const queries = {
    pair: {
        [UNI]: gql`
            query pairs {
                pair (id:"${pairs[UNI]}") {
                    id
                    totalSupply
                    volumeToken0
                    volumeToken1
                    volumeUSD
                    reserve1
                    reserve0
                    trackedReserveETH
                    reserveUSD
                }
            }   
        `,
        [SUSHI]: gql`
            query pairs {
                pair (id:"${pairs[SUSHI]}") {
                    id
                    totalSupply
                    volumeToken0
                    volumeToken1
                    volumeUSD
                    reserve1
                    reserve0
                    trackedReserveETH
                    reserveUSD
                }
            }   
        `
    },
    pairDayData: {
        [UNI]: gql`
            {
                pairDayDatas(first: 10, skip: 0, orderBy: date, orderDirection: desc, where: {pairAddress: "${pairs[UNI]}"}) {
                    id
                    date
                    dailyVolumeToken0
                    dailyVolumeToken1
                    dailyVolumeUSD
                    reserveUSD
                }
            }
        `,
        [SUSHI]: gql`
            query pairDayDatas {
                pairDayDatas(first: 10, skip: 0, orderBy: date, orderDirection: desc, where: {pair: "${pairs[SUSHI]}"}) {
                    id
                    date
                    volumeToken0
                    volumeToken1
                    volumeUSD
                    reserveUSD
                }
            }
        `,

    }
}


async function comparePools() {
    let pairDayData = await clients[UNI].request(queries.pairDayData[UNI]);
    let pairData = await clients[UNI].request(queries.pair[UNI]);

    let liquidity = pairData.pair.reserveUSD;
    let fees = pairDayData.pairDayDatas[1].dailyVolumeUSD * 0.003;
    const uniProfit = fees / liquidity;

    pairDayData = await clients[SUSHI].request(queries.pairDayData[SUSHI]);
    pairData = await clients[SUSHI].request(queries.pair[SUSHI]);
    const sushiProfit = fees / liquidity;

    liquidity = pairData.pair.reserveUSD;
    fees = pairDayData.pairDayDatas[1].volumeUSD * 0.003;


    return uniProfit >= sushiProfit ? pairs[UNI] : pairs[SUSHI];
}



function Plumber() {

    return {
        getCurrentPool: async () => {
            return await this.resolverContract.getTarget();
        },
        setBestPool: async (address) => {
            let res = await this.resolverContract.setTarget(address);
            return res;
        },
        migrateLiquidity: async () => {
            let res = await this.resolverContract.performMigration();
            return res;
        },
        init: async () => {
            var provider = ethers.getDefaultProvider();

            this.resolverContract = new ethers.Contract('0x16bbee8163d7223c8d95ed9dbffbe51276099e5b', ResolverArtifact.abi, provider);
        },
        printContract: () => {
            console.log(this.resolverContract)
        }
    }
}


async function main() {
    const plumber = new Plumber();
    await plumber.init();

    async function pipe() {
        console.log('Piping...')
        // const bestPool = await comparePools();
        // console.log(bestPool)
    
        // const currentPool = await plumber.getCurrentPool();

        // if (currentPool === bestPool) {
        //     return
        // }

        // let res = plumber.setBestPool(bestPool);
        // // check res
        // res = plumber.migrateLiquidity();
        // // check res
    }
    
    setInterval(pipe, 2000);
    pipe();
}

main();