pragma solidity ^0.6.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

/// @title Router
/// @author @buendiadas<carlos@buendia.io>
/// @notice The contract connects and migrates pools from different procotols given an instruction 

contract Router {

   // Initial conditions
   address constant UNISWAP_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;
   address constant SUSHISWAP_ROUTER = 0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F;
   address constant UNISWAP_USDC_ETH = 0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc;
   address constant SUSHISWAP_USDC_ETH = 0x382c4a5147Fd4090F7BE3A9Ff398F95638F5D39E;


   /// pair => protocol
   mapping(address => address) private protocols;
   address strategy;

   constructor() public {
      protocols[UNISWAP_USDC_ETH] = UNISWAP_ROUTER;
      protocols[SUSHISWAP_USDC_ETH] = SUSHISWAP_ROUTER;
   }

   /// @notice Migrates LP tokens from one protocol to another
   /// @param _from Liquidity pool where the funds are stored
   /// @param _to Target Liquidity Pool

   function migrate(address _from, address _to) public {
      require(_from != _to);

      IUniswapV2Pair pairFrom = IUniswapV2Pair(_from);
      
      address tokenA = pairFrom.token0();
      address tokenB = pairFrom.token1();

      uint256 liquidity = IUniswapV2Pair(_from).balanceOf(msg.sender);
      
      IUniswapV2Pair(_from).approve(_to, uint(-1));
      IUniswapV2Pair(_from).transferFrom(msg.sender, address(this), liquidity);

      IUniswapV2Router02(
         getProtocolForPair(_from)
      ).removeLiquidity( 
         tokenA,
         tokenB,
         liquidity,
         0,
         0,
         address(this),
         block.timestamp + 60 * 10 
      );
      
      IUniswapV2Router02(
         getProtocolForPair(_to)
      ).addLiquidity(
          tokenA,
          tokenB,
          IUniswapV2Pair(tokenA).balanceOf(address(this)),
          IUniswapV2Pair(tokenB).balanceOf(address(this)),
          0,
          0,
          address(this),
          block.timestamp + 60 * 10 
      );
   }

   function getProtocolForPair(address _pair) public view returns (address) {
      return protocols[_pair];
   }
}
