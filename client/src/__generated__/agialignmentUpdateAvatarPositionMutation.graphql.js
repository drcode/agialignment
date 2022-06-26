/**
 * @generated SignedSource<<88fddd069ef8c0ae2b60efd5b952ce47>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "useridOverride"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "x"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "y"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "useridOverride",
        "variableName": "useridOverride"
      },
      {
        "kind": "Variable",
        "name": "x",
        "variableName": "x"
      },
      {
        "kind": "Variable",
        "name": "y",
        "variableName": "y"
      }
    ],
    "concreteType": "Avatar",
    "kind": "LinkedField",
    "name": "updateAvatarPosition",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "x",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "y",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "agialignmentUpdateAvatarPositionMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "agialignmentUpdateAvatarPositionMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a452afe6ef4d05505853761e60583782",
    "id": null,
    "metadata": {},
    "name": "agialignmentUpdateAvatarPositionMutation",
    "operationKind": "mutation",
    "text": "mutation agialignmentUpdateAvatarPositionMutation(\n  $useridOverride: String\n  $x: Int\n  $y: Int\n) {\n  updateAvatarPosition(useridOverride: $useridOverride, x: $x, y: $y) {\n    id\n    x\n    y\n  }\n}\n"
  }
};
})();

node.hash = "24e41f50526c7446102dd56780ad7da7";

module.exports = node;
