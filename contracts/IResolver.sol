pragma solidity 0.6.8;

interface IResolver {
    function setTarget(address _target) external returns (bool);
    function performMigration() external;
    function getTarget() external view returns (address);
}