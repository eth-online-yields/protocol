# PIPELITE

## Info

Pipelite creates pipes between simmilar Liquidity Pools, enabling a provider provide liquidity where it is mostly needed, maximizing their potential collected fees. 

## Install

`$ yarn`

## Start

On a different tab run: 
`$ yarn start`

## Compile

`$ yarn compile`

## Build

`$ yarn Build`

## Deploy

`$ yarn deploy`

This will deploy a new Resolver contract, the address will be displayed at the terminal. This resolver has `accounts[0]` whitelisted by defailt. Now the daemon can be connected to the resolver by using `IResolver.sol` interface at the previously deployed address at `http://localhost:8545`




