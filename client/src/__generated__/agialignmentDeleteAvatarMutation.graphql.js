/**
 * @generated SignedSource<<89cb151d525a86d4d9fbc80ac8dd4c0b>>
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
      }
    ],
    "concreteType": "App",
    "kind": "LinkedField",
    "name": "deleteAvatar",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "agialignmentDeleteAvatarMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "agialignmentDeleteAvatarMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2bdca45351317a6ac3ca4ee560b963f5",
    "id": null,
    "metadata": {},
    "name": "agialignmentDeleteAvatarMutation",
    "operationKind": "mutation",
    "text": "mutation agialignmentDeleteAvatarMutation(\n  $useridOverride: String\n) {\n  deleteAvatar(useridOverride: $useridOverride) {\n    id\n  }\n}\n"
  }
};
})();

node.hash = "4639eca4c8e52118f64dcd863b0d2ee0";

module.exports = node;
