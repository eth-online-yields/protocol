pragma solidity ^0.6.8;

import "./Router.sol";

/// @title Router
/// @author @buendiadas<carlos@buendia.io>
/// @notice Resolves the best strategy to move funds and sends them to router. 

contract Resolver {
    
    address private target;
    address private daemon;
    
    address private currentPair;

    // @dev Sets the target address for a given pair
    // @param _pair 
    // @param _target

    constructor(address _daemon) public{
        daemon = _daemon;
    }

    function setTarget(address _target) external returns (bool) {
        require(msg.sender == daemon);
        target = _target;   
    }

    function performMigration() public {
        require(msg.sender == daemon);
        // TODO: INCLUDE TIME CONSTRAINTS
        Router router = new Router();
        router.migrate(currentPair, target);
        currentPair = target;
    }

    function getTarget() public view returns (address){ 
        return target;
    }
}