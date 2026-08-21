// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Vm {
    function startPrank(address sender) external {}
    function stopPrank() external {}
    function expectRevert(bytes calldata reason) external {}
    function addr(uint256 privateKey) external pure returns (address) {
        return address(uint160(privateKey));
    }
    function envOr(string calldata key, uint256 defaultValue) external pure returns (uint256) {
        return defaultValue;
    }
    function startBroadcast(uint256 privateKey) external {}
    function stopBroadcast() external {}
}

contract Test {
    Vm public constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));

    function assertEq(uint256 a, uint256 b) internal pure {
        require(a == b, "AssertEq failed: uint256");
    }

    function assertEq(address a, address b) internal pure {
        require(a == b, "AssertEq failed: address");
    }

    function assertTrue(bool condition) internal pure {
        require(condition, "AssertTrue failed");
    }
}

contract Script {
    Vm public constant vm = Vm(address(uint160(uint256(keccak256("hevm cheat code")))));
}

library console {
    function log(string memory p0) internal pure {}
    function log(string memory p0, address p1) internal pure {}
    function log(string memory p0, uint256 p1) internal pure {}
}
