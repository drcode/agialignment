/**
 * @generated SignedSource<<a69d8ace2e4a772f8c405a4ec7f527ae>>
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
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
    "name": "addAvatar",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Avatar",
        "kind": "LinkedField",
        "name": "avatars",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "userid",
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
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "agialignmentAddAvatarMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "agialignmentAddAvatarMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "f23ecad1998dab230fda735628d48195",
    "id": null,
    "metadata": {},
    "name": "agialignmentAddAvatarMutation",
    "operationKind": "mutation",
    "text": "mutation agialignmentAddAvatarMutation(\n  $useridOverride: String\n) {\n  addAvatar(useridOverride: $useridOverride) {\n    id\n    avatars {\n      id\n      userid\n      x\n      y\n    }\n  }\n}\n"
  }
};
})();

node.hash = "3e1b259dca487d4aa7199fe76e8b8634";

module.exports = node;
