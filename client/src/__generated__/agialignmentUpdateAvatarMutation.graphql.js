/**
 * @generated SignedSource<<eaf222f6e8bc4c73255e16c2c72eaba8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* eslint-disable */

'use strict';

var node = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "aiResearcher"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "aiRisk"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "message"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "useridOverride"
},
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "aiResearcher",
        "variableName": "aiResearcher"
      },
      {
        "kind": "Variable",
        "name": "aiRisk",
        "variableName": "aiRisk"
      },
      {
        "kind": "Variable",
        "name": "message",
        "variableName": "message"
      },
      {
        "kind": "Variable",
        "name": "useridOverride",
        "variableName": "useridOverride"
      }
    ],
    "concreteType": "Avatar",
    "kind": "LinkedField",
    "name": "updateAvatar",
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
        "name": "aiResearcher",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "aiRisk",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "message",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "agialignmentUpdateAvatarMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v3/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "agialignmentUpdateAvatarMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "766ad4301975891e2f2b6fe05dc65511",
    "id": null,
    "metadata": {},
    "name": "agialignmentUpdateAvatarMutation",
    "operationKind": "mutation",
    "text": "mutation agialignmentUpdateAvatarMutation(\n  $useridOverride: String\n  $aiResearcher: Boolean\n  $aiRisk: Boolean\n  $message: String\n) {\n  updateAvatar(useridOverride: $useridOverride, aiResearcher: $aiResearcher, aiRisk: $aiRisk, message: $message) {\n    id\n    aiResearcher\n    aiRisk\n    message\n  }\n}\n"
  }
};
})();

node.hash = "caa77f30c2779be445b3d843d8961928";

module.exports = node;
